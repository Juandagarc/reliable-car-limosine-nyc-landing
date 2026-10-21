"""Inline assets/css/styles.css into index.html (removes the render-blocking stylesheet request).

Edit assets/css/styles.css, then run:  python3 tools/inline_css.py
"""
import pathlib
import re

root = pathlib.Path(__file__).resolve().parent.parent
css = (root / "assets/css/styles.css").read_text()

# light minification: drop comments and collapse whitespace
css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)
css = re.sub(r"\s+", " ", css)
css = re.sub(r"\s*([{};:,>])\s*", r"\1", css).replace(";}", "}").strip()

page = root / "index.html"
html = page.read_text()
block = f'<style id="site-css">{css}</style>'
if 'id="site-css"' in html:
    html = re.sub(r'<style id="site-css">.*?</style>', lambda _: block, html, flags=re.S)
else:
    html = html.replace('<link rel="stylesheet" href="/assets/css/styles.css">', block)
page.write_text(html)
print(f"Inlined {len(css):,} bytes of CSS into index.html")
