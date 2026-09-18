# Agent instructions — shani-wiki

This file applies to any AI coding assistant working in this repository
(Claude Code, opencode, Kilo Code, Cursor, Aider, or similar). Read this
before editing, and follow the verification steps before calling any change
done.

## What this repo is

A no-build-step technical documentation wiki (plain HTML/CSS/Markdown
under `docs/`). At the last full-ecosystem audit this repo was notably
stale (its then-last commit predated every sibling repo's by months) and
was missing some SEO/crawler artifacts (`404.html`, `sitemap.xml`,
`robots.txt`, `llms.txt`) that its siblings (`shani-blog`, `shani-docs`)
already have. That artifact gap is closed (commit `b036f05`, 2026-08-29,
now pushed), but the wiki's **content** commits still date from 2026-04-15
— check for staleness before touching it.

## Empirical verification (mandatory)

**Reading code is analysis; running code is verification.** A change is not
verified by reading the diff, running `bash -n`, or confirming it "looks
correct." It is verified by observing the actual behavior of the real
thing in the real environment — built, served, deployed, signed, running.
If you haven't seen it work (or fail) for real, it isn't verified.

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
  file anywhere in the repo, confirmed by direct file check. The ecosystem
  cluster currently lacking one (audit-verified 2026-09-17): `shani-chronoa`,
  `shani-docs`, `shani-wiki`, `shani-website` — `shani-install-media` gained a
  GPL-3.0 LICENSE on 2026-09-16 and `shani-settings` on 2026-09-17, both
  closed. Not a unique outlier, one of a real cluster. Needs
  the maintainer to pick what license this content is under, not
  something to guess and add.
- **Staleness — status updated 2026-09-17.** SEO/crawler artifacts + README hardening landed in `b036f05` (2026-08-29, pushed); **content** itself last changed 2026-04-15 — still ~5 months stale. README has staleness notice.
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

Brand CSS and related JS claims are the **opposite** here: this repo shares **no** `sw.js`, brand CSS, or nav/content-fetch JS with the other web repos (audit-verified 2026-09-17). This is a markdown-only site with a single `index.html`; the "shared files across four web repos" concern does not apply — updates to those files in `shani-docs`/`shani-blog` do NOT need to be mirrored here. The only cross-repo sync surface is content and hardening (e.g., SEO/CSP patterns), which the staleness note above already covers.

## Where things are documented

`README.md` explains the site's purpose and structure.

## Garuda Cross-Reference Findings (added 2026-09-17)

Based on a full scan of the garuda clones mapped against shani — **29 repos** (not 34; several user-listed names don't exist — see `../garuda-catalog.md` §Discrepancies). See `../garuda-mapping-analysis.md`, `../deep-analysis.md`, `../shani-catalog.md`, and `../garuda-catalog.md` for full details. garuda-ng is the most directly comparable reference for the shared-web-code problem this repo faces.

### 🟡 HIGH: CI/CD gap (shared across ALL repos)

1. **Shared CI templates** (estimated 2-3 days, affects ALL repos).
   - Garuda's `gitlab-ci-commons` provides reusable templates (commitizen, flake-check, pre-commit, tag-to-release). Each repo `include:`s from it.
   - Shani repos run on GitHub Actions (no `.gitlab-ci.yml` anywhere) — 8 repos (blog, builder, docs, fleet, insights, install-media, pkgbuilds, platform) carry hand-written `.github/workflows/*.yml` with duplicated patterns.
   - **Action**: Create `shani-ci-commons` (GitHub Actions reusable workflows / composite actions) with templates for lint, test, build, security scan. Each repo references them via `uses: shani8dev/shani-ci-commons/...` instead of copy-pasting.
   - **Affects**: All 15 shani repos.

### 🟡 HIGH: Dependency management gap

2. **Add automated dependency updates** (estimated 4 hours, affects ALL repos).
   - Garuda uses `renovate-runner` running hourly against all repos with `renovate.json` files.
   - Shani repos have no automated dependency updating.
   - **Action**: Set up Renovate (self-hosted or gitlab.com) with a fleet-wide config. Each repo adds a minimal `renovate.json`.

### 🟢 MEDIUM: Code quality

3. **Conventional commit enforcement** (estimated 2 hours, affects ALL repos).
   - Every garuda repo has a `[commitizen]` badge; `cz commit` is enforced.
   - Shani repos have no commit message standardization.

### 🟡 Staleness warning

4. **Stale content risk** — content last changed 2026-04-15 (SEO/crawler artifacts since landed in `b036f05`, 2026-08-29). Brand CSS and related JS are copy-pasted between `shani-blog` and `shani-docs` only — the same two repos the parent `AGENTS.md` lists as sharing. `shani-wiki` (and `shani-website`) share no `sw.js`, `brand-shani.css`, or nav JS with any sibling site. If fixing something here, check whether the other one of those two already fixed it and this repo just never received the update.

### 🟢 MEDIUM: Shared web components

5. **Shared web component library** (estimated 2-3 days, affects shani-docs/blog/website).
   - Garuda's `garuda-ng` is an Angular library shared across all web projects.
   - Shani web repos share CSS/JS by copy-paste (only between docs and blog). `shani-website` and `shani-wiki` do NOT share these files.
   - **Action**: Create a lightweight shared component library. Standardize on a CSS framework.

### 🔍 Re-Scan Findings (2026-09-17)

Re-scanned against `garuda-catalog.md` (29 repos, not 34) and `shani-catalog.md` (16 repos). **Confirmed mapping: `garuda-ng`** (EXISTS in `garuda-clones/` — Angular component library, TypeScript/Angular 22/Nx/pnpm, npm `@garudalinux/core`, themed variants, AnalogJS/Vite docs site, GitHub Actions, `renovate.json`, Git-Cliff, GPL-3.0-or-later). It is the closest garuda web-facing reference. shani-wiki is a **markdown-only single page with in-page `#anchor` navigation** — no slug/content-fetch logic, so the blog/docs slug fix does not propagate here (per the AGENTS.md correction).

**New gaps from the garuda side:**
1. **No CI/CD at all** — `garuda-ng` has GitHub Actions CI + CD (Playwright e2e, Cloudflare Pages deploy); shani-wiki has no CI workflows, no pre-commit hooks, and the **content** is still stale since 2026-04-15 (SEO/crawler artifacts committed `b036f05` 2026-08-29; confirmed in `shani-catalog.md` §14).
2. **No dependency-update automation** — `garuda-ng` has `renovate.json`; shani-wiki has none.
3. **Single ~7000-line `index.html`** — every section is a `#anchor` on one file; `garuda-ng`'s docs site is a real multi-page site with routing. Content here is harder to version, diff, and maintain than per-page files.
4. **No changelog/contribution docs** — `garuda-ng` has Git-Cliff, CONTRIBUTING.md, CODE_OF_CONDUCT.md; shani-wiki has no LICENSE (4-repo cluster), no CONTRIBUTING.
5. **No theme system** — `garuda-ng` ships catppuccin/dr460nized/vo1ded themed variants; shani-wiki has a single `style.css`.

**Shani advantages:**
1. **Single-page anchor structure = zero routing/JS complexity** — no slug/content-fetch logic to break; the blog/docs `index.html`-slug bug class cannot occur here by design.
2. **Strict CSP** (`script-src 'self'`, zero inline scripts) + SRI on Font Awesome — verified live in a real browser (per this repo's known-issues section).
3. **No build step, no framework dependencies** — nothing to keep in sync with a toolchain; `garuda-ng` requires pnpm 12 + Nx 23 + Angular 22.

**Qt GUI gap note:** not applicable — static wiki; garuda's Qt GUI apps are unrelated.

### 📋 Implementation Roadmap (2026-09-17)

Implementation priorities are per `../IMPLEMENTATION-ROADMAP.md` (master roadmap for the whole shani ecosystem).

1. ~~**Push pending working-tree fixes (P0, 5 min).**~~ **DONE — closed 2026-09-17.** `robots.txt`, `sitemap.xml`, `llms.txt`, the CSP meta tag, Font Awesome SRI hash, heading-order fix, and the dead `<script src="script.js">` tag removal are all committed in `b036f05` (2026-08-29) and pushed; the live site serves them.

2. **Refresh stale content (P1, ongoing).** Content commits date from 2026-04-15 — ~5 months stale (the `b036f05` 2026-08-29 commit added SEO/crawler artifacts + README hardening but did not refresh the wiki's own prose). Brand CSS/JS and SEO updates that landed in `shani-docs`/`shani-blog` never reached this repo; audit the single `index.html` against the current sibling state and port what applies (this repo shares no `sw.js`/brand CSS/nav JS, so the port surface is content and hardening, not shared chrome).

3. **Add LICENSE (P3, 5 min).** Master-roadmap item #31, not #26 (web-shared-components is #27; #26 is shani-gui welcome content). Match `shani-blog` — the only web sibling that has a LICENSE, and it is **MIT** (audit-verified 2026-09-17), not GPL-3.0 — unless the maintainer decides web repos should follow the OS-side GPL-3.0 standard instead; one of the 4-repo cluster missing it.

4. **CI workflow (P1).** No CI at all today. Use `shani-ci-commons` templates (item #7): HTML validation of the single `index.html` (html5lib strict parse), SRI-hash verification on the Font Awesome CDN link, and a staleness check that flags when the last commit is older than N months.

5. **Conventional commits (P1).** Ecosystem-wide commit convention (item #9) — no dependencies to Renovate here, so skip `renovate.json`.
