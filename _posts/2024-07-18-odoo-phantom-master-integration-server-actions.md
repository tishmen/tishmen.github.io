---
layout: post
title: "PhantomBuster + Odoo Automations: launch LinkedIn workflows from a button"
description: Use Odoo’s automated actions to launch a PhantomBuster agent (e.g., LinkedIn profile or search exports), monitor the run, and pull results back into Odoo. Includes fields, server actions, and queued jobs.
tags: [odoo, automation, linkedin, phantombuster]
---

PhantomBuster provides ready‑made “agents” (automations) for LinkedIn and other platforms (e.g., Profile Scraper, Search Export, Network Export). Each agent can be launched via API and returns a result file (CSV/JSON) when finished. We’ll wire this into Odoo so a user can click a button to run an agent for a record, and the results get attached back to the record.

What we’ll build
- System parameters for the PhantomBuster API key.
- Fields on a model (e.g., CRM Lead) to store Agent ID, last launch id, and result URL.
- A server action button “Run PhantomBuster” that queues a job:
  - POST launch → get a `containerId` (or `executionId`).
  - Poll GET status until the run is finished.
  - Download the result file and attach it to the record.

API endpoints (public docs summary)
- Base: `https://api.phantombuster.com/api/v2`
- Auth header: `X-Phantombuster-Key-1: <API_KEY>`
- Launch an agent: `POST /agents/launch?id=<AGENT_ID>` (returns `containerId` / `executionId`)
- Get a launch status: `GET /containers/fetch?id=<containerId>` (provides `status` and result info)
- Result files: an URL is provided in the container/agent output; usually a direct `csvUrl`/`jsonUrl` or a `fileUrl` in the agent’s `output`.

Model & automation (example on crm.lead)
{% raw %}
```python
# mt_phantombuster/models/crm_lead.py
from odoo import api, fields, models, _
from odoo.exceptions import UserError

try:
    from odoo.addons.queue_job.job import job
except Exception:
    job = None


class CrmLead(models.Model):
    _inherit = "crm.lead"

    pb_agent_id = fields.Char(string="PB Agent ID")
    pb_last_container_id = fields.Char(string="PB Last Run ID", readonly=True)
    pb_result_url = fields.Char(string="PB Result URL", readonly=True)
    pb_status = fields.Selection([
        ("empty", "Not run"),
        ("queued", "Queued"),
        ("running", "Running"),
        ("done", "Done"),
        ("error", "Error"),
    ], default="empty", readonly=True)

    def action_run_phantombuster(self):
        self.ensure_one()
        if not self.pb_agent_id:
            raise UserError(_("Set a PhantomBuster Agent ID first."))
        self.write({"pb_status": "queued"})
        if job:
            self.with_delay(priority=60).job_run_phantombuster()
        else:
            self.job_run_phantombuster()

    def _pb_headers(self):
        key = self.env["ir.config_parameter"].sudo().get_param("phantombuster.api_key")
        if not key:
            raise UserError(_("Missing System Parameter phantombuster.api_key"))
        return {"X-Phantombuster-Key-1": key}

    @job
    def job_run_phantombuster(self):  # type: ignore[misc]
        import requests, time
        self.ensure_one()
        base = "https://api.phantombuster.com/api/v2"
        headers = self._pb_headers()

        # 1) Launch the agent
        r = requests.post(f"{base}/agents/launch", params={"id": self.pb_agent_id}, headers=headers, timeout=30)
        r.raise_for_status()
        data = r.json()
        container_id = (data.get("containerId") or data.get("id") or data.get("executionId"))
        if not container_id:
            self.write({"pb_status": "error"})
            return
        self.write({"pb_last_container_id": str(container_id), "pb_status": "running"})

        # 2) Poll the container until done
        for _ in range(40):  # ~2 min with 3s sleeps
            time.sleep(3)
            s = requests.get(f"{base}/containers/fetch", params={"id": container_id}, headers=headers, timeout=30)
            s.raise_for_status()
            cont = s.json()
            status = (cont.get("status") or cont.get("container") and cont["container"].get("status"))
            if status in ("aborted", "failed", "error"):
                self.write({"pb_status": "error"})
                return
            if status in ("finished", "success", "done"):
                # Extract result link (depends on agent); try common keys
                output = cont.get("output") or cont.get("container", {}).get("output") or {}
                url = output.get("csvUrl") or output.get("jsonUrl") or output.get("fileUrl") or output.get("resultUrl")
                if url:
                    self.write({"pb_result_url": url, "pb_status": "done"})
                else:
                    self.write({"pb_status": "done"})
                return
        # timed out
        self.write({"pb_status": "error"})
```
{% endraw %}

Add a button and a tab on the form
{% raw %}
```xml
<!-- mt_phantombuster/views/crm_lead_views.xml -->
<odoo>
  <record id="view_crm_lead_form_phantombuster" model="ir.ui.view">
    <field name="name">crm.lead.form.phantombuster</field>
    <field name="model">crm.lead</field>
    <field name="inherit_id" ref="crm.crm_lead_view_form"/>
    <field name="arch" type="xml">
      <xpath expr="//header" position="inside">
        <button name="action_run_phantombuster" type="object" string="Run PhantomBuster" class="oe_highlight"/>
      </xpath>
      <xpath expr="//sheet/notebook" position="inside">
        <page string="PhantomBuster">
          <group>
            <field name="pb_agent_id"/>
            <field name="pb_last_container_id"/>
            <field name="pb_status"/>
            <field name="pb_result_url" widget="url"/>
          </group>
        </page>
      </xpath>
    </field>
  </record>
</odoo>
```
{% endraw %}

Use cases
- LinkedIn Profile Scraper: store the Agent ID for a scraper configured to use a profile URL on the lead; the agent enriches headline, company, and links; attach the CSV to the lead.
- LinkedIn Search Export: store the Agent ID for a search export; the button pulls a fresh CSV of search results linked to the lead’s keywords.

Tips
- Keep your Agent configured in PhantomBuster with sensible defaults; use “Agent input” to pull the URL or keywords from Odoo fields if needed (via Agent arguments).
- If your plan allows webhooks, configure a webhook to call back an Odoo controller when the run is finished, so you don’t have to poll.
- Always store the API key in `phantombuster.api_key` (System Parameters) and restrict who can run agents.
- For bulk runs, add a list‑view server action that queues a job per record and throttles via queue channels.

Compliance
- Respect LinkedIn’s terms and fair‑use policies. Only process public data or data you’re allowed to handle, and adhere to your customer’s privacy policy.

