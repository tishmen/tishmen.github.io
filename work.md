---
layout: default
title: My work
permalink: /work/
---

<section class="space-y-6 text-slate-300 leading-relaxed">
  <h1 class="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-white">My work</h1>
  <p class="text-slate-300">What’s on Milan Topuzov’s build list.</p>
  <div class="mt-6 mb-8 h-px w-full bg-white/10"></div>

  <div class="flex flex-col gap-6">
    <article class="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-sm">
      <img
        src="{{ '/assets/images/heyagent-card.png' | relative_url }}"
        alt="Heya.gent control panel for orchestrating n8n automations"
        class="aspect-video w-full object-cover"
        loading="lazy"
      />
      <div class="flex flex-1 flex-col gap-4 p-6">
        <header>
          <h3 class="text-xl font-semibold text-white">Heya.gent</h3>
          <p class="mt-1 text-sm text-slate-300">Remote control layer for orchestrating n8n workflows through a clean REST API.</p>
        </header>
        <section class="text-sm text-slate-300">
          <p>Heya.gent gives operations teams a unified panel to trigger, monitor, and sequence n8n automations from third-party systems without exposing the raw editor.</p>
        </section>
        <section class="mt-auto">
          <h4 class="text-sm font-semibold uppercase tracking-wide text-slate-200">Challenges Tackled</h4>
          <ul class="mt-2 space-y-2 text-sm text-slate-300 list-disc list-inside">
            <li>Wrapped n8n workflow execution in granular authentication &amp; rate controls.</li>
            <li>Designed idempotent REST actions that map back to complex automation graphs.</li>
            <li>Delivered live run telemetry with WebSocket fallbacks for legacy systems.</li>
          </ul>
        </section>
      </div>
    </article>

    <article class="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-sm">
      <img
        src="{{ '/assets/images/salewise-card.png' | relative_url }}"
        alt="Salewise.io interface highlighting headless Odoo quoting workflows"
        class="aspect-video w-full object-cover"
        loading="lazy"
      />
      <div class="flex flex-1 flex-col gap-4 p-6">
        <header>
          <h3 class="text-xl font-semibold text-white">Salewise.io</h3>
          <p class="mt-1 text-sm text-slate-300">Headless Odoo implementation with a bespoke front-end, optimized for B2B quoting.</p>
        </header>
        <section class="text-sm text-slate-300">
          <p>Salewise decouples Odoo’s business logic from the presentation layer, offering a lightning-fast experience for sales teams without sacrificing ERP integrity.</p>
        </section>
        <section class="mt-auto">
          <h4 class="text-sm font-semibold uppercase tracking-wide text-slate-200">Challenges Tackled</h4>
          <ul class="mt-2 space-y-2 text-sm text-slate-300 list-disc list-inside">
            <li>Mapped complex Odoo workflows to stateless REST endpoints for the front-end.</li>
            <li>Maintained transactional integrity while batching operations across services.</li>
            <li>Built a component kit that mirrors Odoo’s validation rules in the browser.</li>
          </ul>
        </section>
      </div>
    </article>

    <article class="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/5 shadow-sm">
      <img
        src="{{ '/assets/images/serpwatch-card.png' | relative_url }}"
        alt="SerpWatch.io marketing site hero with headline and dashboard preview"
        class="aspect-video w-full object-cover"
        loading="lazy"
      />
      <div class="flex flex-1 flex-col gap-4 p-6">
        <header>
          <h3 class="text-xl font-semibold text-white">Serpwatch.io</h3>
          <p class="mt-1 text-sm text-slate-300">Rank tracking platform built during the Firestore Beta era with a Vue 2 front-end.</p>
        </header>
        <section class="text-sm text-slate-300">
          <p>We built Serpwatch as an early adopter of Google Cloud’s serverless stack. Working against beta APIs meant frequent breaking changes, limited tooling, and a fast-moving roadmap.</p>
        </section>
        <section class="mt-auto">
          <h4 class="text-sm font-semibold uppercase tracking-wide text-slate-200">Challenges Tackled</h4>
          <ul class="mt-2 space-y-2 text-sm text-slate-300 list-disc list-inside">
            <li>Stabilized a mission-critical data pipeline on the Firestore Beta SDK.</li>
            <li>Designed Vue 2 components around real-time sync and offline persistence.</li>
            <li>Mitigated quota shifts and undocumented breaking changes with guard rails.</li>
          </ul>
        </section>
      </div>
    </article>
  </div>

  <p class="mt-8 text-sm text-slate-400">Need details on a specific build? <a href="{{ '/contact/' | relative_url }}" class="text-slate-200 underline decoration-dotted underline-offset-4 hover:text-white">Let’s talk.</a></p>
</section>
