# Boundary brief — template

Write this file at `projects/<name>/brief.md` before any agent runs. It is the only context boundary: a claim is
admissible if and only if it traces to a source listed in section 2, a live read-only query, or a public page with a
URL. Keep the user's words verbatim; mark your own readings as yours.

```markdown
# BRIEF — <deck title> (ground-truth pack)

Date · author of the request · the system under discussion (ids, portal, repositories) · what the deliverable is.

This file is the ONLY context boundary. Every claim in the deliverable must trace to a line in this brief (cited as
the user's words), a file listed below, a live read-only query, or a public web page with a URL. If a story element
cannot be grounded, label it "illustrative, not measured" rather than inventing a number.

## 1. The request (verbatim essentials)
- Role and goal as the user stated them.
- The options / scenarios (user's wording; placeholders like "Price $ $" stay placeholders).
- Any tables the user supplied (gates, criteria), verbatim.
- The stories, images and metaphors, verbatim, each with its intended message and the option it connects to.

## 2. Ground truth already extracted (with provenance)
### 2a. <source family> — tag `<tag>` — file(s) copied to projects/<name>/sources/
Key facts the orchestrator read, each with file + locator. Mark any interpretation as "(orchestrator reading)".
### 2b. …

## 3. Output conventions
- Where deliverables go; repository-relative locators; provenance tags; design rules file; forbidden content
  (session ids, model names, scratch paths); the medium and its budget per view.
```

Scouting checklist before writing it: list every repository and its top two levels; extract uploaded decks and sheets
to text (slide by slide, sheet by sheet, with notes); pull embedded images that carry numbers; probe each read-only
connector once and record what it returns (account, seat types, totals); grep the repositories for every project
name the request mentions and record which names return nothing.
