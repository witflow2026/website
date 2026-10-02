"""Generate canonical URLs, sharing metadata, structured data and sitemap."""
from pathlib import Path
from html import escape
import json
import re
from urllib.parse import urljoin, urlsplit, urlunsplit
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
config = json.loads((ROOT / 'site-pages.json').read_text())
origin = config['origin']
route_by_file = {p['file']:p['path'] for p in config['pages']}

def normalize_url(raw, filename):
    if raw.startswith(('#', 'mailto:', 'tel:', 'data:')):
        return raw
    url = urlsplit(urljoin(origin + '/' + filename, raw))
    if url.netloc != urlsplit(origin).netloc:
        return raw
    path = route_by_file.get(url.path.lstrip('/'), url.path)
    return urlunsplit(('', '', path, url.query, url.fragment))

def normalize_references(text, filename):
    # Canonical hrefs remain absolute. Only navigation/assets are normalized.
    def replace_tag(match):
        tag = match.group(0)
        if re.search(r'rel=["\x27]canonical', tag): return tag
        return re.sub(r'\b(href|src)="([^"]+)"',
                      lambda a: a[1] + '="' + normalize_url(a[2],filename) + '"',tag)
    return re.sub(r'<(?:a|img|script|link)\b[^>]*>', replace_tag,text)

for page in config['pages']:
    path = ROOT / page['file']
    text = path.read_text()
    text = re.sub(r'\n?\s*<!-- GENERATED SEO START -->.*?<!-- GENERATED SEO END -->\s*', '\n', text, flags=re.S)
    text = re.sub(r'<title>.*?</title>', '', text, flags=re.S)
    text = re.sub(r'<meta\b[^>]*(?:name="(?:description|twitter:[^"]+)"|property="og:[^"]+")[^>]*>', '',text)
    text = re.sub(r'<link\b[^>]*rel="canonical"[^>]*>', '',text)
    text = re.sub(r'<script\b[^>]*type="application/ld\+json"[^>]*>.*?</script>', '',text,flags=re.S)
    text = normalize_references(text,page['file'])
    text = text.replace('隐私与免责声明', '隐私与使用说明')
    url = origin + page['path']
    schema = {'@context':'https://schema.org','@type':page['type'],
              'name':page.get('headline',page['title']),'url':url,
              'description':page['description'],'inLanguage':'zh-CN'}
    if page['type'] == 'Article':
        schema.update(headline=page['headline'],datePublished=page['published'],
                      dateModified=page['modified'],
                      author={'@type':'Person',**config['author']},
                      mainEntityOfPage={'@type':'WebPage','@id':url},
                      image=origin+'/assets/logo.png')
    elif page['type'] == 'ProfilePage':
        schema['mainEntity'] = {'@type':'Person', **config['author']}
    elif page['type'] == 'WebSite':
        schema['name'] = 'witflow 威特流'
        schema['alternateName'] = 'Witflow'
    if page['type'] == 'CollectionPage':
        schema['hasPart'] = [{'@type':'Article','headline':p['headline'],'url':origin+p['path']}
                             for p in config['pages'] if p['type']=='Article']
    e = lambda s: escape(s,quote=True)
    data = [
        '<!-- GENERATED SEO START -->',
        f'<link rel="alternate" type="application/rss+xml" title="witflow 实战文章" href="{origin}/feed.xml">',
        f'<title>{e(page["title"])}</title>',
        f'<meta name="description" content="{e(page["description"])}">',
        f'<link rel="canonical" href="{e(url)}">',
        f'<meta property="og:type" content="{"article" if page["type"]=="Article" else "website"}">',
        '<meta property="og:site_name" content="witflow 威特流">',
        '<meta property="og:locale" content="zh_CN">',
        f'<meta property="og:url" content="{e(url)}">',
        f'<meta property="og:title" content="{e(page["title"])}">',
        f'<meta property="og:description" content="{e(page["description"])}">',
        f'<meta property="og:image" content="{origin}/assets/logo.png">',
        '<meta property="og:image:alt" content="witflow 威特流标志">',
        '<meta name="twitter:card" content="summary">',
        f'<meta name="twitter:title" content="{e(page["title"])}">',
        f'<meta name="twitter:description" content="{e(page["description"])}">',
        f'<meta name="twitter:image" content="{origin}/assets/logo.png">',
        '<script type="application/ld+json">'+json.dumps(schema,ensure_ascii=False).replace('<','\\u003c')+'</script>',
        '<!-- GENERATED SEO END -->'
    ]
    text = text.replace('</head>', '\n  '+'\n  '.join(data)+'\n</head>')
    path.write_text('\n'.join(line.rstrip() for line in text.splitlines())+'\n')

# A custom 404 must use root-relative assets even at nested missing URLs.
error = ROOT / '404.html'
text = normalize_references(error.read_text(),'404.html').replace('/#bento','/#core')
error.write_text('\n'.join(line.rstrip() for line in text.splitlines())+'\n')

ET.register_namespace('', 'http://www.sitemaps.org/schemas/sitemap/0.9')
ns = '{http://www.sitemaps.org/schemas/sitemap/0.9}'
tree = ET.Element(ns+'urlset')
for page in config['pages']:
    item = ET.SubElement(tree,ns+'url')
    ET.SubElement(item,ns+'loc').text = origin + page['path']
    ET.SubElement(item,ns+'lastmod').text = page['modified']
ET.indent(tree)
ET.ElementTree(tree).write(ROOT/'sitemap.xml',encoding='utf-8',xml_declaration=True)
(ROOT/'robots.txt').write_text('User-agent: *\nAllow: /\n\nSitemap: '+origin+'/sitemap.xml\n')
print('Generated SEO metadata and sitemap for', len(config['pages']), 'pages')
