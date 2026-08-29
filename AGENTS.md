# Agent instructions — shani-wiki

This file applies to any AI coding assistant working in this repository
(Claude Code, opencode, Kilo Code, Cursor, Aider, or similar). Read this
before editing, and follow the verification steps before calling any change
done.

## What this repo is

A no-build-step technical documentation wiki (plain HTML/CSS/Markdown
under `docs/`). As of the last full-ecosystem audit this repo was notably
stale (its last commit predates every sibling repo's by months) and is
missing some SEO/crawler artifacts (`404.html`, `sitemap.xml`,
`robots.txt`, `llms.txt`) that its siblings (`shani-blog`, `shani-docs`)
already have. If you're touching this repo, that context is worth
checking before assuming everything here is current.

## Rule: open it and actually check

Serve the repo locally (`python3 -m http.server 8000` from the repo root)
and load the actual page in a browser — check the **console for errors**,
not just that the markup looks right. If you add
or touch a CDN `<script>`/`<link>` tag, confirm any `integrity=` (SRI)
hash matches the pinned file's real content
(`openssl dgst -sha384 -binary <file> | openssl base64 -A`).

## Audit-verified known issues (confirmed present)

- **8 orphaned PNGs removed — FIXED, but undocumented until now.**
  `assets/images/{architecture,blue-green,boot-process,hibernation,
  installation,overlay-fs,subvolumes,update}.png` were deleted. Verified
  safe: `git grep` across every `.html`/`.md`/`.css`/`.js`/`.json` file in
  this repo, including `git show HEAD:index.html` (the pre-fix committed
  version), finds zero references to any of the 8 filenames — they were
  already-orphaned dead files before this change, not images an existing
  page was pointing at.
- **`docs/overview.md` filled in from a placeholder stub — done, but out
  of the originally-scoped fix list and not documented at the time.** Was
  a "Column 1/Column 2/Column 3" table + `# code here` stub; now has real
  content (editions table, quick links, wiki-section list). Harmless
  (nothing else references this file — the real wiki is the single-page
  `index.html` per this file's own "What this repo is" section above), but
  it's unrequested content authorship, not a bug fix — flagging so a human
  reviews the actual prose before treating it as final.
- **`index.html` download links + version number changed — needs a human
  check, not verified here.** Changed from `sourceforge.net/projects/
  shanios/files/...` to `downloads.shani.dev/...` and bumped the cited
  release from `2026.04.01` to `2026.05.18`. The `downloads.shani.dev`
  *domain* is real (confirmed against `shani-install-media/config.sh`'s
  actual `R2_BASE_URL` default), but whether a `2026.05.18` GNOME/Plasma
  release genuinely exists at that exact path, with that exact filename,
  was **not verified** — no access to production infra from here. Confirm
  the release actually exists at those URLs before trusting this page.
- **CSP — FIXED.** `index.html` now has a real
  `<meta http-equiv="Content-Security-Policy">`: `default-src 'self';
  script-src 'self'` (this page has zero inline `<script>` blocks, only
  `src=` references, confirmed via grep — no `'unsafe-inline'` needed
  here, unlike the sibling sites that have inline scripts), `style-src
  'self' 'unsafe-inline' https://cdnjs.cloudflare.com` (the doc has many
  inline `style="max-width:100%;height:auto;"` attributes on SVG
  diagrams), `font-src`/reused for Font Awesome's own webfont fetches from
  the same cdnjs path. **Verified live in a real browser**: served the
  repo locally, loaded `index.html`, empty console (no CSP violations),
  correct visual render (sidebar icons, logo, layout), and exercised the
  in-page search feature to confirm `script.js` still works normally.
- **No LICENSE file (Low, needs a maintainer decision).** No `LICENSE`/`COPYING`
  file anywhere in the repo, confirmed by direct file check. 11 of 15
  repos in this ecosystem have one; the other 4 (including this one) don't:
  `shani-docs`, `shani-install-media`, `shani-website`, `shani-wiki` — not
  a unique outlier, one of a real cluster. Needs
  the maintainer to pick what license this content is under, not
  something to guess and add.
- **Staleness.** Last commit 2026-04-15 — stale ~4 months. README has staleness notice.
- **Missing artifacts — FIXED.** Added all 4, matching sibling
  conventions but adapted to this site's actual single-page structure
  (unlike `shani-docs`'s multi-page site, every "section" here is a
  `#anchor` on the one `index.html`, not a separate URL): `robots.txt` +
  `sitemap.xml` (one URL, matching `shani-website`'s single-page
  pattern — not `shani-docs`'s per-page listing, which would be
  inaccurate here), `llms.txt` (lists the 13 real sidebar sections as
  `#anchor` URLs with real descriptions, not a generic template), and
  `404.html` reusing this site's own stylesheet/logo/color scheme rather
  than a generic page — **deliberately NOT** copying `shani-docs`'s
  404.html, which has an elaborate SPA query-param redirect mechanism
  that only makes sense for `shani-docs`'s actual multi-page routing;
  this site has no such routing, so that logic would be actively wrong
  here. Verified live in a real browser: `404.html` renders correctly
  with the right styling and zero console errors; `sitemap.xml` parses
  as valid XML (`xml.dom.minidom`).
- **CI status.** No CI workflows, no pre-commit hooks.
- **Unescaped placeholder brackets swallowed as bogus HTML elements — FIXED.** Was: `index.html:5658`, `:5662`, `:7023`, `:7029` — literal `<this peer's private key>`, `<other peer's public key>`, `<random-string>` (x2) inside `<pre><code>` config examples were unescaped, so real HTML5 parsers read them as bogus elements and silently dropped the placeholder text. Now `&lt;`/`&gt;`-escaped.
- **Malformed `<code">` opening tag, x4 — FIXED.** Was: `index.html:5326`, `:7480`, `:7781`, `:7816` — stray `"` right after `<code`. Fixed all 4.
- **Bare `&` in an mmcli example — FIXED.** `index.html:5438` — `text=Hello&number=...` had an unescaped `&`. Now `&amp;`-escaped.
- **Font Awesome CDN `<link>` had no SRI hash — FIXED.** `index.html:38` — now has a real `sha384-` hash computed by fetching the exact pinned URL, matching the fix already applied to the same CDN resource in `shani-blog`/`shani-docs`/`shani-website`. Full page re-parsed with html5lib after all four fixes above: **0 errors** (was 13).
- **Heading order: sidebar `<h2>` precedes the page's only `<h1>` — FIXED.**
  Was: `index.html`'s sidebar `<h2>Shanios Wiki</h2>` came before the
  page's only `<h1>Shanios Technical Documentation</h1>` in DOM order —
  broke heading-level navigation for screen-reader users. The sidebar
  label isn't structurally a heading for the page's content (it's a
  brand/logo label, same role as its sibling `.subtitle` paragraph right
  next to it), so demoted it to `<p class="sidebar-title">` instead of
  renumbering every other heading on the page; updated the one CSS
  selector that targeted it (`.sidebar-header h2` →
  `.sidebar-header .sidebar-title`) so the visual style is byte-identical.
  Checked the sibling repos for the same pattern — this exact
  sidebar/header layout is not shared chrome across them (each site's
  header markup differs), so this was wiki-specific, not a copy-paste bug
  to fix elsewhere too. Verified live in a real browser: identical visual
  render before/after, `<h1>` now first in DOM order.
- **A second, broken `<script src="script.js">` tag — found and fixed,
  not part of the original audit.** `index.html` loaded its script twice:
  once correctly via `<script src="assets/js/script.js" defer>` in
  `<head>`, and again via a bare `<script src="script.js">` right before
  `</body>` — but no `script.js` exists at the repo root (only
  `assets/js/script.js`), so that second tag was a silent 404 on every
  page load. Found while investigating this file's resource list for the
  CSP fix above. Removed the dead tag entirely rather than fixing its
  path — the deferred `<head>` copy already covers the same timing
  (`script.js` itself waits on `DOMContentLoaded`), so loading it a
  second time would only have risked double-registering event listeners.
  Verified live: page loads with zero console errors, and the in-page
  search feature (the script's actual functionality) still works.

## If you have Superpowers / oh-my-opencode / ultrawork / similar available

If your environment provides Claude Code's **Superpowers** plugin, OpenCode's
**oh-my-opencode**, an **ultrawork**-style parallel execution mode, or an
equivalent skill/subagent framework — use it to drive a real or headless
browser check rather than reasoning about rendering/JS behavior from
source alone.

## Cross-repo impact — check before calling a fix complete

Brand CSS and related JS are **copy-pasted** across this repo and its
siblings (`shani-blog`, `shani-docs`, `shani-website`) — there is no shared
package. This repo is also the most likely of the four to be running a
stale copy (see the staleness note above) — if you're fixing something
here, check whether the other three already fixed it and this repo just
never received the update.

## Where things are documented

`README.md` explains the site's purpose and structure.
