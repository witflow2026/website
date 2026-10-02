"""Build only allowlisted public files; private/development files never ship."""
from pathlib import Path
import json
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
subprocess.run([sys.executable,str(ROOT/'scripts/generate-metadata.py')],check=True)
config = json.loads((ROOT/'site-pages.json').read_text())
files = [p['file'] for p in config['pages']] + [
    '404.html','homepage.css','homepage.js','styles.css','main.js',
    'content-pages.css','tools-theme.css','prompt-builder.css','prompt-builder.js',
    'robots.txt','sitemap.xml','_headers',
    'assets/logo.png','assets/favicon-16.png','assets/favicon-32.png',
    'assets/qr-wechat-official.jpg','assets/qr-wechat-personal.jpg',
    'downloads/pre-quote-clarification.pdf','downloads/negotiation-planner.pdf',
    'downloads/quote-follow-up.pdf'
]
out = ROOT/'dist'
if out.exists(): shutil.rmtree(out)
out.mkdir()
for name in files:
    source = ROOT/name
    if not source.is_file(): raise FileNotFoundError(source)
    target = out/name
    target.parent.mkdir(parents=True,exist_ok=True)
    shutil.copyfile(source,target)
print('Built',len(files),'public files in',out)
