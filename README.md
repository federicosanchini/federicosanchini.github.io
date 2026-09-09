# Federico Portfolio

A lightweight portfolio designed for GitHub Pages.

## Files

- `index.html` — main page
- `styles.css` — visual design
- `projects.js` — all project content
- `app.js` — project filters + interactive modal

## Before publishing

Search the files for these placeholders and replace them:

- `YOUR_GITHUB`
- `YOUR_LINKEDIN`
- `YOUR_EMAIL`
- `YOUR_CV_LINK.pdf`
- `YOUR_SNN_REPO`
- `YOUR_OPTION_REPO`
- `YOUR_STREAMLIT_APP`

## Publish with GitHub Pages

1. Create a repository named:

   `YOUR_GITHUB_USERNAME.github.io`

2. Upload these files to the root of the repository.

3. In GitHub, open:

   `Settings → Pages`

4. Set the source to:

   `Deploy from a branch`

5. Select:

   `main` and `/ (root)`

6. Your site will be available at:

   `https://YOUR_GITHUB_USERNAME.github.io`

## Adding a project

Edit `projects.js` and duplicate one of the objects.

Each project supports:

- title
- year
- category
- short description
- tags
- long description
- bullet-point highlights
- GitHub link
- optional live demo link

The page will generate the card and project popup automatically.

## Streamlit integration

For Python projects, deploy the Python app separately on Streamlit Community Cloud and add its public URL to the project's `demo` field in `projects.js`.

This keeps the portfolio fast and static while your Python demos remain fully interactive.
