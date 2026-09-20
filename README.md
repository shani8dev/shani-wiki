# shani-wiki

Technical documentation wiki for Shanios — the immutable Linux OS with atomic updates.

> **Staleness notice (updated 2026-09-17):** This repo's **content** commits still date from 2026-04-15 (~5 months stale) — verify prose against current `shani-install-media` and `shani-settings` before citing. SEO/crawler artifacts (`404.html`, `sitemap.xml`, `robots.txt`, `llms.txt`) were added in `b036f05` (2026-08-29) and are live; the staleness is in the wiki's *prose*, not its infrastructure.

## Purpose

This wiki provides comprehensive technical documentation for Shanios's architecture, installation, configuration, and daily use. It is structured as a single-page application with sidebar navigation, designed for quick reference and deep technical exploration.

## Live Site

**[wiki.shani.dev](https://wiki.shani.dev)**

## Relationship to Other Projects

| Project | Domain | Purpose |
|---------|--------|---------|
| [shani-website](https://github.com/shani8dev/shani-website) | [shani.dev](https://shani.dev) | Marketing landing page and download portal |
| **shani-wiki** | [wiki.shani.dev](https://wiki.shani.dev) | Technical documentation wiki (this project) |
| [shani-docs](https://github.com/shani8dev/shani-docs) | [docs.shani.dev](https://docs.shani.dev) | Authored Markdown documentation with generated HTML |
| [shani-blog](https://github.com/shani8dev/shani-blog) | [blog.shani.dev](https://blog.shani.dev) | Engineering posts and release notes |

## Content Structure

- **`index.html`** — Complete wiki as a single-page application with sidebar navigation
- **`docs/overview.md`** — Markdown overview document
- **`assets/`** — CSS, JavaScript, and image assets

## Wiki Sections

1. **Overview** — Introduction and quick links
2. **Introduction** — What is Shanios, what's included, user configuration, system optimizations
3. **Installation** — System requirements, pre-installation setup, installation steps, first boot
4. **Concepts** — Immutability, blue-green deployment, atomic updates, persistence strategy
5. **Architecture** — Btrfs deep dive, filesystem structure, overlay filesystem, boot process
6. **Security** — Security features, LUKS2 encryption, TPM2 auto-unlock, Secure Boot
7. **Updates & Config** — System updates, rollback, user configuration
8. **Software & Apps** — Flatpak, Nix, Homebrew, development tools
9. **Networking** — Network configuration, firewall, VPN
10. **Troubleshooting** — Common issues and solutions
11. **FAQ** — Frequently asked questions
12. **Glossary** — Technical terms and definitions
13. **Contribute** — How to contribute to the wiki

## Development

This is a static HTML/CSS/JS site hosted on GitHub Pages.

### Local preview

```bash
python3 -m http.server 8080
# open http://localhost:8080
```

Opening `index.html` directly via `file://` works for layout but blocks some fetches; prefer the local server.

### Making changes

1. Fork the repository
2. Edit `index.html` for wiki content changes (content lives inline in the SPA)
3. Verify headings render correctly in the sidebar TOC
4. Submit a pull request

### Scope & style

- In scope: technical documentation of Shanios as shipped — architecture, configuration, procedures grounded in the actual repos
- Out of scope: third-party tool tutorials that don't intersect with Shanios specifics
- Match the tone of existing sections: declarative, command-first, no marketing language
- Cross-link related wiki pages and, where a deeper guide exists, the corresponding post on [blog.shani.dev](https://blog.shani.dev)

## Deployment

Push to the `main` branch to deploy to GitHub Pages. The site is served from the repository root.