# Security Policy

## Trust Model

`shani-wiki` is the technical documentation wiki for Shanios
(`wiki.shani.dev`). It is a static single-page application with sidebar
navigation, serving public documentation only.

- **No authentication, no user data.** The site serves public documentation only.
- **Staleness risk.** This repo was identified as stale during the last
  full-ecosystem audit — its last commit predates every sibling repo's by
  months. Content should be verified against current `shani-install-media`
  and `shani-settings` before citing.

## Key Security Mechanisms

| Mechanism | Implementation |
|-----------|----------------|
| Static content | No server-side processing; no user input handling |
| Navigation | Sidebar nav loaded from `nav-docs.js` |

## Known Limitations

- **Missing SEO/crawler artifacts.** The repo is missing `404.html`,
  `sitemap.xml`, `robots.txt`, and `llms.txt` that its siblings
  (`shani-blog`, `shani-docs`) already have.
- **No CI/CD.** The repo has no automated lint/test/build gating.
- **Stale content.** Documentation may not reflect current OS build
  configuration. Verify against `shani-install-media` before citing.

## Reporting a Vulnerability

If you discover a security vulnerability in any Shanios project, please report it
responsibly by opening a private security advisory on GitHub.

Please include:
- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

We will acknowledge receipt within 72 hours and provide a detailed response
within 7 days. Thank you for helping keep Shanios secure.
