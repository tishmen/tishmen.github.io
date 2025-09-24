# milantopuzov.dev

Personal site powered by Jekyll and hosted on GitHub Pages. Styled with Tailwind CSS (via CDN runtime for local preview; production-ready build optional).

## Local development

Prereqs: Ruby 3.x and Bundler.

1. Install gems:
   ```bash
   bundle install
   ```
2. Serve locally:
   ```bash
   bundle exec jekyll serve
   ```
3. Open http://localhost:4000

Tailwind
- We include Tailwind via CDN in `_layouts/default.html` for quick local preview.
- If you prefer a compiled Tailwind CSS for production, I can add a small build script to generate `assets/site.css` and commit it (GitHub Pages friendly).

Content you can edit now:
- `index.md` (Hello World homepage with links)
- `work.md` (My work)
- `blog/index.md` (blog index)
- `contact.md` (contact info)
- `_posts/` (blog posts)

## Deploy on GitHub Pages

1. Create a GitHub repo (any name). If you prefer, name it `milantopuzov.dev`.
2. Initialize and push:
   ```bash
   git init
   git add -A
   git commit -m "Initial Jekyll site"
   git branch -M main
   git remote add origin git@github.com:tishmen/REPO.git
   git push -u origin main
   ```
3. In GitHub → Settings → Pages:
   - Source: Deploy from a branch
   - Branch: `main` and folder `/ (root)`
   - Custom domain: `milantopuzov.dev` (CNAME file already added)
   - Enable “Enforce HTTPS”

## DNS for milantopuzov.dev

Point the apex domain to GitHub Pages by adding A records:

- 185.199.108.153
- 185.199.109.153
- 185.199.110.153
- 185.199.111.153

Optionally add `www` CNAME → `tishmen.github.io` and set a redirect.

After DNS propagates, GitHub will issue an SSL cert automatically.
