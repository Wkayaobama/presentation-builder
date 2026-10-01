# HTML deck → Markdown → PPTX

The HTML deck in `Finished Presentations/crm-three-scenarios.html` is the source of truth (every number carries a
`data-claim` id that resolves in `../evidence-ledger.md`). This folder turns it into a PowerPoint file in two steps,
with an editable Markdown intermediate between them.

```bash
cd projects/crm-three-scenarios/pptx

# 0. rasterise the inline SVG metaphors (iceberg, pitch, cardinality, gauges, landlord, Team B, map) to PNG
node render_figures.js "../../Finished Presentations/crm-three-scenarios.html" figures
#    needs Playwright + Chromium; set PLAYWRIGHT_MODULE=/path/to/node_modules/playwright if it is not resolvable

# 1. intermediate step: HTML -> pandoc slide-show Markdown
python3 build_pptx.py                      # writes crm-three-scenarios.md (one pandoc slide per "## " heading)

# 2. producer
pandoc crm-three-scenarios.md -o "../../Finished Presentations/crm-three-scenarios.pptx" --reference-doc reference.pptx
#    or in one go:  python3 build_pptx.py --pptx
```

`pandoc crm-three-scenarios.md -o out.pptx` without `--reference-doc` also works, but pandoc's stock template sets
body text at 24 pt, so expect overflow on the denser slides; `reference.pptx` is pandoc's own template with body text
at 16 pt and titles at 26 pt (nothing else changed).

## What the converter does

- One HTML slide becomes one or more pptx slides, titled `… (k/n)`; text is chunked by an estimated line budget
  (`--budget`, default 11 lines at 16 pt) so nothing overflows PowerPoint's content placeholder.
- Every picture and every table gets a slide of its own (pandoc's two-column and caption layouts overlap otherwise);
  the picture's `<title>` opens the following text slide in italics.
- The gates matrix is emitted per scenario (S1, S2, S3), two gate rows per slide.
- Stat tiles and bar charts become bullet lists; chips become one line; claim references stay as superscripts (`^C148^`).
- The HTML deck's provenance notes (press N there) become the speaker notes of the first pptx slide of each HTML slide.

Edit `crm-three-scenarios.md` for wording and re-run step 2. Change facts in the HTML deck and the ledger and re-run
the whole chain, otherwise the two renderings drift apart.

QA used for the committed file: `validate.py` from the pptx skill (schema and package checks), LibreOffice
`--convert-to pdf` + `pdftoppm` contact sheets at 1920×1080, `markitdown` for the text dump.
