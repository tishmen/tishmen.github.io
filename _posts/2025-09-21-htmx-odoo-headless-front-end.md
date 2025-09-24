---
layout: post
title: "HTMX + FastAPI front‑end on top of Odoo JSON‑RPC"
description: Build a small headless UI with HTMX served by FastAPI while talking to Odoo over JSON‑RPC. Includes auth, helpers, and example fragments.
tags: [odoo, htmx, fastapi, jsonrpc, headless]
---

This post shows how to run Odoo as a headless ERP and render a fast UI with HTMX served by FastAPI.

We’ll:

- Authenticate to Odoo via JSON‑RPC and reuse the session cookie server‑side.
- Call `search_read`, `create`, and `write` using the `/web/dataset/call_kw` API.
- Serve pages with FastAPI + Jinja; HTMX fetches partials and updates regions without a SPA.

Why this style?
- No custom Odoo controllers required. We use the same JSON‑RPC that the Odoo web client uses.
- Credentials never touch the browser — FastAPI talks to Odoo and returns rendered HTML snippets.

Project layout
```
headless_odoo/
  app.py
  odoo_client.py
  templates/
    base.html
    index.html
    partials/
      customers.html
      new_lead_form.html
  .env
```

Dependencies
```bash
pip install fastapi uvicorn[standard] httpx jinja2 python-dotenv
```

Environment
```
ODOO_URL=https://your-odoo.com
ODOO_DB=your_db
ODOO_LOGIN=your.user@example.com
ODOO_PASSWORD_OR_API_KEY=your_api_key_or_password
```

Odoo JSON‑RPC helper
```python
# odoo_client.py
import os, time, secrets
import httpx
from typing import Any, Iterable

class OdooClient:
    def __init__(self, base_url: str, db: str, login: str, password: str):
        self.base_url = base_url.rstrip('/')
        self.db = db
        self.login = login
        self.password = password
        self.client = httpx.AsyncClient(base_url=self.base_url, timeout=20.0)
        self._sid = None

    async def authenticate(self) -> None:
        payload = {
            "jsonrpc": "2.0",
            "method": "call",
            "params": {"db": self.db, "login": self.login, "password": self.password},
            "id": secrets.token_hex(8),
        }
        r = await self.client.post("/web/session/authenticate", json=payload)
        r.raise_for_status()
        if not r.json().get("result"):
            raise RuntimeError("Authentication failed")
        # Cookies are stored in self.client.cookies; nothing else to do.

    async def call_kw(self, model: str, method: str, *, args: Iterable[Any] | None = None, **kwargs) -> Any:
        args = list(args or [])
        body = {
            "jsonrpc": "2.0",
            "method": "call",
            "params": {
                "model": model,
                "method": method,
                "args": args,
                "kwargs": kwargs,
            },
            "id": int(time.time()),
        }
        # Either of these routes works; the path variant is common in core JS.
        url = f"/web/dataset/call_kw/{model}/{method}"
        r = await self.client.post(url, json=body)
        r.raise_for_status()
        data = r.json()
        if "error" in data:
            raise RuntimeError(data["error"])  # surface server errors
        return data.get("result")

    async def search_read(self, model: str, domain=None, fields=None, limit=20):
        return await self.call_kw(model, "search_read", args=[domain or []], fields=fields or ["name"], limit=limit)

    async def create(self, model: str, values: dict):
        return await self.call_kw(model, "create", args=[[values]])

    async def write(self, model: str, ids: list[int], values: dict):
        return await self.call_kw(model, "write", args=[ids, values])
```

FastAPI app with HTMX views
```python
# app.py
import os
from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from dotenv import load_dotenv
from odoo_client import OdooClient

load_dotenv()

app = FastAPI()
templates = Jinja2Templates(directory="templates")

odoo = OdooClient(
    base_url=os.environ["ODOO_URL"],
    db=os.environ["ODOO_DB"],
    login=os.environ["ODOO_LOGIN"],
    password=os.environ["ODOO_PASSWORD_OR_API_KEY"],
)

@app.on_event("startup")
async def startup():
    await odoo.authenticate()

@app.get("/", response_class=HTMLResponse)
async def index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.get("/customers", response_class=HTMLResponse)
async def customers(request: Request, q: str | None = None):
    domain = [["name", "ilike", q]] if q else []
    rows = await odoo.search_read("res.partner", domain=domain, fields=["name", "email", "phone"], limit=20)
    return templates.TemplateResponse("partials/customers.html", {"request": request, "rows": rows, "q": q or ""})

@app.post("/leads", response_class=HTMLResponse)
async def create_lead(request: Request, name: str = Form(...), email: str = Form(None), note: str = Form(None)):
    values = {"name": name}
    if email: values["email_from"] = email
    if note: values["description"] = note
    lead_id = await odoo.create("crm.lead", values)
    # Return a tiny confirmation snippet the form can swap into place.
    html = f"<div class='text-emerald-400'>Lead #{lead_id} created.</div>"
    return HTMLResponse(html)

# Run: uvicorn app:app --reload
```

Templates (HTMX + Jinja)
{% raw %}
```html
<!-- templates/base.html -->
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Headless Odoo</title>
    <script src="https://unpkg.com/htmx.org@1.9.12"></script>
  </head>
  <body>
    {% block body %}{% endblock %}
  </body>
</html>
```

```html
<!-- templates/index.html -->
{% extends 'base.html' %}
{% block body %}
  <h1>Customers</h1>
  <form hx-get="/customers" hx-target="#list" hx-swap="innerHTML" class="mb-3">
    <input type="text" name="q" placeholder="Search" />
    <button type="submit">Search</button>
  </form>
  <div id="list" hx-get="/customers" hx-trigger="load"></div>

  <h2>New lead</h2>
  <form hx-post="/leads" hx-target="#lead-status" hx-swap="innerHTML">
    <input name="name" placeholder="Lead name" required />
    <input name="email" placeholder="Email (optional)" />
    <textarea name="note" placeholder="Note"></textarea>
    <button>Create</button>
  </form>
  <div id="lead-status"></div>
{% endblock %}
```

```html
<!-- templates/partials/customers.html -->
{% if rows|length == 0 %}
  <em>No results</em>
{% else %}
  <ul>
    {% for r in rows %}
      <li>
        <strong>{{ r.name }}</strong>
        {% if r.email %} — {{ r.email }}{% endif %}
        {% if r.phone %} — {{ r.phone }}{% endif %}
      </li>
    {% endfor %}
  </ul>
{% endif %}
```
{% endraw %}

Bonus: use HyperScript for a lightweight Kanban
HyperScript pairs nicely with HTMX for tiny, declarative interactions (drag‑and‑drop, toggles) without a JS framework. We’ll add a minimal Kanban for `crm.lead` that lets you drag a card between stages.

Add HyperScript
```html
<!-- in templates/base.html head, under HTMX -->
<script src="https://unpkg.com/hyperscript.org@0.9.12"></script>
```

Kanban routes (FastAPI)
```python
# app.py (additions)
from fastapi import Body

STAGES = [
    ("New", 1), ("Qualified", 2), ("Proposition", 3), ("Won", 4)
]  # Replace ids with your stage ids (crm.stage)

@app.get("/kanban", response_class=HTMLResponse)
async def kanban(request: Request):
    return templates.TemplateResponse("kanban.html", {"request": request, "stages": STAGES})

@app.get("/kanban/column", response_class=HTMLResponse)
async def kanban_column(request: Request, stage_id: int):
    rows = await odoo.search_read(
        "crm.lead",
        domain=[["stage_id", "=", stage_id]],
        fields=["name", "partner_name", "email_from", "stage_id"],
        limit=50,
    )
    return templates.TemplateResponse("partials/kanban_column.html", {"request": request, "rows": rows, "stage_id": stage_id})

@app.post("/kanban/move")
async def kanban_move(payload: dict = Body(...)):
    # expects {"id": <lead_id>, "stage_id": <new_stage_id>}
    lead_id = int(payload["id"])  # guard/validate in real code
    stage_id = int(payload["stage_id"]) 
    await odoo.write("crm.lead", [lead_id], {"stage_id": stage_id})
    return {"ok": True}
```

Kanban templates with HyperScript
{% raw %}
```html
<!-- templates/kanban.html -->
{% extends 'base.html' %}
{% block body %}
  <h1>Leads Kanban</h1>
  <div class="kanban" style="display:flex; gap:1rem">
    {% for label, sid in stages %}
      <section class="kanban-col" style="width: 25%" data-stage-id="{{ sid }}"
        _="on dragover prevent default
           on drop set id to window.draggedId then call htmx.ajax('POST','/kanban/move', {values: {id: id, stage_id: @dataset.stageId}}) then trigger reload">
        <header style="font-weight:600">{{ label }}</header>
        <div id="col-{{ sid }}" hx-get="/kanban/column?stage_id={{ sid }}" hx-trigger="load, reload from:section" hx-target="this"></div>
      </section>
    {% endfor %}
  </div>
{% endblock %}
```

```html
<!-- templates/partials/kanban_column.html -->
<ul style="list-style:none; padding:0; margin:.5rem 0; display:grid; gap:.5rem">
  {% for r in rows %}
  <li class="card" draggable="true" style="padding:.5rem; border:1px solid #2a2c3d; border-radius:.5rem; background:#0f1117"
      data-id="{{ r.id }}"
      _="on dragstart set window.draggedId to @dataset.id">
    <strong>{{ r.name }}</strong>
    {% if r.partner_name %}<div class="muted">{{ r.partner_name }}</div>{% endif %}
    {% if r.email_from %}<div class="muted">{{ r.email_from }}</div>{% endif %}
  </li>
  {% endfor %}
</ul>
```
{% endraw %}

How it works
- Each column loads its items via `hx-get` and listens for a custom `reload` event to refresh after a move.
- Cards are `draggable`; a tiny HyperScript sets `window.draggedId` on `dragstart`.
- The column’s `_` handler accepts drops, posts `id` + `stage_id` to `/kanban/move` using `htmx.ajax`, and then triggers a `reload` on itself to re‑fetch its content.
- Everything stays server‑rendered; HyperScript only wires the drag events.

If you prefer not to expose a global, you can stash the dragged id on `document.body.dataset.dragId` instead of `window` in the HyperScript.

Security & tips
- Keep credentials server‑side; never call Odoo JSON‑RPC directly from the browser.
- Restrict exposed models using record rules and (if installed) the MCP module’s allow‑list.
- Prefer API keys for auth; rotate them.
- Cache hot reads in memory or Redis (e.g., product lists) — JSON‑RPC is fast but you still save round‑trips.
- If you serve FastAPI under another domain, enable CORS on FastAPI, not Odoo.

Where to go next
- Paginate with HTMX: add `page` param and buttons that `hx-get` the next page.
- Inline edits: post small forms to `/partners/{id}/write` that call `write` via `odoo.call_kw`.
- Validation: surface model constraint errors back into the form region with HTMX swaps.
