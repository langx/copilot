# [copilot.langx.io](https://copilot.langx.io)

LangX Copilot is the AI helper inside a LangX chat with a real person: it checks
the sentence you are about to send, says it in the language you are learning,
explains a message you did not understand, and offers reply ideas. It never
sends anything for you, and the person you are talking to sees none of it.

**Copilot itself lives in the app, in [langx/langx](https://github.com/langx/langx).**
This repository is the website that explains it, plus the code of Copilot's
first version, a Discord bot that is inactive (see [below](#the-discord-bot-inactive)).

## The website

`site/` is copilot.langx.io: HTML, CSS and JavaScript with no build step, so
what is in the folder is what ships — the same arrangement as its sister site,
[token.langx.io](https://github.com/langx/token-website).

> **Deploys.** Cloudflare Pages project `copilot`, connected to this repository
> (Git integration, like `token-website`). A push to `main` that touches
> `site/` is a production deploy; any other branch that touches `site/` gets a
> preview URL. The project's root directory is `site`, there is no build
> command, and changes outside `site/` — the bot — deploy nothing. The domain
> is a proxied CNAME `copilot` → `copilot-bok.pages.dev` in the `langx.io` zone.

> **Keeping it honest.** Everything the page says about Copilot comes from the
> app: the helps and their names from `packages/shared/src/copilot.ts` and the
> English strings in `apps/mobile/src/i18n/messages/en.ts`, the allowances from
> `PLAN_LIMITS` in `packages/shared/src/limits.ts`, and the privacy wording from
> the consent sheet and the app's privacy policy. When Copilot changes there,
> this page has to change with it. It is sold as a beta, so it says beta.

> **Search.** `robots.txt`, `sitemap.xml` and `404.html` exist so Cloudflare
> Pages does not treat the site as a single-page app and answer every unknown
> path with the homepage and a 200. `_headers` keeps the 404 page, `tools/` and
> every `*.pages.dev` preview out of search results.

> **Social preview.** `site/images/site-preview.png` (1200×630) is rendered
> from [`site/tools/og-source.html`](site/tools/og-source.html). After a copy
> change:
>
> ```bash
> "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --disable-gpu --hide-scrollbars --force-device-scale-factor=2 --virtual-time-budget=8000 --window-size=1200,630 --screenshot=og@2x.png site/tools/og-source.html && magick og@2x.png -resize 1200x630 -strip site/images/site-preview.png
> ```

To look at it locally, serve the folder from its root so the absolute paths in
`404.html` resolve:

```bash
python3 -m http.server 8000 --directory site
```

## The Discord bot (inactive)

Before Copilot was built into the app it was two smaller things, and their code
is still here:

- `discord/` — a Discord bot with one command, `/fix`, that corrected a message
  and explained why, in public, in the LangX server. **It is inactive for now.**
  It was written against OpenAI's Assistants API, which OpenAI shut down on
  26 August 2026, so it cannot answer as written. Setup notes are in
  [`discord/README.md`](discord/README.md).
- `index.js`, `copilot/` and `appwrite.json` — the Appwrite function behind the
  Copilot switch in LangX v1, which is retired.

## Contributing

Issues and pull requests are welcome — for the website here, and for Copilot
itself in [langx/langx](https://github.com/langx/langx).

## License

This project is licensed under the BSD 3-Clause License. See the
[LICENSE](LICENSE) file for more details.
