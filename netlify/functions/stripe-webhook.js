import Stripe from 'stripe';

// IMPORTANT: GitHub fine-grained PAT expires 2026-06-26.
// When it expires, the SOLD automation will silently stop working.
// Regenerate the token and update GITHUB_TOKEN in Netlify before that date.

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const VALID_PIECE_IDS = new Set([
  'trial-run',
  'rolling-stone',
  'selective-hearing',
  'daybroke',
  'neon-mind',
]);

const INVENTORY_PATH = 'public/subsections/store-inventory.json';

export const handler = async (event) => {
  const sig = event.headers['stripe-signature'];
  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body;

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  if (stripeEvent.type !== 'checkout.session.completed') {
    return { statusCode: 200, body: 'Ignored' };
  }

  const pieceId = stripeEvent.data.object.metadata?.pieceId;
  if (!pieceId || !VALID_PIECE_IDS.has(pieceId)) {
    console.error('Unknown or missing pieceId in session metadata:', pieceId);
    return { statusCode: 200, body: 'Unknown piece — no inventory update' };
  }

  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const fileUrl = `https://api.github.com/repos/${repo}/contents/${INVENTORY_PATH}`;
  const githubHeaders = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
  };

  // Fetch current inventory file + its SHA (required for the PUT)
  let sha, inventory;
  try {
    const res = await fetch(fileUrl, { headers: githubHeaders });
    if (!res.ok) throw new Error(`GitHub GET ${res.status}`);
    const data = await res.json();
    sha = data.sha;
    inventory = JSON.parse(Buffer.from(data.content, 'base64').toString('utf8'));
  } catch (err) {
    console.error('Failed to fetch store-inventory.json from GitHub:', err.message);
    return { statusCode: 500, body: 'Failed to read inventory' };
  }

  inventory[pieceId] = 'sold';

  // Commit the updated inventory back to the repo, triggering a Netlify redeploy
  try {
    const res = await fetch(fileUrl, {
      method: 'PUT',
      headers: { ...githubHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `Auto: mark ${pieceId} as sold via Stripe webhook`,
        content: Buffer.from(JSON.stringify(inventory, null, 2) + '\n').toString('base64'),
        sha,
        branch: 'main',
      }),
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`GitHub PUT ${res.status}: ${errText}`);
    }
  } catch (err) {
    console.error('Failed to commit inventory update to GitHub:', err.message);
    // Payment already succeeded at this point — Jake will need to manually mark as sold
    return { statusCode: 500, body: 'Failed to update inventory' };
  }

  console.log(`Marked ${pieceId} as sold and committed to GitHub`);
  return { statusCode: 200, body: 'OK' };
};
