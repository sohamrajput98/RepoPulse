from http.server import HTTPServer, BaseHTTPRequestHandler
import subprocess, json, urllib.parse

class Handler(BaseHTTPRequestHandler):
    def log_message(self, *args): pass

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_POST(self):
        if self.path != '/analyze':
            self.send_response(404); self.end_headers(); return

        length = int(self.headers['Content-Length'])
        body   = json.loads(self.rfile.read(length))
        url    = body.get('url', '').strip()

        if not url:
            self._json(400, {'error': 'No URL provided'}); return

        try:
            result = subprocess.run(
                ['bash', 'scripts/analyze_github.sh', url],
                capture_output=True, text=True, timeout=120
            )
            if result.returncode != 0:
                self._json(500, {'error': result.stderr}); return
            self._json(200, {'ok': True})
        except subprocess.TimeoutExpired:
            self._json(500, {'error': 'Timeout — repo too large'})
        except Exception as e:
            self._json(500, {'error': str(e)})

    def _json(self, code, data):
        body = json.dumps(data).encode()
        self.send_response(code)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Content-Length', len(body))
        self.end_headers()
        self.wfile.write(body)

HTTPServer(('localhost', 7777), Handler).serve_forever()