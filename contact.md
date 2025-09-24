---
layout: default
title: Contact
permalink: /contact/
---

<style>
  /* Dark-styled select consistent across browsers */
  .select-dark {
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    width: 100%;
    border-radius: 0.375rem; /* ~6px */
    border: 1px solid rgba(255,255,255,0.10);
    background-color: rgba(255,255,255,0.05);
    color: #e5e7eb; /* slate-200 */
    padding: 0.5rem 2.25rem 0.5rem 0.75rem; /* leave space for arrow */
    line-height: 1.5;
    background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="%23cbd5e1"><path fill-rule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.17l3.71-2.94a.75.75 0 1 1 .94 1.16l-4.24 3.36a.75.75 0 0 1-.94 0L5.21 8.39a.75.75 0 0 1 .02-1.18z" clip-rule="evenodd"/></svg>');
    background-repeat: no-repeat;
    background-position: right 0.6rem center;
    background-size: 1rem 1rem;
  }
  .select-dark:focus {
    outline: none;
    border-color: rgba(34,211,238,0.4); /* cyan-400 */
    box-shadow: 0 0 0 2px rgba(34,211,238,0.3);
  }
  .select-dark option { background-color: #0f1014; color: #e5e7eb; }
  .select-dark::-ms-expand { display: none; }
</style>

<section class="min-h-[70vh] flex items-center">
  <div class="grid w-full grid-cols-1 items-stretch gap-12 md:grid-cols-2">
  <!-- What to include (left) -->
  <div class="space-y-4 self-center">
    <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white">Contact</h1>
    <h2 class="text-2xl font-bold text-white">What to include</h2>
    <p class="text-base">Include a quick overview so I can respond with an accurate plan:</p>
    <ul class="list-disc pl-6 space-y-2">
      <li><strong>Project</strong>: goal and modules in scope (Sales, CRM, Accounting, Inventory, Website).</li>
      <li><strong>Workflows</strong>: users, volumes, approvals/automation, reporting needs.</li>
      <li><strong>Integrations</strong>: payments, shipping, CRM/BI, marketplaces, other ERPs.</li>
      <li><strong>Timeline</strong>: expected start and target launch.</li>
      <li><strong>Budget</strong>: a range is enough to shape the approach.</li>
    </ul>
  </div>

  <!-- Form card (right) -->
  <div class="rounded-xl border border-white/10 bg-white/5 p-6">
    <h2 class="text-xl font-semibold text-white">Send a message</h2>
    <form action="https://api.web3forms.com/submit" method="POST" class="mt-4 space-y-4">
      <input type="hidden" name="access_key" value="a3d8fb5b-dfaf-4ffd-861f-589f75fdff35">
      <input type="hidden" name="from_name" value="milantopuzov.dev">
      <input type="hidden" name="subject" value="New inquiry from milantopuzov.dev">
      <input type="hidden" name="redirect" value="{{ site.url }}{{ '/thanks/' | relative_url }}">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <label class="block">
          <span class="block text-sm text-slate-200">Your name<span class="text-cyan-300"> *</span></span>
          <input required name="name" type="text" class="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/40" placeholder="Jane Doe">
        </label>
        <label class="block">
          <span class="block text-sm text-slate-200">Email<span class="text-cyan-300"> *</span></span>
          <input required name="email" type="email" class="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/40" placeholder="you@company.com">
        </label>
        <label class="block">
          <span class="block text-sm text-slate-200">Company</span>
          <input name="company" type="text" class="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/40" placeholder="Acme Inc.">
        </label>
        <label class="block">
          <span class="block text-sm text-slate-200">Budget range<span class="text-cyan-300"> *</span></span>
          <select required name="budget" class="select-dark mt-1">
            <option value="" disabled selected>Select a range</option>
            <option>&lt; $2k</option>
            <option>$2k – $5k</option>
            <option>$5k – $10k</option>
            <option>$10k – $20k</option>
            <option>$20k – $50k</option>
            <option>$50k+</option>
          </select>
        </label>
      </div>

      <fieldset class="block">
        <legend class="block text-sm text-slate-200">Project type<span class="text-cyan-300"> *</span></legend>
          <div class="mt-2 grid grid-cols-2 gap-2 text-sm text-slate-200">
          <label class="inline-flex items-center gap-2"><input type="checkbox" name="type[]" value="Implementation" class="h-4 w-4 rounded border-white/20 bg-transparent accent-cyan-400">Implementation</label>
          <label class="inline-flex items-center gap-2"><input type="checkbox" name="type[]" value="Custom Module" class="h-4 w-4 rounded border-white/20 bg-transparent accent-cyan-400">Custom module</label>
          <label class="inline-flex items-center gap-2"><input type="checkbox" name="type[]" value="Integration" class="h-4 w-4 rounded border-white/20 bg-transparent accent-cyan-400">Integration</label>
          <label class="inline-flex items-center gap-2"><input type="checkbox" name="type[]" value="Upgrade/Migration" class="h-4 w-4 rounded border-white/20 bg-transparent accent-cyan-400">Upgrade/Migration</label>
          <label class="inline-flex items-center gap-2"><input type="checkbox" name="type[]" value="Support/Retainer" class="h-4 w-4 rounded border-white/20 bg-transparent accent-cyan-400">Support/Retainer</label>
          <label class="inline-flex items-center gap-2"><input type="checkbox" name="type[]" value="Other" class="h-4 w-4 rounded border-white/20 bg-transparent accent-cyan-400">Other</label>
          </div>
      </fieldset>

      <label class="block">
        <span class="block text-sm text-slate-200">Project brief<span class="text-cyan-300"> *</span></span>
        <textarea required name="message" rows="6" class="mt-1 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/40" placeholder="A short description of your project, key modules and success criteria"></textarea>
      </label>

      <!-- Honeypot (ignored if unchecked/hidden) -->
      <input type="checkbox" name="botcheck" class="hidden" style="display:none;" tabindex="-1" autocomplete="off">

      <div class="pt-2">
        <button type="submit" class="inline-flex h-10 items-center justify-center rounded-md bg-cyan-500/90 px-5 text-sm font-semibold text-black hover:bg-cyan-400">Send message</button>
      </div>
    </form>
  </div>
  </div>
 </section>
