# Reliable Luxury Car & Limousine Service

Website for [1reliablelimo.com](https://1reliablelimo.com), a chauffeured car and limousine service in New York City.

Static site built with plain HTML, CSS and JavaScript. No frameworks, no build step.

## Stack

- HTML, CSS, vanilla JS
- Self-hosted fonts (Montserrat, Inter)
- AVIF/WebP responsive images
- nginx (Docker), deployed with Coolify

## Structure

```
index.html          Landing page
404.html            Error page
booking/            Redirect from the old booking URL
assets/css/         Styles
assets/js/          Scripts (main.js, main.min.js)
assets/img/         Logo, photos, icons
assets/fonts/       Web fonts
deploy/nginx.conf   nginx config used by the Docker image
tools/              Local helper scripts
```

## Run locally

```
python3 tools/serve.py
```

Then open http://localhost:8765.

## Deploy

```
docker build -t reliable-limo .
docker run -p 8080:80 reliable-limo
```

In Coolify, point the app to this repo and use the Dockerfile build pack. HTTPS is handled by Coolify's proxy.

`.htaccess`, `_headers` and `_redirects` are included for Apache, Netlify or Cloudflare Pages hosting.

## Editing

- CSS: edit `assets/css/styles.css`, then run `python3 tools/inline_css.py` to update the inlined styles in `index.html`.
- JS: edit `assets/js/main.js`, then minify to `assets/js/main.min.js`:
  ```
  pip install rjsmin
  python3 -m rjsmin < assets/js/main.js > assets/js/main.min.js
  ```
  Bump the version query string in `index.html` so browsers pick up the change.
- Files under `/assets/` are cached for one year, so rename or version any asset you replace.

## Credits

Photos from [Unsplash](https://unsplash.com).

## License

© Reliable Luxury Car & Limousine Service. All rights reserved.
