# Schemas used by structured-citation-metagraph

All agent outputs are validated against these shapes at the tool layer (StructuredOutput). `required` lists are the
minimum; add fields freely, never remove the evidence triple.

## Evidence triple

```json
{"source": "repo path, 'live-<connector>-<date>', 'deck slide N', 'sheet/row', or URL",
 "locator": "line range, slide number, row text, the exact SQL, or URL anchor + as-of date",
 "quote": "short verbatim excerpt or the returned value"}
```

## Explorer output (phase 1)

```json
{
  "items": [{"name": "", "kind": "", "lives_in": "", "built_on": "", "status": "", "owner_dependency": "",
             "scenario_relevance": "", "gate_rows": [""], "evidence": [EVIDENCE]}],
  "facts": [{"id": "", "statement": "", "value": "", "story_link": "which story / scenario / gate row it grounds",
             "kind": "number | quote | status | mapping | price",
             "confidence": "official list | vendor list | partner range | secondary | order of magnitude | illustrative | tracker words | not priced | measured",
             "evidence": [EVIDENCE]}],
  "gaps": [""],
  "output_file": "projects/<name>/explore/explore-<family>.json"
}
```
Required: items (name, kind, lives_in, built_on, status, evidence), facts (id, statement, story_link, kind, evidence), gaps, output_file.

## Health check output (phase 2)

```json
{"ranked": [{"rank": 1, "item": "", "verdict": "keep | simplify | consolidate | pay_for", "rationale": "",
             "lives_in": "", "built_on": "", "cost_s1": "", "cost_s2": "", "cost_s3": "", "gate_row": "", "evidence_ids": [""]}],
 "cost_lines": [{"scenario": "", "line": "", "amount_or_range": "", "basis": "", "source": "", "confidence": ""}],
 "files": [""]}
```

## metagraph.json (phase 3)

```json
{
  "meta": {"title": "", "date": "", "layer": "presentation",
           "node_types": ["story", "image", "data_problem", "practical_example", "scenario", "gate_cell", "project", "cost_line", "evidence_fact"],
           "edge_types": ["illustrates", "connects_to", "grounded_in", "enforced_by", "costs", "depends_on", "lives_in", "built_on", "health_verdict"],
           "max_depth": 4,
           "verification": {"date": "", "counts": {}, "refuted": [], "post_pass_additions": []},
           "paths": "how to read locators"},
  "nodes": [{"id": "C001", "type": "evidence_fact", "label": "", "depth": 4, "parent": "dp_x",
             "attrs": {"kind": "", "claim": "", "used_by": ["V01"], "evidence": [EVIDENCE],
                       "status": "confirmed | caveat | refuted | unverified", "caveat": "", "verified": "date"}}],
  "edges": [{"from": "", "to": "", "type": "", "weight": 1.0}],
  "views": [{"id": "V01", "title": "", "cites": ["node ids"], "budget": {"medium": "html", "words": 300}}]
}
```
Rules the scripts rely on: `parent` chains define folder proximity; `grounded_in` edges and `type == "evidence_fact"`
define grounding; a view may only cite grounded nodes; refuted facts keep their node with `status: refuted` and are
removed from every `cites`; ids are never reused.

## Metagraph agent return

```json
{"files": [""], "claims": [{"id": "", "claim": "", "kind": "", "used_by": [""], "evidence": [EVIDENCE]}],
 "stats": {"nodes": 0, "edges": 0, "slides_planned": 0}, "unsupported_story_elements": [""]}
```

## Verifier output (phase 4)

```json
{"verdicts": [{"claim_id": "", "verdict": "confirmed | refuted | caveat", "reason": "", "fix": "wording the deck must carry"}],
 "side_findings": [{"statement": "", "evidence": [EVIDENCE]}]}
```

## Presentation agent return (phase 5)

```json
{"deck_path": "", "script_path": "", "slide_count": 0,
 "slides": [{"index": 1, "title": "", "cites": ["C001"]}]}
```

## QA output (phase 6)

```json
{"pass": true, "issues": [{"severity": "blocker | major | minor", "slide": "", "description": "", "fix_hint": ""}]}
```

## Evidence ledger (markdown)

```
| id | kind | claim | used by | source | locator | quote |
```
Header sections: `## Verification` (date, counts, refuted ids with the verifier's corrected reading), `## Unsupported
story elements (illustrative, not measured)`, and a paths note. Caveats are appended to the claim cell as
`[caveat] … → <wording the deck carries>`.
