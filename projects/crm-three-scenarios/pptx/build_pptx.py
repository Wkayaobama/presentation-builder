#!/usr/bin/env python3
"""HTML deck -> pandoc markdown -> pptx producer.

Step 1 (intermediate markdown): parse the self-contained HTML deck and write one pandoc
slide-show markdown file. Each HTML slide becomes one or more pptx slides (dense slides
are chunked by a word budget so nothing overflows PowerPoint's content placeholder); the
inline SVG metaphors are embedded as the PNGs rendered by render_figures.js; the per-slide
provenance notes of the HTML deck become speaker notes.

Step 2 (producer): run pandoc on that markdown (default invocation, no special flags):

    cd projects/crm-three-scenarios/pptx
    node render_figures.js "../../Finished Presentations/crm-three-scenarios.html" figures
    python3 build_pptx.py            # writes crm-three-scenarios.md
    pandoc crm-three-scenarios.md -o "../../Finished Presentations/crm-three-scenarios.pptx"

`python3 build_pptx.py --pptx` runs the pandoc step for you. The markdown is the editable
intermediate: change wording there and re-run pandoc; change facts in the HTML deck (and the
evidence ledger) and re-run the whole chain so the two renderings stay in sync.
"""
from __future__ import annotations
import argparse, json, os, re, subprocess, sys
from lxml import html as LH

HERE = os.path.dirname(os.path.abspath(__file__))
DEFAULT_DECK = os.path.join(HERE, '..', '..', '..', 'Finished Presentations', 'crm-three-scenarios.html')
DEFAULT_PPTX = os.path.join(HERE, '..', '..', '..', 'Finished Presentations', 'crm-three-scenarios.pptx')

LINES_PLAIN = 11      # line budget per pptx slide of text at 16pt (override with --budget)
WORDS_TABLE = 100     # word budget for a table slide (tables are never mixed with text)

# ----------------------------------------------------------------------------- inline text
def esc(t: str) -> str:
    """Escape pandoc-markdown specials in plain text."""
    t = t.replace('\\', '\\\\')
    for ch in '*_<[]$^~`':
        t = t.replace(ch, '\\' + ch)
    t = t.replace('|', '\\|')
    return t

def cls(el) -> list[str]:
    return (el.get('class') or '').split()

def inline(el, in_table=False) -> str:
    """Convert an element's inline content to markdown (recursively)."""
    out = []
    if el.text:
        out.append(esc(el.text))
    for ch in el:
        tag = ch.tag if isinstance(ch.tag, str) else ''
        c = cls(ch)
        if tag == 'br':
            out.append(' — ' if in_table else '\\\n')
        elif tag in ('b', 'strong'):
            inner = inline(ch, in_table).strip()
            if inner:
                out.append(f'**{inner}**')
        elif tag in ('i', 'em'):
            inner = inline(ch, in_table).strip()
            if inner:
                out.append(f'*{inner}*')
        elif tag == 'kbd':
            out.append(f'**{inline(ch, in_table).strip()}**')
        elif tag == 'sup' and 'ref' in c:
            out.append(f'^{ch.text_content().strip()}^')
        elif tag == 'sup':
            out.append(f'^{inline(ch, in_table).strip()}^')
        elif tag == 'svg':
            pass
        elif tag == 'span' and 'badge' in c:
            out.append(f'*{ch.text_content().strip()}*')
        elif tag == 'span' and 'chip' in c:
            out.append(ch.text_content().strip() + ' ')
        elif tag == 'span' and 'lab' in c:
            out.append(f'**{inline(ch, in_table).strip()}:** ')
        elif tag == 'span' and 'amt' in c:
            out.append(inline(ch, in_table).strip() + ' ')
        elif tag == 'span' and 'conf' in c:
            out.append(f' *({inline(ch, in_table).strip()})*')
        elif tag == 'span' and 'small' in c:
            out.append(' — ' + inline(ch, in_table).strip())
        elif tag in ('span', 'a', 'code', 'small', 'u', 'mark'):
            out.append(inline(ch, in_table))
        else:  # block-ish child inside an inline context: flatten
            out.append(inline(ch, in_table))
        if ch.tail:
            out.append(esc(ch.tail))
    s = ''.join(out)
    s = re.sub(r'[ \t]+', ' ', s)
    return s.strip()

def words(s: str) -> int:
    return len(re.sub(r'[^\w\s]', ' ', s).split())

# ----------------------------------------------------------------------------- blocks
class Block:
    def __init__(self, kind, md='', items=None, rows=None, header=None, image=None, caption='', wide=False, newslide=None):
        self.kind = kind            # para | quote | list | table | image | heading
        self.md = md
        self.items = items or []    # list items (markdown strings)
        self.rows = rows or []      # table body rows (list of cell strings)
        self.header = header or []  # table header cells
        self.image = image          # path for image blocks
        self.caption = caption
        self.wide = wide
        self.newslide = newslide    # title override: start a fresh pptx slide for this block

    def lines(self):
        """Estimated rendered lines at 16pt in pandoc's 9-inch content placeholder (character based)."""
        import math
        def plain(s):  # visible characters, bold runs weighted 1.15x (wider glyphs)
            bold = sum(len(m) for m in re.findall(r'\*\*(.+?)\*\*', s))
            return len(re.sub(r'[*_\\^]', '', s)) + 0.15 * bold
        if self.kind == 'list':
            return sum(max(1, math.ceil(plain(i) / 76)) for i in self.items)
        if self.kind == 'quote':
            return math.ceil(plain(self.md) / 68) + 1
        if self.kind == 'heading':
            return max(1, math.ceil(plain(self.md) / 85))
        if self.kind in ('image', 'table'):
            return 0
        return max(1, math.ceil(plain(self.md) / 85)) + self.md.count('\\\n')

    def word_count(self):
        if self.kind == 'list':
            return sum(words(i) for i in self.items)
        if self.kind == 'table':
            return sum(words(c) for r in self.rows for c in r) + sum(words(c) for c in self.header)
        if self.kind == 'image':
            return 0
        return words(self.md)

    def render(self) -> str:
        if self.kind == 'para':
            return self.md
        if self.kind == 'heading':
            return f'**{self.md}**'
        if self.kind == 'quote':
            return '> ' + self.md.replace('\\\n', ' ')
        if self.kind == 'list':
            return '\n'.join('- ' + i.replace('\\\n', ' ') for i in self.items)
        if self.kind == 'table':
            hdr = self.header or [''] * len(self.rows[0])
            lines = ['| ' + ' | '.join(hdr) + ' |', '|' + '|'.join(['---'] * len(hdr)) + '|']
            for r in self.rows:
                lines.append('| ' + ' | '.join(c.replace('\\\n', ' — ') for c in r) + ' |')
            return '\n'.join(lines)
        if self.kind == 'image':
            return f'![]({self.image})'
        return self.md

def split_block(b: Block, budget: int) -> list[Block]:
    """Split an oversized list or table into several blocks that fit the budget."""
    if b.kind == 'list' and b.lines() > budget and len(b.items) > 1:
        import math
        out, cur, n = [], [], 0
        for it in b.items:
            w = max(1, math.ceil((len(re.sub(r'[*_\\^]', '', it)) + 0.15 * sum(len(m) for m in re.findall(r'\*\*(.+?)\*\*', it))) / 76))
            if cur and n + w > budget:
                out.append(Block('list', items=cur)); cur, n = [], 0
            cur.append(it); n += w
        if cur:
            out.append(Block('list', items=cur))
        return out
    if b.kind == 'table' and b.word_count() > budget and len(b.rows) > 1:
        out, cur, n = [], [], 0
        for r in b.rows:
            w = sum(words(c) for c in r)
            if cur and n + w > budget:
                out.append(Block('table', header=b.header, rows=cur)); cur, n = [], 0
            cur.append(r); n += w
        if cur:
            out.append(Block('table', header=b.header, rows=cur))
        if b.newslide:
            for i, part in enumerate(out, 1):
                part.newslide = f'{b.newslide} ({i}/{len(out)})' if len(out) > 1 else b.newslide
        return out
    return [b]

# ----------------------------------------------------------------------------- HTML -> blocks
class SlideConverter:
    def __init__(self, slide_el, index, manifest):
        self.el = slide_el
        self.index = index
        self.figs = {m['svgIndex']: m for m in manifest if m['slide'] == index}
        self.svg_seen = 0
        self.blocks: list[Block] = []
        self.title = ''
        self.kicker = ''
        self.subtitle = ''

    def convert(self):
        content = self.el.find_class('content')
        root = content[0] if content else self.el
        for ch in root:
            self.visit(ch, top=True)
        return self

    def add(self, b: Block):
        if b.kind in ('para', 'heading', 'quote') and not b.md.strip():
            return
        self.blocks.append(b)

    def visit(self, el, top=False):
        tag = el.tag if isinstance(el.tag, str) else ''
        c = cls(el)
        if tag == 'h1':
            self.title = inline(el); return
        if tag == 'h2':
            if top and not self.subtitle:
                self.subtitle = inline(el)
            self.add(Block('para', f'*{inline(el)}*')); return
        if 'notes' in c:
            return
        if tag == 'svg':
            m = self.figs.get(self.svg_seen); self.svg_seen += 1
            if m:
                self.add(Block('image', image='figures/' + m['file'], caption=m['title']))
            return
        if tag == 'figure':
            for ch in el:
                self.visit(ch)
            return
        if 'kicker' in c:
            if top and not self.kicker:
                self.kicker = inline(el)
                self.add(Block('para', f'*{self.kicker}*'))
            else:
                self.add(Block('heading', inline(el)))
            return
        if 'icons' in c:
            self.add(Block('para', ' '.join(inline(ch) for ch in el if inline(ch)))); return
        if 'chips' in c:
            self.add(Block('para', ' · '.join(ch.text_content().strip() for ch in el if ch.text_content().strip()))); return
        if 'tiles' in c:
            vals, labs = [], []
            for t in el.find_class('tile'):
                v = t.find_class('v'); l = t.find_class('l')
                vals.append('**' + (inline(v[0], True) if v else '') + '**'); labs.append(inline(l[0], True) if l else '')
            self.add(Block('list', items=[f'{v} {l}' for v, l in zip(vals, labs)])); return
        if 'bars' in c:
            rows = []
            for bar in el.find_class('bar'):
                lbl = bar.find_class('lbl'); val = bar.find_class('val')
                rows.append([inline(lbl[0], True) if lbl else '', inline(val[0], True) if val else ''])
            self.add(Block('list', items=[f'{l} — {v}' for l, v in rows])); return
        if tag == 'table':
            self.table(el); return
        if 'hcgrid' in c:
            items = []
            for hc in el.find_class('hc'):
                rank = hc.find_class('rank'); name = hc.find_class('name'); why = hc.find_class('why'); badge = hc.find_class('badge')
                items.append(f"**{inline(rank[0]) if rank else ''} {inline(name[0]) if name else ''}** — {inline(why[0]) if why else ''}" + (f" — *{badge[0].text_content().strip()}*" if badge else ''))
            self.add(Block('list', items=items)); return
        if tag in ('ul', 'ol'):
            self.add(Block('list', items=[inline(li) for li in el if isinstance(li.tag, str) and li.tag == 'li'])); return
        if tag == 'blockquote':
            self.add(Block('quote', inline(el))); return
        if 'card' in c or 'col' in c or 'gcard' in c:
            for ch in el:
                self.visit(ch)
            return
        if 'colh' in c or 'stat' in c or (tag == 'div' and 't' in c):
            self.add(Block('heading' if 'colh' in c else 'para', ('**' + inline(el) + '**') if 'colh' not in c else inline(el))); return
        if any(k in c for k in ('grid', 'cols', 'stack', 'row', 'side', 'boundary', 'lowgrid', 'icons', 'b-left', 'b-right', 'gwrap')):
            for ch in el:
                self.visit(ch)
            return
        # generic container or text element
        has_block_children = any(isinstance(ch.tag, str) and ch.tag in ('div', 'ul', 'ol', 'table', 'figure', 'blockquote', 'svg', 'h2', 'h1') for ch in el)
        if has_block_children:
            lead = esc(el.text or '').strip()
            if lead:
                self.add(Block('para', lead))
            for ch in el:
                self.visit(ch)
                if ch.tail and ch.tail.strip():
                    self.add(Block('para', esc(ch.tail.strip())))
            return
        txt = inline(el)
        if txt:
            self.add(Block('para', txt))

    def table(self, el):
        if 'gates' in cls(el):
            heads = [inline(th, True) for th in el.xpath('.//thead//th')][1:]
            body = el.xpath('.//tbody/tr')
            for ci, head in enumerate(heads):
                rows = []
                for tr in body:
                    th = tr.xpath('./th'); tds = tr.xpath('./td')
                    if ci >= len(tds):
                        continue
                    td = tds[ci]
                    u = td.find_class('u'); tie = td.find_class('tie')
                    cell = ('**' + inline(u[0], True) + '**' if u else '') + ((' — ' + inline(tie[0], True)) if tie else '')
                    if not u and not tie:
                        cell = inline(td, True)
                    rows.append([inline(th[0], True) if th else '', cell])
                self.add(Block('table', header=['Gate', head], rows=rows, newslide=f'Six gates · {head}'))
            return
        heads = [inline(th, True) for th in el.xpath('.//thead//th')]
        rows = []
        for tr in el.xpath('.//tbody/tr') or el.xpath('.//tr'):
            cells = [inline(td, True) for td in tr if isinstance(td.tag, str) and td.tag in ('td', 'th')]
            if cells:
                rows.append(cells)
        if rows:
            self.add(Block('table', header=heads or [''] * len(rows[0]), rows=rows))

    # ---- notes
    def notes(self) -> list[str]:
        out = []
        for nd in self.el.find_class('notes'):
            for p in nd:
                t = inline(p)
                if t:
                    out.append(t.replace('\\\n', ' '))
        return out

# ----------------------------------------------------------------------------- chunking into pptx slides
def chunk(blocks: list[Block]) -> list[dict]:
    """Group blocks into pptx slides: {'image': Block|None, 'blocks': [...], 'title': str|None, 'lead': [...]}.
    Rules: a picture is alone on its slide (its caption opens the next text slide); a table is alone on its
    slide (lead-in lines go to that slide's notes); text slides hold at most WORDS_PLAIN words; a heading never
    ends a slide — it moves on with the content it introduces."""
    slides, cur, pending_caption = [], None, None

    def new(image=None, title=None):
        nonlocal cur
        cur = {'image': image, 'blocks': [], 'title': title, 'lead': []}
        slides.append(cur)

    def used():
        return sum(x.lines() for x in cur['blocks'])

    def light():  # only short lead-in lines so far (kicker, subtitle): they can move to notes or share a slide
        return not cur['image'] and used() <= 3 and all(x.kind in ('para', 'heading') for x in cur['blocks'])

    def start_text_slide(title=None):
        nonlocal pending_caption
        new(title=title)
        if pending_caption:
            cur['blocks'].append(Block('para', f'*{esc(pending_caption)}*')); pending_caption = None

    new()
    for b in blocks:
        if b.kind == 'image':
            if light():
                cur['image'] = b; cur['lead'] = cur['blocks']; cur['blocks'] = []
            else:
                new(image=b)
            pending_caption = b.caption
            continue
        if b.kind == 'table':
            for part in split_block(b, WORDS_TABLE):
                if light() and not cur['image']:
                    cur['lead'] = cur['blocks']; cur['blocks'] = []
                    if part.newslide and not cur['title']:
                        cur['title'] = part.newslide
                else:
                    new(title=part.newslide)
                cur['blocks'].append(part)
                new()  # nothing else joins a table slide
            continue
        if cur['image']:
            start_text_slide()
        for part in split_block(b, LINES_PLAIN - 2):
            if part.newslide:
                if light() and not cur['title']:
                    cur['title'] = part.newslide
                else:
                    start_text_slide(part.newslide)
            if cur['blocks'] and used() + part.lines() > LINES_PLAIN and not part.newslide:
                if light():
                    carry = cur['blocks']; cur['blocks'] = []   # nothing stays behind alone
                else:
                    carry = []
                    while cur['blocks'] and cur['blocks'][-1].kind == 'heading':
                        carry.insert(0, cur['blocks'].pop())
                start_text_slide()
                cur['blocks'].extend(carry)
            cur['blocks'].append(part)
    if pending_caption:
        start_text_slide()
    return [s for s in slides if s['blocks'] or s['image']]

def render_slide(title, chunk_, notes, k, n) -> str:
    t = chunk_['title'] or title
    if n > 1 and not chunk_['title']:
        t = f'{title} ({k}/{n})'
    lines = [f'## {t}', '']
    img = chunk_['image']
    if img:
        lines += [f'![]({img.image})', '']
    else:
        lines += ['\n\n'.join(b.render() for b in chunk_['blocks']), '']
    lead = [b.md for b in chunk_.get('lead', []) if b.md.strip()]
    if notes or lead:
        entries = ([' · '.join(lead)] if lead else []) + list(notes)
        lines += ['::: notes', '\n\n'.join(entries), ':::']
    lines.append('')
    return '\n'.join(lines)

# ----------------------------------------------------------------------------- main
def build_markdown(deck_path, figures_dir):
    manifest = json.load(open(os.path.join(figures_dir, 'manifest.json'), encoding='utf-8'))
    doc = LH.fromstring(open(deck_path, encoding='utf-8').read())
    sections = [s for s in doc.iter('section') if 'slide' in cls(s)]
    head_title = doc.findtext('.//title') or 'Deck'
    out = []
    first = SlideConverter(sections[0], 1, manifest).convert()
    out += ['---', f'title: "{esc(first.title or head_title)}"']
    if first.subtitle:
        out.append(f'subtitle: "{first.subtitle}"')
    out += [f'author: "{esc(first.kicker)}"' if first.kicker else '', 'date: "2026-10-01"', 'lang: en', '---', '',
            '<!-- Generated by projects/crm-three-scenarios/pptx/build_pptx.py from Finished Presentations/crm-three-scenarios.html. ',
            'Edit here only for wording; facts live in the HTML deck and the evidence ledger. Produce the deck with: ',
            'pandoc crm-three-scenarios.md -o "../../Finished Presentations/crm-three-scenarios.pptx" (run from this folder). -->', '']
    total = 0
    for i, sec in enumerate(sections, 1):
        conv = SlideConverter(sec, i, manifest).convert()
        blocks = conv.blocks
        if i == 1:  # the YAML block is the title slide; keep the chips and the rule line as the first content slide
            blocks = [b for b in blocks if not (b.kind == 'para' and b.md.startswith('*') and (conv.kicker and conv.kicker in b.md or conv.subtitle and conv.subtitle in b.md))]
        chunks = chunk(blocks)
        notes = conv.notes()
        for k, ch in enumerate(chunks, 1):
            nts = notes if k == 1 else [f'Provenance notes: see the first slide of "{conv.title}".'] if notes else []
            out.append(render_slide(conv.title, ch, nts, k, len(chunks)))
            total += 1
    return '\n'.join(out), total, len(sections)

def main():
    global LINES_PLAIN
    ap = argparse.ArgumentParser()
    ap.add_argument('--deck', default=DEFAULT_DECK)
    ap.add_argument('--figures', default=os.path.join(HERE, 'figures'))
    ap.add_argument('--out', default=os.path.join(HERE, 'crm-three-scenarios.md'))
    ap.add_argument('--pptx', nargs='?', const=DEFAULT_PPTX, default=None, help='also run pandoc and write this pptx')
    ap.add_argument('--budget', type=int, default=None, help='text lines per pptx slide at 16pt (default %d)' % LINES_PLAIN)
    ap.add_argument('--reference', default=os.path.join(HERE, 'reference.pptx') if os.path.exists(os.path.join(HERE, 'reference.pptx')) else None,
                    help='pandoc --reference-doc (fonts, sizes); defaults to reference.pptx next to this script when present')
    a = ap.parse_args()
    if a.budget:
        LINES_PLAIN = a.budget
    md, n_out, n_in = build_markdown(a.deck, a.figures)
    open(a.out, 'w', encoding='utf-8').write(md)
    print(f'wrote {a.out}: {n_in} HTML slides -> {n_out} pptx slides')
    if a.pptx:
        cmd = ['pandoc', os.path.basename(a.out), '-o', os.path.abspath(a.pptx)] + (['--reference-doc', os.path.abspath(a.reference)] if a.reference else [])
        print('running:', ' '.join(cmd), '(cwd', os.path.dirname(os.path.abspath(a.out)) + ')')
        subprocess.run(cmd, cwd=os.path.dirname(os.path.abspath(a.out)), check=True)
        print('wrote', a.pptx)

if __name__ == '__main__':
    main()
