"""Generate an RSS 2.0 feed from the same article metadata as the website."""
from pathlib import Path
from datetime import datetime, timezone
from email.utils import format_datetime
import json
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[1]
config = json.loads((ROOT/'site-pages.json').read_text())
origin = config['origin']
ET.register_namespace('atom', 'http://www.w3.org/2005/Atom')
root = ET.Element('rss', version='2.0')
channel = ET.SubElement(root, 'channel')
for key, value in [('title','witflow 威特流 · 外贸实战文章'),('link',origin+'/articles/'),('description','询盘审查、价格谈判与外贸工作方法。'),('language','zh-CN')]:
    ET.SubElement(channel,key).text=value
ET.SubElement(channel,'{http://www.w3.org/2005/Atom}link',href=origin+'/feed.xml',rel='self',type='application/rss+xml')
articles=sorted((p for p in config['pages'] if p['type']=='Article'),key=lambda p:(p['published'],p['path']),reverse=True)
for page in articles:
    item=ET.SubElement(channel,'item')
    for key,value in [('title',page['headline']),('link',origin+page['path']),('description',page['description'])]:
        ET.SubElement(item,key).text=value
    ET.SubElement(item,'guid',isPermaLink='true').text=origin+page['path']
    ET.SubElement(item,'pubDate').text=format_datetime(datetime.fromisoformat(page['published']).replace(tzinfo=timezone.utc),usegmt=True)
ET.indent(root)
ET.ElementTree(root).write(ROOT/'feed.xml',encoding='utf-8',xml_declaration=True)
print('Generated RSS with',len(articles),'articles')
