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


print('http://localhost:8766/maqueta/')
http.server.ThreadingHTTPServer(('127.0.0.1', 8766), H).serve_forever()
