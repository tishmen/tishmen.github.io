---
layout: post
title: "Odoo POS: Custom receipts and payments"
description: How to brand the POS receipt (with a QR) and streamline payments (add a method, map journals, and auto‑select one at checkout).
tags: [odoo, pos]
---

This guide walks through two practical tweaks I apply on most POS roll‑outs, giving you a quick, repeatable pattern to brand receipts and cut clicks at checkout without touching core code or fighting upgrades:

1) Brand the printed ticket and inject a QR code on the receipt.
2) Add a new payment method and auto‑select the right one (cash vs. card) on the Payment screen.

Everything below is a thin addon you can drop into your instance. No core patching.

Section headers: Receipt, Payments, Putting it together.

Receipt — extend the ticket and add a QR
- Goal: show a short “thank you” note and a QR that points to an order page (or a loyalty URL).
- Strategy: patch the data that feeds the receipt and minimally extend the receipt template.

Addon layout
```
mt_pos_custom/
  __manifest__.py
  static/src/js/receipt_data.js
  static/src/xml/receipt.xml
  static/src/js/payment_default.js
  data/payment_method.xml          # optional, for creating a payment method
```

manifest
```python
# mt_pos_custom/__manifest__.py
{
    "name": "POS – receipt + payment tweaks",
    "version": "1.0",
    "depends": ["point_of_sale", "account"],
    "assets": {
        # Load in the POS web client
        "point_of_sale._assets_pos": {
            "mt_pos_custom/static/src/js/receipt_data.js",
            "mt_pos_custom/static/src/xml/receipt.xml",
            "mt_pos_custom/static/src/js/payment_default.js",
        },
    },
}
```

Inject fields into the receipt data
```javascript
// mt_pos_custom/static/src/js/receipt_data.js
/** @odoo-module **/
import { patch } from "@web/core/utils/patch";
import { Order } from "@point_of_sale/app/store/models";
import { qrCodeSrc } from "@point_of_sale/utils";

const superExport = Order.prototype.export_for_printing;

patch(Order.prototype, "mt_pos_custom.receipt_data", {
    export_for_printing() {
        const data = superExport.call(this);
        // Example URL – adapt to your use‑case (loyalty, invoice request, survey, etc.)
        const target = `${this.pos.base_url}/shop/order/${encodeURIComponent(this.name)}`;
        data.custom_qr = qrCodeSrc(target);
        data.custom_note = `Thanks for your purchase — ${this.name}`;
        return data;
    },
});
```

Extend the receipt template
```xml
<!-- mt_pos_custom/static/src/xml/receipt.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<templates xml:space="preserve">
  <!-- Insert a note + QR above the footer on the receipt -->
  <t t-extend="point_of_sale.OrderReceipt">
    <t t-jquery=".before-footer" t-operation="before">
      <div class="pos-receipt-center-align">
        <t t-if="props.data.custom_qr">
          <img t-att-src="props.data.custom_qr" style="width:96px;height:96px;margin:6px auto;"/>
        </t>
        <div t-if="props.data.custom_note" style="margin-top:4px"> 
          <t t-esc="props.data.custom_note"/>
        </div>
      </div>
    </t>
  </t>
</templates>
```

Why this works
- The receipt component receives a `data` object built from the current order. We patch the order’s `export_for_printing()` to add two fields (`custom_qr`, `custom_note`).
- The XML extension drops a small block before the footer using Odoo’s template extension mechanism. No core files are edited.

Payments — add a method and auto‑select one on the Payment screen

Add (or map) a payment method
You can do this in the UI (Settings → Point of Sale → Payment Methods) or with XML. Here’s a minimal example that creates a bank method and reuses an existing Bank journal:

```xml
<!-- mt_pos_custom/data/payment_method.xml -->
<odoo>
  <record id="pm_pos_card" model="pos.payment.method">
    <field name="name">Card</field>
    <!-- Map to a bank journal; replace with your journal external id -->
    <field name="journal_id" ref="account.bank_journal"/>
  </record>
</odoo>
```

- After installing the addon, open your POS Configuration and add the method under “Payments”.
- If you need a dedicated journal, create an `account.journal` of type Bank and reference it in the XML instead of `account.bank_journal`.

Auto‑select the right method at checkout
The Payment screen is an OWL component. We can patch its lifecycle and add a payment line automatically based on the order context.

```javascript
// mt_pos_custom/static/src/js/payment_default.js
/** @odoo-module **/
import { patch } from "@web/core/utils/patch";
import { PaymentScreen } from "@point_of_sale/app/screens/payment_screen/payment_screen";

const superOnMounted = PaymentScreen.prototype.onMounted;

patch(PaymentScreen.prototype, "mt_pos_custom.payment_default", {
  onMounted() {
    if (superOnMounted) superOnMounted.call(this);

    try {
      const order = this.currentOrder;
      const due = order.get_due() || order.get_total_with_tax();
      const hasLines = this.paymentLines.length > 0;
      if (hasLines || due <= 0) return;

      // Simple rule: small tickets use cash; otherwise use card/bank.
      const threshold = 50; // change to your needs
      const cash = this.payment_methods_from_config.find((m) => m.type === "cash");
      const card = this.payment_methods_from_config.find((m) => m.type === "bank" || /card/i.test(m.name));
      const target = due < threshold && cash ? cash : card || cash || this.payment_methods_from_config[0];
      if (target) {
        this.addNewPaymentLine(target);
      }
    } catch (err) {
      // Never block payment UI
      console.warn("mt_pos_custom: default payment selection failed", err);
    }
  },
});
```

Why this works
- `payment_methods_from_config` already contains only the methods enabled on the POS.
- Each method has a computed `type` (`cash`, `bank`, or `pay_later`), so you don’t need to inspect journals on the client.
- We only add a line if there isn’t one yet.

Putting it together
1) Drop the addon in your addons path and update apps; install it on the database.
2) In the POS configuration, add the new payment method under Payments (if you created one).
3) Open the POS, create an order, pay — you should see a payment line pre‑selected. Print the ticket to see the note and QR.

Troubleshooting
- “Nothing changes on the receipt”: ensure your XML is loaded into `point_of_sale._assets_pos` and clear the browser cache; re‑enter the POS.
- “The QR is broken”: if you’re fully offline, prefer generating with `qrCodeSrc` as above; avoid pointing to a server‑only barcode endpoint.
- “Auto‑select doesn’t run”: check the browser console; another module may also patch `PaymentScreen`. You can rename your patch key (second param to `patch`) to avoid collisions.

That’s it — a clean way to brand the ticket and remove clicks at payment time.
