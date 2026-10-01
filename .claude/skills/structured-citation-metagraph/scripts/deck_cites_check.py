#!/usr/bin/env python3
"""deck_cites_check.py — fidelity guard between a rendered deck and its metagraph (stdlib only).

citation_graph.py guarantees that every node a *planned view* cites is grounded. This script closes the other gap:
what the *built deck* actually shows. It reads every `data-claim="Cxxx"` (HTML) or `^Cxxx^` / `[Cxxx]` (Markdown)
reference and checks, against metagraph.json, that each id
  1. exists as an evidence_fact node,
  2. is not refuted (attrs.status != 'refuted'; refuted ids are retired, so a dangling id is reported as unknown),
  3. is cited by at least one planned view (a claim shown on a slide that no view planned is a deviation — allowed,
     but listed so the ledger's used_by can be updated),
and reports every caveated claim so the presenter can confirm the caveat wording is on the slide or in its notes.

Usage:
  python3 deck_cites_check.py --graph metagraph.json --deck deck.html [--strict]
Exit 1 on unknown or refuted ids; with --strict also on unplanned ids.
"""
import argparse, json, re, sys
from collections import defaultdict

ap = argparse.ArgumentParser()
ap.add_argument('--graph', required=True)
ap.add_argument('--deck', required=True, help='HTML (data-claim attributes) or Markdown (^Cxxx^ / [Cxxx])')
ap.add_argument('--strict', action='store_true')
a = ap.parse_args()

g = json.load(open(a.graph, encoding='utf-8'))
nodes = {n['id']: n for n in g['nodes']}
planned = defaultdict(set)
for v in g.get('views', []):
    for c in v.get('cites', []):
        planned[c].add(v['id'])
text = open(a.deck, encoding='utf-8').read()
ids = re.findall(r'data-claim="([A-Za-z]+\d+)"', text) or re.findall(r'(?:\^|\[)([A-Z]\d{3,})(?:\^|\])', text)
used = sorted(set(ids))
unknown = [c for c in used if c not in nodes]
not_fact = [c for c in used if c in nodes and nodes[c].get('type') != 'evidence_fact']
refuted = [c for c in used if c in nodes and nodes[c].get('attrs', {}).get('status') == 'refuted']
unplanned = [c for c in used if c in nodes and c not in planned]
caveated = [c for c in used if c in nodes and nodes[c].get('attrs', {}).get('status') == 'caveat']
print(f'deck cites {len(used)} distinct claim ids; graph has {sum(1 for n in nodes.values() if n.get("type")=="evidence_fact")} evidence facts')
for label, lst in (('UNKNOWN (retired or mistyped)', unknown), ('NOT AN EVIDENCE FACT', not_fact), ('REFUTED', refuted), ('shown but not in any planned view', unplanned)):
    if lst:
        print(f'  {label}: {", ".join(lst)}')
print(f'  caveated claims on the deck ({len(caveated)}): confirm the caveat wording is on the slide or in its notes')
for c in caveated:
    cv = nodes[c].get('attrs', {}).get('caveat', '')
    print(f'    {c}: {cv[:140]}')
bad = unknown or not_fact or refuted or (a.strict and unplanned)
sys.exit(1 if bad else 0)
