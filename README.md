# libterm-web

The documentation site for [libterm](https://github.com/rizukirr/libterm), built with Docusaurus and published to GitHub Pages at https://rizukirr.github.io/libterm-web/.

## Develop

```sh
npm install
npm start          # dev server with live reload
npm run build      # static site in build/
```

## Layout

- `docs/` holds the pages: getting started, tutorials, guides, examples and the API reference under `docs/api/`.
- `src/pages/index.js` is the landing page. Its styles live in `src/css/custom.css`, on the Cobalt tokens in `src/css/tokens.css`.
- `src/data/captures.js` holds real screens of the example programs. Regenerate them with `scripts/capture-examples.py` after an example changes (needs `pyte`, `pip install pyte`).
- `scripts/check-api-coverage.mjs` fails when a public identifier in `libterm.h` is missing from the docs. Run it against a libterm checkout:

```sh
node scripts/check-api-coverage.mjs ../libterm/include/libterm/libterm.h
```

## Writing style

The pages follow a plain style: no em or en dashes, no semicolons in prose, straight quotes, no emoji, sentence-case headings, no lists of bold labels, and no paragraphs about how things used to work. `scripts/check-plain.mjs` checks the mechanical part:

```sh
node scripts/check-plain.mjs
```

## Deploy

Pushes to `main` build and deploy through `.github/workflows/deploy.yml`. In the repository settings, set Pages to deploy from GitHub Actions.
