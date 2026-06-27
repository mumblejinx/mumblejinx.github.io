import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Server-side source of truth for Price IDs — client input is validated against this
const PRICE_IDS = {
  'trial-run':         'price_1TmRYmEEmu8yWc6RgjyvIwyU',
  'rolling-stone':     'price_1TmRbsEEmu8yWc6RWpbvTBth',
  'selective-hearing': 'price_1TmReDEEmu8yWc6RNCLIFpMD',
  'daybroke':          'price_1TmRfnEEmu8yWc6Rs5ka4siW',
  'neon-mind':         'price_1TmRhaEEmu8yWc6RVHo1ZTP8',
};

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let id;
  try {
    ({ id } = JSON.parse(event.body));
  } catch {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Invalid request body' }),
    };
  }

  const priceId = PRICE_IDS[id];
  if (!priceId) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Unknown piece' }),
    };
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: priceId, quantity: 1 }],
      metadata: { pieceId: id },
      success_url: `${process.env.SITE_URL}/subsections/store-thank-you.html`,
      cancel_url: `${process.env.SITE_URL}/`,
    });

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error('Stripe checkout error:', err.message);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Failed to create checkout session' }),
    };
  }
};
