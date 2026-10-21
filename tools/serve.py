"""Local server that behaves like production (gzip + long cache for /assets), for Lighthouse testing.

Run:  python3 tools/serve.py   ->  http://localhost:8765
"""
import gzip
import http.server
import pathlib
import socketserver

ROOT = pathlib.Path(__file__).resolve().parent.parent
COMPRESSIBLE = (".html", ".css", ".js", ".svg", ".json", ".xml", ".txt", ".webmanifest")


class Handler(http.server.SimpleHTTPRequestHandler):
    extensions_map = {**http.server.SimpleHTTPRequestHandler.extensions_map,
                      ".avif": "image/avif", ".webp": "image/webp", ".woff2": "font/woff2",
                      ".webmanifest": "application/manifest+json"}

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        path = self.path.split("?")[0]
        if path.startswith("/assets/"):
            self.send_header("Cache-Control", "public, max-age=31536000, immutable")
        else:
            self.send_header("Cache-Control", "public, max-age=0, must-revalidate")
        super().end_headers()

    def send_head(self):
        path = pathlib.Path(self.translate_path(self.path))
        if path.is_dir():
            path = path / "index.html"
        if (path.suffix in COMPRESSIBLE and path.is_file()
                and "gzip" in self.headers.get("Accept-Encoding", "")):
            data = gzip.compress(path.read_bytes(), 9)
            self.send_response(200)
            self.send_header("Content-Type", self.guess_type(str(path)))
            self.send_header("Content-Encoding", "gzip")
            self.send_header("Content-Length", str(len(data)))
            self.end_headers()
            return _Bytes(data)
        return super().send_head()


class _Bytes:
    def __init__(self, data):
        self.data = data

    def read(self, *_):
        d, self.data = self.data, b""
        return d

    def close(self):
        pass


if __name__ == "__main__":
    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.ThreadingTCPServer(("127.0.0.1", 8765), Handler) as httpd:
        print("Serving on http://localhost:8765")
        httpd.serve_forever()
