# Jake Galm Portfolio Website

This is a mobile-responsive portfolio website built with React, Tailwind CSS, and Framer Motion.

## Features

- **Interactive Drip Animation**: Custom drips that animate based on navigation.
- **Responsive Design**: Horizontal layout for desktops/tablets and vertical layout for smartphones.
- **Section-Based Navigation**: WORK, ABOUT, and SUPPORT sections with context-aware bottom menus.
- **Easy to Edit**: Subsections are powered by simple HTML files located in `public/subsections/`.

## Project Structure

- `src/App.tsx`: The main application logic and layout.
- `src/constants.ts`: Definitions for sections and subsections.
- `public/subsections/`: Contains the HTML files for each part of the website. Edit these to change the content.
- `public/`: Place your images here (e.g., `jakegalm.jpg`, `work.jpg`, etc.).

## How to Edit Content

To change the text or layout of a specific section (like "Analog" or "Contact"), simply open the corresponding file in `public/subsections/` and edit the HTML/CSS inside.

## Deployment on GitHub Pages

1. **Create a GitHub Repository**: Go to GitHub and create a new repository.
2. **Push your code**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/yourusername/your-repo-name.git
   git push -u origin main
   ```
3. **Configure GitHub Actions**:
   - Go to your repository settings on GitHub.
   - Select **Pages** from the sidebar.
   - Under **Build and deployment**, set the **Source** to **GitHub Actions**.
   - GitHub will automatically detect the Vite project and provide a workflow to deploy it.

## Security Best Practices

- **HTTPS**: Always serve your website over HTTPS (GitHub Pages does this by default).
- **Content Security Policy (CSP)**: Consider adding a CSP header to prevent cross-site scripting (XSS).
- **Sanitization**: If you ever add forms or user input, ensure you sanitize the data on the server side.
- **Dependency Updates**: Regularly run `npm update` to keep your libraries secure.

## Minimum Coding Experience Guide

- **Changing Images**: Replace the files in the `public/` folder with your own images, keeping the same filenames.
- **Changing Colors**: Look for hex codes like `#8bc34a` (green) or `bg-black` in `src/App.tsx` and change them to your preferred colors.
- **Adding Sections**: 
  1. Add a new entry to the `Section` enum in `src/constants.ts`.
  2. Add a button in the `header` or `footer` in `src/App.tsx`.
  3. Create a new HTML file in `public/subsections/`.
