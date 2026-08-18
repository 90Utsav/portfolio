# Portfolio Website

This repository contains a static portfolio website for Utsav B K.

## GitHub Pages deployment

GitHub Pages works well for this project because it is a static site with `index.html`, `style.css`, `script.js`, and local assets.

### 1) Create a GitHub repository

- Go to GitHub and create a new repository.
- Name it something like `portfolio` or `utsavbk.github.io`.
- Keep it public or private as needed.

### 2) Push the project to GitHub

From your terminal:

```bash
git init
git add .
git commit -m "Initial portfolio commit"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

### 3) Enable GitHub Pages

- Open your repository on GitHub.
- Go to Settings > Pages.
- Under "Build and deployment", choose:
  - Source: Deploy from a branch
  - Branch: `main`
  - Folder: `/ (root)`
- Click Save.

GitHub will publish the site at:

```text
https://<your-username>.github.io/<your-repo>/
```

If the repository is named exactly `your-username.github.io`, the URL becomes:

```text
https://<your-username>.github.io/
```

### 4) Optional: custom domain

If you want a custom domain, add a `CNAME` file with your domain and configure DNS/Cloudflare in GitHub Pages settings.

## Local preview

Open `index.html` directly in a browser or serve the folder locally with any static web server.

## Notes

- This project uses only client-side HTML, CSS, and JavaScript.
- No build step is required for deployment.
- A `.nojekyll` file is included so GitHub Pages does not process the site as a Jekyll site.
