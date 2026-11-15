# The layout sandbox's own server: the repo root on 127.0.0.1:8766, nothing
# cached (so every reload shows the latest CSS and JS). Open /maqueta/.
#   python3 maqueta/serve.py
import http.server, os

os.chdir(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))


class H(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def log_message(self, *a):
        pass

    # Trama's own 404 page for any address under /maqueta/ that doesn't
    # exist (as GitHub Pages does with a root 404.html)
    def send_error(self, code, message=None, explain=None):
        if code == 404 and self.path.startswith('/maqueta/'):
            body = open('maqueta/404.html', 'rb').read()
            self.send_response(404)
            self.send_header('Content-Type', 'text/html; charset=utf-8')
            self.send_header('Content-Length', str(len(body)))
            self.end_headers()
            if self.command != 'HEAD':
                self.wfile.write(body)
            return
        super().send_error(code, message, explain)


print('http://localhost:8766/maqueta/')
http.server.ThreadingHTTPServer(('127.0.0.1', 8766), H).serve_forever()
