---
layout: post
title: "Build a simple AI agent for Odoo with n8n and Odoo MCP"
description: Wire n8n to an Odoo MCP server so natural‑language requests can search or create records in Odoo. Includes end‑to‑end HTTP examples and a minimal n8n flow.
tags: [odoo, mcp, n8n, automation]
---

This post shows how to stand up a small “AI agent” that understands a short text instruction and then performs actions in Odoo (searching leads, creating contacts, etc.).

We’ll combine two pieces:

- Odoo MCP server — exposes Odoo as [MCP](https://modelcontextprotocol.io/) tools and resources (search, create, update, …).
- n8n — orchestrates a tiny flow that accepts a request (Webhook), lets an LLM decide what to do, and then calls the MCP tools over HTTP.

Overview
- Run the Odoo MCP server in HTTP mode.
- n8n flow: Webhook → LLM (intent + arguments) → HTTP Request to MCP tools → return result.

1) Run the Odoo MCP server (HTTP transport)

```bash
# Install UV (once) — macOS/Linux
curl -LsSf https://astral.sh/uv/install.sh | sh

# Start the MCP server with HTTP transport
export ODOO_URL="https://YOUR_ODOO_URL"
export ODOO_API_KEY="YOUR_ODOO_API_KEY"   # or ODOO_USER/ODOO_PASSWORD
export ODOO_DB="YOUR_DB"                  # required if DB listing is disabled
uvx mcp-server-odoo --transport streamable-http --host 127.0.0.1 --port 8000

# The server listens on http://127.0.0.1:8000
# Tip: use an API key from Settings → Users → API Keys.
```

Notes
- You can control which models are exposed via the official MCP module (Settings → MCP Server). For quick demos, the server also supports “YOLO” modes — keep that off in real projects.

2) MCP HTTP basics you’ll use from n8n
The HTTP transport speaks JSON‑RPC 2.0. Each request must:

- POST to `http://127.0.0.1:8000` (root path),
- send `Content-Type: application/json`, and
- accept both `application/json` and `text/event-stream`.

The server will reply with JSON and a header `mcp-session-id` you should reuse on subsequent calls.

List tools
```http
POST / HTTP/1.1
Host: 127.0.0.1:8000
Accept: application/json, text/event-stream
Content-Type: application/json

{"jsonrpc":"2.0","id":"1","method":"tools/list","params":{}}
```

Call a tool (example: search records)
```http
POST / HTTP/1.1
Host: 127.0.0.1:8000
Accept: application/json, text/event-stream
Content-Type: application/json
mcp-session-id: <value-from-previous-response>

{
  "jsonrpc": "2.0",
  "id": "2",
  "method": "tools/call",
  "params": {
    "name": "search_records",
    "arguments": {
      "model": "crm.lead",
      "domain": [["email_from", "=", "prospect@example.com"]],
      "fields": ["name", "email_from", "phone"],
      "limit": 5
    }
  }
}
```

Create a record (lead)
{% raw %}
```json
{
  "jsonrpc": "2.0",
  "id": "3",
  "method": "tools/call",
  "params": {
    "name": "create_record",
    "arguments": {
      "model": "crm.lead",
      "values": {
        "name": "Website contact – {{ $json.name }}",
        "email_from": "{{ $json.email }}",
        "description": "{{ $json.message }}"
      }
    }
  }
}
```
{% endraw %}

3) The minimal n8n flow
Use a Webhook to accept a free‑form message, ask an LLM to decide the action + arguments, then call the MCP tool.

Nodes
1. Webhook (POST /agent)
2. OpenAI Chat (or Anthropic) — system prompt asks for a JSON decision:

```text
You are a routing agent for Odoo. Output only compact JSON with the schema:
{ "tool": "search_records|create_record", "args": {…} }
Examples:
- Find leads by email → {"tool":"search_records","args":{"model":"crm.lead","domain":[["email_from","=","foo@bar"]],"fields":["name","email_from"],"limit":5}}
- Create lead → {"tool":"create_record","args":{"model":"crm.lead","values":{"name":"Website contact – Alice","email_from":"alice@ex.com"}}}
```

3. Function — parse the model output to JSON (guardrails):

```js
// n8n Function node
const txt = $json.text || $json.choices?.[0]?.message?.content || '';
let out;
try { out = JSON.parse(txt); } catch (e) { out = { tool: 'search_records', args: { model:'crm.lead', domain: [["name","ilike", txt]], limit: 5 } }; }
return out;
```

4. HTTP Request — call MCP `tools/call`:

- Method: POST
- URL: http://127.0.0.1:8000
- Headers:
  - Accept: `application/json, text/event-stream`
  - Content-Type: `application/json`
  - mcp-session-id: reference the header value from the first request (store it with an earlier “tools/list” call or precreate one per workflow run).
- Body (raw JSON):

{% raw %}
```json
{
  "jsonrpc": "2.0",
  "id": "{{$now}}",
  "method": "tools/call",
  "params": {
    "name": "{{$json.tool}}",
    "arguments": {{$json.args}}
  }
}
```
{% endraw %}

5. Respond to Webhook — format the `result.structuredContent` or `result.content[0].text` back to the caller.

Security & model access
- Prefer API key authentication; the MCP server enforces model‑level access configured in Odoo.
- Only enable the models you intend to expose (e.g., `crm.lead`, `res.partner`).

Why use MCP here?
- You avoid bespoke JSON‑RPC glue in every flow. The agent calls named tools with JSON Schemas, and the server handles permissions and field mapping.

Next steps
- Add more tools (e.g., `update_record`) and extend your LLM prompt with examples.
- Teach the agent to normalize ambiguous inputs (country codes, phone formatting).
- Log every call in Odoo for auditability.
