# World Paintings Museum

An interactive, fully client-side museum website. Browse six iconic paintings, read text guides, draw directly on each painting, and save your drawings locally — no backend required.

## Live demo (GitHub Pages)

After you enable GitHub Pages (see below), your site will be at:

```
https://<your-username>.github.io/tech_rats/
```

## How to enable GitHub Pages

1. Go to your repository on GitHub.
2. Click **Settings** → **Pages** (in the left sidebar).
3. Under **Build and deployment**, set:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` / `(root)`
4. Click **Save**.
5. Wait ~60 seconds, refresh the page — GitHub will show the live URL at the top.

Anyone can now open that URL and the full site will load correctly.

## Run locally (no server needed)

Just open `index.html` directly in any browser — double-click the file or drag it into your browser window. Everything is bundled into a single script so no server is required.

## Project structure

```
index.html              ← entry point
assets/
  css/
    styles.css          ← all styles
  js/
    main.js             ← full bundled app (use this)
    app.js              ← original source (modular, needs a server)
    i18n.js             ← translations source
    paintings.js        ← painting data source
    utils.js            ← utility functions source
art/                    ← local painting images (unused in production; app uses Wikipedia URLs)
resources/              ← reference documents
```

## Features

- Gallery of 6 iconic paintings with text guides (EN / CS)
- Draw on top of any painting with pen, eraser, and undo
- Save drawings to My Gallery (stored in `localStorage`)
- Download drawings as PNG
- Language toggle (English / Czech)
- Works offline after first load
