---
layout: post
title: "Using App‑Store connectors to run Shopify or WooCommerce on an Odoo ERP backend"
description: Instead of bespoke integrations, pick a maintained connector from the Odoo App Store (or OCA) and let Odoo be the source of truth for products, inventory, and accounting. This note outlines what to look for and why it matters.
tags: [odoo, ecommerce, shopify, woocommerce]
---

The quickest way to run Shopify or WooCommerce with Odoo as the ERP is to use a proven connector from the Odoo App Store (or the OCA projects), not custom code. A good connector keeps your catalog, stock, orders, customers and fulfillment synchronized, and it plugs naturally into Odoo’s accounting, warehousing and reporting.

Why this approach
- Time to value: install, configure, sync. No long custom build.
- Lower risk: versioned releases, bugfixes, and upgrade paths across Odoo versions.
- Feature coverage: catalog variants, images, taxes, coupons, refunds, partial shipments, multi‑warehouse.
- Accounting ready: payments, fees and taxes land in Odoo journals for reconciliation.

Where to start (module families)
- OCA (open‑source):
  - Shopify: OCA “connector‑shopify” — https://github.com/OCA/connector-shopify
  - WooCommerce: OCA “connector‑woocommerce” — https://github.com/OCA/connector-woocommerce
  - Background worker: OCA “queue_job” (module in the OCA/queue repo) — https://github.com/OCA/queue
- Commercial vendors on the Odoo App Store (examples):
  - Shopify connector search — https://apps.odoo.com/apps/modules?search=Shopify+Odoo+Connector
  - WooCommerce connector search — https://apps.odoo.com/apps/modules?search=WooCommerce+Odoo+Connector
  - Vendor catalogs for reference:
    - Emipro — https://apps.odoo.com/apps/modules/browse?author=Emipro%20Technologies%20Pvt.%20Ltd.
    - Webkul — https://apps.odoo.com/apps/modules/browse?author=Webkul%20Software%20Pvt%20Ltd

Key evaluation criteria (checklist)
- Maintenance
  - Supported Odoo versions and a public changelog.
  - Track record of releases after major Odoo upgrades.
- Synchronization depth
  - Products & variants, images, categories, attributes.
  - Prices & pricelists, taxes, coupons/discounts.
  - Orders, customers, fulfillment (tracking), refunds/returns.
  - Stock: real‑time or scheduled; multi‑warehouse support; safety buffers.
- Architecture & resilience
  - Uses a background job queue (prefer modules built on “queue_job”) to survive rate limits and spikes.
  - Webhooks for near‑real‑time updates, plus fallbacks (polling, replays).
  - Idempotency and duplicate handling for imports.
- Accounting
  - Payment fee mapping, tax mapping, journals and reconciliation workflows.
  - Multi‑currency and multi‑company.
- Multi‑store
  - Multiple Shopify stores or WooCommerce sites mapped to one Odoo database/companies.
  - Channel fields on orders/products to isolate data and reporting.
- Customization points
  - Clear extension hooks or documented inheritance points for special cases.
- Documentation & support
  - Install/upgrade guides, mapping tables, support/SLA if commercial.

Typical benefits once live
- One source of truth for catalog and inventory in Odoo; channels just sell.
- Clean downstream accounting with automatic taxes, fees and payouts.
- Operations consistency: pick/pack/ship flows and returns are the same regardless of the web channel.
- Scale to multi‑store or multi‑country without custom middleware.

Basic implementation flow
1) Install the connector and its dependencies (if OCA, install `queue_job`).
2) Configure credentials (API keys), webhooks and which objects to sync.
3) Decide the “master” for product data (Shopify, WooCommerce, or Odoo) and run the initial import/export.
4) Map taxes, shipping methods and payment acquirers to Odoo journals.
5) Schedule stock exports and price feeds; enable webhooks for orders and fulfillment.
6) Test edge cases: variants without SKUs, canceled orders, partial deliveries, returns/refunds.

Notes and gotchas
- Tax mapping: align Shopify/WooCommerce tax behavior with Odoo fiscal positions early.
- SKU hygiene: consistent, unique SKUs simplify mapping across channels.
- Stock safety: if oversells hurt, add buffers or use reservations.
- Rate limits: prefer connectors that queue and retry with backoff (again, look for `queue_job`).

Conclusion
Pick a maintained connector first. You’ll move faster, inherit years of edge‑case handling, and keep your integration future‑proof across Odoo upgrades. When you truly need custom behavior, extend the connector’s hooks rather than starting from scratch.
