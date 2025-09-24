---
layout: post
title: "Offering Odoo as SaaS: architecture, provisioning, and billing with OCA Contracts"
description: "A practical blueprint for packaging Odoo as a service: isolation strategies, provisioning flows, and recurring billing using OCA’s Contracts (recurring invoices). Includes small code snippets and links to modules you’ll likely need."
tags: [odoo, saas, subscriptions, oca]
---

Why Odoo works well for SaaS
- Flexible data model and mature apps (Accounting, Inventory, CRM, Website, Helpdesk).
- Clean multi‑database story, so you can isolate tenants safely.
- Huge ecosystem (OCA and App Store) to add exactly what you need.

Isolation strategies
1) One database per tenant (recommended)
   - Cleanest blast radius; each customer gets its own DB (backup/restore/migrate independently).
   - Easy to scale with Docker/Kubernetes or Odoo.sh (per tenant project/branch or per database).
   - Domain routing with a reverse proxy; Odoo selects the DB with `dbfilter`.
   - Useful OCA helper: dbfilter from domain/header (see OCA/server‑tools: dbfilter_from_header, dbfilter_domain).
2) Single database with multi‑company
   - Lower infra overhead; acceptable for smaller tenants but record‑rule hygiene must be perfect.
   - Migrations and noisy‑neighbor risk are shared.
3) Shared DB + hard multi‑tenant customizations
   - Only when you truly need shared reporting across tenants. Highest complexity.

Typical SaaS control‑plane
1) Signup / plan selection → create a subscription record in your “control” DB.
2) Provision → create a new Odoo database from a template, install modules, create the admin user.
3) Configure DNS → `tenant.example.com` → reverse proxy → tenant Odoo, `dbfilter=^tenant$`.
4) Recurring billing → generate invoices, charge card, manage dunning; suspend when overdue.

Provisioning flow (one‑DB‑per‑tenant)
- Build a template database (modules + sample data). Periodically export it or keep a warm template cluster DB.
- Provisioner actions:
  - Create DB (Postgres) from template, or run Odoo’s init with a modules list.
  - Call Odoo’s _first install_ to load modules and admin user.
  - Write initial configuration (company, languages, users, mail, payment acquirer).
  - Return the URL + credentials to the control‑plane.

Example: provisioning with JSON‑RPC (from your control app)
```python
import requests, time

ODOO_URL = "https://saas-gateway.example.com"
MASTER_PWD = "********"  # Odoo master password on the gateway instance

def create_db(dbname: str, demo=False):
    # Uses Odoo’s /web/database/create; run behind an internal endpoint
    payload = {
        "jsonrpc": "2.0",
        "method": "call",
        "params": {
            "master_pwd": MASTER_PWD,
            "name": dbname,
            "lang": "en_US",
            "login": "admin",
            "password": "change_me",
            "country_code": "US",
            "phone": False,
            "demo": demo,
        },
        "id": int(time.time()),
    }
    r = requests.post(f"{ODOO_URL}/web/database/create", json=payload, timeout=120)
    r.raise_for_status()
    if r.json().get("error"):
        raise RuntimeError(r.json()["error"])  # surface server errors

# after create_db, authenticate to the new db and install extra modules via /web/dataset/call_kw('ir.module.module','button_immediate_install',...)
```

Remarks
- Hide `/web/database/*` behind VPN or an internal network; never expose master password publicly.
- Many teams prefer copying a prepared template DB at the Postgres level for speed, then running a short post‑install script inside Odoo for tenant specifics.
- For background provisioning, pick a job queue (OCA’s `queue_job`) to avoid timeouts and to retry safely.

Billing with OCA Contracts (recurring invoices)

The official Odoo Subscription app (“sale_subscription”) is enterprise; if you want an open‑source path, the OCA **Contracts** suite provides recurring contracts and invoice generation. Repo: https://github.com/OCA/contract

Core modules to look at
- `contract` — base models (`contract.contract`, lines, recurrence fields, cron to generate invoices).
- `contract_sale` — create a contract when a sales order confirms.
- `contract_invoice` / `contract_recurring` (depending on version) — helpers for recurring invoicing.
- Related: payment/mandate modules, SEPA, payment tokens (depending on your acquirer setup).

How it fits a SaaS
1) Create a product per plan (e.g., "Starter", "Pro") with the correct income accounts and taxes.
2) A sales order for that product creates a `contract.contract` tied to the customer.
3) The contract line has recurrence: every month/quarter it generates an invoice.
4) Add an online payment acquirer; capture automatically (or dunning if unpaid).
5) A server action watches for unpaid status and sets the tenant to "suspended" (read‑only or login‑blocked) until payment clears.

Minimal example: create a contract programmatically
```python
# inside Odoo server action / custom module
env = env  # provided in server action context
partner = env["res.partner"].browse(partner_id)
plan_product = env["product.product"].browse(plan_product_id)

contract = env["contract.contract"].create({
    "name": f"SaaS – {partner.name}",
    "partner_id": partner.id,
    "recurring_rule_type": "monthly",   # monthly/weekly/quarterly/yearly
    "recurring_interval": 1,
    "company_id": env.company.id,
})

env["contract.line"].create({
    "name": plan_product.name,
    "contract_id": contract.id,
    "product_id": plan_product.id,
    "price_unit": plan_product.lst_price,
    "quantity": 1,
    "recurring_rule_type": "monthly",
    "recurring_interval": 1,
})
```

Operational tips
- Use `queue_job` for any external‑API heavy lifting (provision, suspend, migrate), with retries and backoff.
- Expose metrics per tenant (DB size, users, mail volume) for cost and plan limits.
- Backups: per‑tenant daily snapshots + point‑in‑time recovery on Postgres where possible.
- Upgrades: stage a copy of each tenant DB, run migrations, smoke‑test, then promote.
- Routing: a reverse proxy (Traefik/Nginx) + TLS per tenant; map subdomains to specific containers/DB filters.

Useful links
- OCA Contracts: https://github.com/OCA/contract
- OCA queue (job queue): https://github.com/OCA/queue
- OCA server‑tools (dbfilter helpers): https://github.com/OCA/server-tools
- App Store searches (to explore payment acquirers, dunning): https://apps.odoo.com/apps/modules?search=recurring+invoice

Bottom line
Start with one‑DB‑per‑tenant, automate provisioning with a template and a job queue, and bill with OCA Contracts. Add payment acquirers + dunning on top. This gives you a sane, supportable SaaS from day one—and a clean path to scale and upgrade.

Deep‑dive: OCA Contracts essentials
----------------------------------

The **contract** base module (repo: https://github.com/OCA/contract, addon `contract/`) provides:

- Models: `contract.contract` and `contract.line`.
- Recurrence on the line: `recurring_rule_type` (days/weeks/months/month_last_day/years), `recurring_interval`, `date_start`, `date_next`, optional `date_end`.
- Pre‑paid (invoice at period start) vs Post‑paid (invoice after the period).
- Price source: fixed on the line or `auto_price` to pull from a pricelist.
- Tokens in descriptions like `#START#`, `#END#`, `#INVOICEMONTHNAME#` to render period ranges on invoice lines.
- Daily cron “Generate Recurring Invoices from Contracts” that looks at lines whose `date_next` is due and emits account moves.
- Portal exposure of contracts if the user is a follower.
- Contract templates (defaults for journal/pricelist/lines) to bootstrap new contracts.

Related add‑ons you’ll likely use
- `contract_sale`: create a contract when a Sale Order confirms (ideal for self‑service plan purchases).
- `contract_payment_mode` and `contract_mandate`: propagate payment modes/mandates so invoices use the right acquirer or SEPA.
- `contract_invoice_auto_validate`: auto‑post invoices after generation.
- `contract_price_revision`: scheduled price uplift (e.g., annual CPI or fixed percentage).
- Variable quantity family:
  - `contract_variable_quantity`, `contract_variable_qty_timesheet`, `contract_variable_qty_prorated` — varied usage patterns and proration support.
- `contract_queue_job`: makes the recurring invoice cron enqueue each contract as a separate background job (requires OCA `queue_job`). Enable by setting system parameter `contract.queue.job` to True. (Doc: https://github.com/OCA/contract/tree/18.0/contract_queue_job)

How the invoicing cron works (operationally)
- The standard cron runs daily; in debug you can trigger it from the contract form.
- For each eligible line, it computes the next period boundaries, renders the invoice line (respecting description tokens), and posts the invoice (or drafts it — depending on your policy/`contract_invoice_auto_validate`).
- With `contract_queue_job` enabled, each contract is processed as a separate job — safer for thousands of tenants and easier to retry.

Patterns for a SaaS
- One contract per tenant. Lines correspond to the base plan and any add‑ons (users, storage, environments).
- Use `contract_price_revision` for annual uplifts or currency adjustments.
- For consumption (seats, usage), write a pre‑billing step that updates quantities on the contract lines from metrics gathered during the period; then let the cron invoice the final values.
- Keep a suspension hook: when a contract invoice is overdue, run a job that toggles the tenant to “suspended” and re‑enable on payment.

Minimal “plan template” via SO → contract
{% raw %}
```xml
<!-- A product representing a plan: enables recurring billing through contract_sale -->
<record id="product_plan_pro" model="product.product">
  <field name="name">SaaS Plan – Pro</field>
  <field name="type">service</field>
  <field name="list_price">99.0</field>
  <field name="recurring_invoice">True</field>
  <field name="invoice_policy">order</field>
  <field name="sale_ok">True</field>
  <field name="subscription_template_id" eval="False"/>
  <!-- Fields may differ by version/addons; the idea is SO confirmation creates a contract via contract_sale. -->
  </record>
```
{% endraw %}

Dunning and payment capture
- Use a payment token acquirer (Stripe/Adyen/etc.) and configure automatic capture on invoice post.
- For failures, schedule retries (3‑5 attempts) and send reminders. After a grace window, suspend the tenant and resume on success.
