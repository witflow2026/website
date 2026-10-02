"""Check routing, SEO metadata, local links and actual preview responses."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin, urlsplit, unquote
from urllib.request import urlopen, build_opener, HTTPRedirectHandler
from urllib.error import HTTPError
import argparse
import json
import re
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT/'dist'
config = json.loads((ROOT/'site-pages.json').read_text())
pages = config['pages']
origin = config['origin']
routes = {p['path']:p['file'] for p in pages}

class Document(HTMLParser):
    def __init__(self,text):
        super().__init__();self.ids=set();self.refs=[];self.canonicals=[]
        self.h1=0;self.titles=0;self.description=0
        self.feed(text)
    def handle_starttag(self,tag,attrs):
        data=dict(attrs)
        if data.get('id'): self.ids.add(data['id'])
        if tag=='h1': self.h1+=1
        if tag=='title': self.titles+=1
        if tag=='meta' and data.get('name')=='description': self.description+=1
        if tag=='link' and data.get('rel')=='canonical': self.canonicals.append(data['href'])
        if tag=='a' and data.get('href'): self.refs.append(data['href'])
        if tag in ['img','script'] and data.get('src'): self.refs.append(data['src'])
        if tag=='link' and data.get('href') and data.get('rel')!='canonical': self.refs.append(data['href'])

docs={}
titles=set()
for page in pages:
    text=(DIST/page['file']).read_text()
    doc=Document(text);docs[page['file']]=doc
    assert doc.canonicals == [origin+page['path']], page['file']+' canonical mismatch'
    assert (doc.h1,doc.titles,doc.description)==(1,1,1), page['file']+' heading/metadata count'
    assert page['title'] not in titles, 'Duplicate title'
    titles.add(page['title'])
    schemas=[json.loads(s) for s in re.findall(r'<script[^>]*type="application/ld\+json"[^>]*>(.*?)</script>',text,re.S)]
    assert len(schemas)==1 and schemas[0]['@type']==page['type']
    if page['type']=='Article':
        assert schemas[0]['author']['url']==origin+'/about'
        assert schemas[0]['datePublished']=='2026-09-17'
        assert f'datetime="{page["modified"]}"' in text
    assert '/cdn-cgi/' not in text, 'Infrastructure-injected code remained in source'

docs['404.html']=Document((DIST/'404.html').read_text())
for filename,doc in docs.items():
    base=origin+next((p['path'] for p in pages if p['file']==filename),'/404.html')
    for ref in doc.refs:
        if ref.startswith(('mailto:','tel:','data:')):continue
        url=urlsplit(urljoin(base,ref))
        if url.netloc!=urlsplit(origin).netloc:continue
        path=unquote(url.path)
        target=routes.get(path,path.lstrip('/'))
        file=DIST/target
        assert file.is_file(), f'{filename}: missing {ref} ({target})'
        assert not (path.endswith('.html') and path!='/404.html'), f'Old URL in {filename}: {ref}'
        if url.fragment and target in docs:
            assert unquote(url.fragment) in docs[target].ids, f'{filename}: missing anchor {ref}'

ns={'s':'http://www.sitemaps.org/schemas/sitemap/0.9'}
sitemap=ET.parse(DIST/'sitemap.xml')
locations={n.text for n in sitemap.findall('.//s:loc',ns)}
assert locations=={origin+p['path'] for p in pages}, 'Sitemap differs from page registry'
feed=ET.parse(DIST/'feed.xml')
items=feed.findall('./channel/item')
assert {item.findtext('link') for item in items}=={origin+p['path'] for p in pages if p['type']=='Article'}, 'RSS article URLs mismatch'
assert len({item.findtext('guid') for item in items})==len(items), 'Duplicate RSS GUID'
for item in items:
    from email.utils import parsedate_to_datetime
    assert parsedate_to_datetime(item.findtext('pubDate')).tzinfo is not None, 'RSS date lacks timezone'
with urlopen('http://127.0.0.1:8766/feed.xml') as response:
    assert response.status==200 and response.read()==(DIST/'feed.xml').read_bytes()
for file in DIST.rglob('*'):
    if file.is_file():
        assert not any(part in ['.git','tmp','scripts','docs','__pycache__'] for part in file.parts)
        assert file.suffix not in ['.md','.py','.json','.zip'], 'Development file in public output: '+str(file)

parser=argparse.ArgumentParser();parser.add_argument('--url',default='http://127.0.0.1:8766')
args=parser.parse_args()
for page in pages:
    with urlopen(args.url+page['path']) as response:
        assert response.status==200, page['path']
        assert response.headers.get('X-Content-Type-Options')=='nosniff'
        assert "script-src 'self'" in response.headers.get('Content-Security-Policy','')
        assert response.read()==(DIST/page['file']).read_bytes()

class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self,*args,**kwargs):return None
opener=build_opener(NoRedirect())
for page in pages:
    try: opener.open(args.url+'/'+page['file'])
    except HTTPError as error:
        assert error.code==308
        assert error.headers['Location']==page['path'], page['file']+' wrong redirect'
    else: raise AssertionError('Missing permanent redirect: '+page['file'])
try: urlopen(args.url+'/nested/missing-page-20261002')
except HTTPError as error:
    assert error.code==404
    body=error.read().decode()
    assert 'noindex' in body and 'src="/assets/logo.png"' in body
else: raise AssertionError('Missing page did not return 404')
print(f'PASS: {len(pages)} pages, metadata/schema, all internal links and anchors, sitemap, output allowlist, clean-URL redirects, security headers and nested 404')
