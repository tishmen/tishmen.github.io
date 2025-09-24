---
layout: post
title: "Dropcontact + Odoo CRM: add a one‑click enrichment button"
description: Add an “Enrich with Dropcontact” button to CRM leads (or contacts), call the Dropcontact API in the background, and write back verified emails, company data, and social links. Includes model, XML, and a queued job with retries.
tags: [odoo, crm, enrichment, dropcontact]
---

What we’ll build
- A small addon that:
  - stores your Dropcontact API key in System Parameters,
  - adds a button on the Lead form: “Enrich with Dropcontact”,
  - queues a background job that calls the Dropcontact batch API and polls until the result is ready,
  - writes useful fields (verified email, job/role, company/website/LinkedIn) back on the lead,
  - keeps the raw JSON payload on the record for audit/debugging.

Why a queue?
- Dropcontact is asynchronous (you submit a batch, then poll a request id). Using OCA `queue_job` keeps the UI snappy, handles retries/backoff, and avoids hitting rate limits.

Model changes (fields + button)
{% raw %}
```python
# mt_crm_dropcontact/models/crm_lead.py
from odoo import api, fields, models, _
from odoo.exceptions import UserError

try:
    # OCA queue_job
    from odoo.addons.queue_job.job import job
except Exception:  # pragma: no cover
    job = None


class CrmLead(models.Model):
    _inherit = "crm.lead"

    dc_email = fields.Char(string="DC Verified Email")
    dc_phone = fields.Char(string="DC Phone")
    dc_company = fields.Char(string="DC Company")
    dc_website = fields.Char(string="DC Website")
    dc_linkedin = fields.Char(string="DC LinkedIn")
    dc_job = fields.Char(string="DC Job Title")
    dc_status = fields.Selection([
        ("empty", "Not enriched"),
        ("queued", "Queued"),
        ("running", "Running"),
        ("done", "Done"),
        ("error", "Error"),
    ], default="empty", string="Dropcontact Status", readonly=True)
    dc_last_result = fields.Json(string="DC Raw Result", readonly=True)

    def action_enrich_dropcontact(self):
        self.ensure_one()
        if not self.email_from and not (self.partner_name or self.contact_name or self.name):
            raise UserError(_("Provide at least an email or a name/company before enriching."))
        self.write({"dc_status": "queued"})
        if job:
            self.with_delay(priority=50).job_enrich_dropcontact()
        else:
            # fallback (synchronous) – not recommended in production
            self.job_enrich_dropcontact()

    def _dc_build_payload(self):
        """Build a single‑record payload for Dropcontact batch API.
        The API accepts multiple hints: email, firstname/lastname, company, website, linkedin.
        """
        return {
            "email": (self.email_from or "").strip() or None,
            "firstname": (self.contact_name or "").split(" ")[0] if self.contact_name else None,
            "lastname": (self.contact_name or self.partner_name or self.name or "").split(" ")[-1],
            "company": (self.company_name or (self.partner_id and self.partner_id.name) or "") or None,
            "website": (self.website or (self.partner_id and self.partner_id.website) or "") or None,
            # You can also pass a LinkedIn profile URL when available
            # "linkedin": self.x_linkedin_url or None,
        }

    @job
    def job_enrich_dropcontact(self):  # type: ignore[misc]
        self.ensure_one()
        icp = self.env["ir.config_parameter"].sudo()
        token = icp.get_param("dropcontact.api_key")
        if not token:
            self.write({"dc_status": "error"})
            raise UserError(_("Missing System Parameter dropcontact.api_key"))

        import json
        import time
        import requests

        headers = {
            "Content-Type": "application/json",
            "X-Access-Token": token,  # Dropcontact header name
        }
        payload = {"data": [self._dc_build_payload()]}
        # Submit batch
        r = requests.post("https://api.dropcontact.io/batch", data=json.dumps(payload), headers=headers, timeout=30)
        r.raise_for_status()
        data = r.json()
        request_id = data.get("request_id") or data.get("requestId")
        if not request_id:
            self.write({"dc_status": "error", "dc_last_result": data})
            return

        # Poll until ready (Dropcontact replies with status: waiting/running/done)
        self.write({"dc_status": "running"})
        for _ in range(30):  # ~ up to ~90s
            time.sleep(3)
            g = requests.get(f"https://api.dropcontact.io/batch/{request_id}", headers=headers, timeout=30)
            g.raise_for_status()
            out = g.json()
            status = out.get("status")
            if status == "done":
                # Extract the first result
                items = out.get("data") or out.get("result") or []
                first = items[0] if items else {}
                # Common keys in Dropcontact responses
                email = first.get("email") or first.get("email_finder")
                phone = first.get("phone") or first.get("phone_number")
                company = (first.get("company") or {}).get("name") if isinstance(first.get("company"), dict) else first.get("company")
                website = (first.get("company") or {}).get("website") or first.get("website")
                linkedin = first.get("linkedin") or (first.get("company") or {}).get("linkedin")
                job = first.get("job") or first.get("job_title")
                vals = {
                    "dc_email": email,
                    "dc_phone": phone,
                    "dc_company": company,
                    "dc_website": website,
                    "dc_linkedin": linkedin,
                    "dc_job": job,
                    "dc_last_result": out,
                    "dc_status": "done",
                }
                self.write(vals)
                return
        # timeout
        self.write({"dc_status": "error"})
```
{% endraw %}

Add a button and fields on the form view
{% raw %}
```xml
<!-- mt_crm_dropcontact/views/crm_lead_views.xml -->
<odoo>
  <record id="view_crm_lead_form_dropcontact" model="ir.ui.view">
    <field name="name">crm.lead.form.dropcontact</field>
    <field name="model">crm.lead</field>
    <field name="inherit_id" ref="crm.crm_lead_view_form"/>
    <field name="arch" type="xml">
      <xpath expr="//header" position="inside">
        <button name="action_enrich_dropcontact" type="object" string="Enrich with Dropcontact"
                class="oe_highlight" attrs="{'invisible':[('type','!=','opportunity')]}"/>
      </xpath>
      <xpath expr="//sheet/notebook" position="inside">
        <page string="Dropcontact">
          <group>
            <field name="dc_status"/>
            <field name="dc_email"/>
            <field name="dc_phone"/>
            <field name="dc_company"/>
            <field name="dc_website"/>
            <field name="dc_linkedin"/>
            <field name="dc_job"/>
          </group>
          <group string="Raw JSON">
            <field name="dc_last_result" widget="json"/>
          </group>
        </page>
      </xpath>
    </field>
  </record>
</odoo>
```
{% endraw %}

System parameter & security
- Store the API key under Settings → Technical → System Parameters as `dropcontact.api_key`.
- If you keep the synchronous fallback, ensure the server has outbound HTTPS; but prefer `queue_job` to avoid timeouts.
- Add an access group if only specific roles should trigger enrichment.

Batch enrichment from the list view
- Add a contextual action (server action) that loops over selected leads and calls `action_enrich_dropcontact()`; jobs will queue individually.

Data mapping hints (based on the public API)
- URL: `https://api.dropcontact.io/batch`
- Auth header: `X-Access-Token: <YOUR_TOKEN>`
- Submit JSON `{"data": [ { "email": "…", "firstname": "…", "lastname": "…", "company": "…", "website": "…", "linkedin": "…" } ] }`
- Response gives a `request_id` (or `requestId`) → poll `GET /batch/{request_id}` until `status == "done"`.
- The returned record typically includes `email` (verified), `phone`/`phone_number`, `job`/`job_title`, and a `company` object with `name`, `website`, `linkedin`.

GDPR and consent
- Only enrich business contacts you’re allowed to process. Be transparent in your privacy notice and honor opt‑out requests.

Going further
- Mirror the same fields on `res.partner` and allow enrichment for existing contacts.
- Limit concurrency through queue channels if you enrich thousands at once.
- Log each enrichment in a custom model for auditability and cost tracking.

