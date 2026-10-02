"""Local preview with production-like clean URLs, security headers and 404s."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import urlsplit, unquote
import argparse

ROOT = Path(__file__).resolve().parents[1]/'dist'
parser = argparse.ArgumentParser()
parser.add_argument('--port', type=int, default=8766)
args = parser.parse_args()

class Handler(SimpleHTTPRequestHandler):
    def __init__(self,*args,**kwargs):
        super().__init__(*args,directory=str(ROOT),**kwargs)
    def end_headers(self):
        for line in (ROOT/'_headers').read_text().splitlines():
            if line.startswith('  ') and ':' in line:
                name,value=line.strip().split(':',1)
                self.send_header(name,value.strip())
        super().end_headers()
    def do_GET(self):
        parsed = urlsplit(self.path)
        path = unquote(parsed.path)
        relative = path.lstrip('/')
        candidate = (ROOT/relative).resolve()
        if not candidate.is_relative_to(ROOT.resolve()):
            self.send_error(404);return
        if path.endswith('.html') and path != '/404.html' and candidate.is_file():
            destination = path[:-10] if path.endswith('/index.html') else path[:-5]
            if parsed.query: destination += '?'+parsed.query
            self.send_response(308);self.send_header('Location',destination);self.end_headers();return
        if path == '/index.html':
            self.send_response(308);self.send_header('Location','/');self.end_headers();return
        if path != '/' and candidate.is_dir() and not path.endswith('/'):
            self.send_response(308);self.send_header('Location',path+'/');self.end_headers();return
        if candidate.is_dir(): candidate = candidate/'index.html'
        if not candidate.exists() and not Path(path).suffix:
            candidate = candidate.with_suffix('.html')
        if candidate.is_file():
            self.path = '/'+candidate.relative_to(ROOT.resolve()).as_posix()
            return super().do_GET()
        self.send_response(404)
        self.send_header('Content-Type','text/html; charset=utf-8')
        self.end_headers();self.wfile.write((ROOT/'404.html').read_bytes())

print(f'Preview: http://127.0.0.1:{args.port}/',flush=True)
ThreadingHTTPServer(('127.0.0.1',args.port),Handler).serve_forever()
