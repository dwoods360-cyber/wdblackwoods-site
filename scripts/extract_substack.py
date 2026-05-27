import json
import re
import urllib.request
from html.parser import HTMLParser
from urllib.parse import urljoin

BASE = 'https://wdblackwoods.substack.com'
POSTS = {
    'vine-crown': '/p/the-vine-crown',
    'caravanserai-incident-massawa': '/p/day-two-the-port',
    'the-arithmetic-on-the-wall': '/p/the-arithmetic-on-the-wall',
    'founding-entry-what-coffee-demands': '/p/founding-entry-what-coffee-demands',
    'start-here': '/p/start-here',
}

class SubstackParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.in_article = False
        self.article_depth = 0
        self.current_tag = None
        self.current_text = []
        self.title = None
        self.subtitle = None
        self.blocks = []
        self.images = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'article' and 'typography newsletter-post post' in attrs.get('class', ''):
            self.in_article = True
            self.article_depth = 1
            return
        if not self.in_article:
            return
        if tag == 'article':
            self.article_depth += 1
        if tag in ('h1', 'h2', 'h3', 'h4', 'p', 'blockquote'):
            self.current_tag = tag
            self.current_text = []
        elif tag == 'img' and self.in_article:
            src = attrs.get('src') or attrs.get('data-src')
            if src and not src.startswith('data:'):
                self.images.append({'src': src, 'alt': attrs.get('alt', '')})

    def handle_endtag(self, tag):
        if not self.in_article:
            return
        if tag == 'article':
            self.article_depth -= 1
            if self.article_depth == 0:
                self.in_article = False
            return
        if self.current_tag == tag:
            text = ''.join(self.current_text).strip()
            if text:
                if tag == 'h1':
                    self.title = text
                elif tag == 'h3':
                    self.subtitle = text
                elif tag in ('h2', 'h4'):
                    self.blocks.append({'type': 'heading', 'text': text})
                elif tag == 'blockquote':
                    self.blocks.append({'type': 'blockquote', 'text': text})
                else:
                    self.blocks.append({'type': 'paragraph', 'text': text})
            self.current_tag = None
            self.current_text = []

    def handle_data(self, data):
        if self.in_article and self.current_tag is not None:
            self.current_text.append(data)


def fetch_post(path):
    req = urllib.request.Request(urljoin(BASE, path), headers={'User-Agent': 'Mozilla/5.0'})
    return urllib.request.urlopen(req, timeout=30).read().decode('utf-8', errors='ignore')


def extract():
    out = []
    for key, path in POSTS.items():
        url = urljoin(BASE, path)
        print('Fetching', url)
        html = fetch_post(path)
        parser = SubstackParser()
        parser.feed(html)
        out.append({
            'slug': key,
            'url': url,
            'title': parser.title,
            'subtitle': parser.subtitle,
            'images': parser.images,
            'blocks': parser.blocks,
        })
    with open('substack_extract.json', 'w', encoding='utf-8') as f:
        json.dump(out, f, ensure_ascii=False, indent=2)
    print('Written substack_extract.json')


if __name__ == '__main__':
    extract()
