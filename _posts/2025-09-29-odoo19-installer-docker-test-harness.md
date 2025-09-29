---
layout: post
title: "Improving the Odoo 19 installer + adding a Docker test harness"
description: "My PR to Yenthe’s InstallScript brings a Docker-based test env, Ubuntu 24.04‑friendly pip installs, safer shell checks, and optional pgvector for Odoo Enterprise — honored to contribute to a community staple."
tags: [odoo, ubuntu, installer, docker, postgres, pgvector, open-source, community]
---

I’ve long admired the work of Yenthe and the community around the Odoo InstallScript — it’s one of those small-but-mighty tools that saves thousands of people real time. This script was my very first contact with Odoo; I used it at the beginning to spin up my first instance. It’s a great honor to have a PR merged into such a widely used project, and an even bigger honor to know these changes will help many more smooth installs land in production.

Link to the PR: https://github.com/Yenthe666/InstallScript/pull/458

What changed

- Ubuntu 24.04‑friendly pip installs: a tiny `pip_install` helper detects PEP 668 and uses `--break-system-packages` when appropriate.
- Safer shell checks: environment variables are quoted and a bug with `$$INSTALL_POSTGRESQL_SIXTEEN` (PID) is fixed to `$INSTALL_POSTGRESQL_SIXTEEN`.
- PostgreSQL 16 + Enterprise AI: when `IS_ENTERPRISE=True`, the script installs `postgresql-16-pgvector`, waits for Postgres readiness, and creates the `vector` extension in `template1`.
- Wkhtmltopdf and apt hardening: consistent `apt-get -y`, quoted conditionals, and aligned behavior with the upstream expectations.
- Added Docker test harness: a minimal Ubuntu 24.04 image and `docker-compose.yml` to run the installer in a clean, reproducible environment.

Why it matters

- Fewer surprises on Ubuntu 24.04 where Python packaging is stricter by default.
- Cleaner, more portable shell logic that behaves correctly when variables are unset.
- pgvector support enabled for Odoo Enterprise AI features — only when Enterprise is selected.
- A fast feedback loop for contributors and integrators through a disposable Docker environment.

Try the new Docker test environment

```
cd test_install
docker compose build
docker compose up -d
docker compose exec odoo19 bash -lc "chmod +x /opt/odoo-install/odoo_install.sh && /opt/odoo-install/odoo_install.sh"
```

The container sets locale/timezone non‑interactively, so the installer runs end‑to‑end without tzdata prompts. From there you can tweak flags such as `INSTALL_POSTGRESQL_SIXTEEN`, `IS_ENTERPRISE`, and `INSTALL_WKHTMLTOPDF` to exercise the different branches.

Gratitude and community

The InstallScript has been a cornerstone for the Odoo ecosystem for years. Huge thanks to Yenthe for the vision and stewardship — contributing here has been on my wish list for a long time. I’m proud this landed and even more excited that so many people will use it in their daily work. I also hope the community picks this up and adds similar Docker test harnesses for previous Odoo versions so we can validate changes quickly across releases.

What’s next

I’ll keep contributing PRs to open source projects I use and care about. Next up: OCA’s `queue_job` — I’m working on a migration to version 19 along with improvements to make background tasks even more reliable and developer‑friendly.

If you rely on InstallScript or have ideas for the Docker harness, I’d love to hear from you.
