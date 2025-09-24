---
layout: default
title: Home
permalink: /
---

<section class="grid gap-10 md:grid-cols-2 items-center">
  <div class="space-y-4">
    <span class="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-cyan-300/90">Odoo apps · Integrations · Automation</span>
    <h1 class="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl">
      <span class="bg-gradient-to-r from-violet-400 via-cyan-300 to-pink-400 bg-clip-text text-transparent">Milan Topuzov</span>
      <br class="hidden sm:block"/>
      builds better Odoo experiences
    </h1>
    <p class="max-w-prose text-lg text-slate-300">Full‑stack Odoo developer — backend modules, OWL/QWeb UIs, integrations and DevOps. I design flows that match your business and keep them maintainable.</p>
    <div class="flex flex-wrap gap-3 pt-2">
      <a href="{{ "/work/" | relative_url }}" class="inline-flex h-10 items-center justify-center rounded-md bg-white/10 px-5 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-white/20 hover:bg-white/20">See my work</a>
      <a href="{{ "/blog/" | relative_url }}" class="inline-flex h-10 items-center justify-center rounded-md bg-transparent px-5 text-sm font-semibold text-slate-200 ring-1 ring-inset ring-white/15 hover:bg-white/10">Blog</a>
      <a href="{{ "/contact/" | relative_url }}" class="inline-flex h-10 items-center justify-center rounded-md bg-cyan-500/90 px-5 text-sm font-semibold text-black hover:bg-cyan-400">Contact</a>
    </div>
  </div>
  <div class="order-last md:order-none">
    <img class="mx-auto w-full max-w-md rounded-full" alt="Milan Topuzov"
      src="{{ "/assets/images/milan-512.webp" | relative_url }}"
      srcset="{{ "/assets/images/milan-256.webp" | relative_url }} 256w, {{ "/assets/images/milan-512.webp" | relative_url }} 512w, {{ "/assets/images/milan-1024.webp" | relative_url }} 1024w"
      sizes="(max-width: 900px) 90vw, 480px">
  </div>
</section>

<section class="mt-14 grid grid-cols-1 md:grid-cols-2 items-start gap-x-12 gap-y-10">
  <div class="space-y-2">
    <h2 class="text-xl font-semibold text-white">What I do</h2>
    <p class="text-slate-300">Design and build Odoo modules and flows (Sales/CRM/Inventory/Accounting/e‑Commerce); automate approvals and reporting; integrate third‑party systems; polish UX.</p>
  </div>
  <!-- Mobile-only separator above "How I work" -->
  <div class="block md:hidden h-px w-full bg-white/10"></div>
  <div class="space-y-2">
    <h2 class="text-xl font-semibold text-white">How I work</h2>
    <p class="text-slate-300">Discover, blueprint, then implement: ORM models, QWeb/OWL UI and server actions. Ship to staging from Git with migrations/tests, then document and hand off.</p>
  </div>
  <div class="space-y-2 border-t border-white/10 pt-6 mt-2 md:mt-0 md:pt-6 md:border-t">
    <h2 class="text-xl font-semibold text-white">Stack</h2>
    <p class="text-slate-300">Odoo, PostgreSQL, OWL/QWeb, XML; RPC/REST + OCA; Docker/Odoo.sh (Nginx/Traefik); GitHub Actions CI, backups, monitoring.</p>
  </div>
  <div class="space-y-2 border-t border-white/10 pt-6 mt-2 md:mt-0 md:pt-6 md:border-t">
    <h2 class="text-xl font-semibold text-white">Availability</h2>
    <p class="text-slate-300">Open for Odoo: deployments, modules, integrations (payments/shipping/BI), upgrades and performance tuning. Based in Skopje (CET). <a class="underline decoration-dotted hover:text-slate-200" href="{{ '/contact/' | relative_url }}">Contact</a>.</p>
  </div>
</section>

<!-- Experience cards (reverse‑chronological) -->
<section class="mt-16">
  <h2 class="text-2xl font-bold text-white">Experience</h2>
  <div class="mt-6 space-y-4">
    <!-- WeSolved · Senior Odoo Developer (2025) -->
    <article class="rounded-xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/[.07]">
      <div class="flex items-start gap-4">
        <img class="h-10 w-10 rounded-md object-contain bg-white/5 p-1 ring-1 ring-white/10" src="{{ '/assets/images/wesolved.jpg' | relative_url }}" alt="WeSolved logo">
        <div class="flex-1">
          <div class="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-4">
            <h3 class="font-semibold text-white">Senior Odoo Developer <span class="font-normal text-slate-400">@ WeSolved</span></h3>
            <div class="text-sm text-slate-400 mt-1 md:mt-0 md:shrink-0 md:text-right">Feb 2025 – Sep 2025 · 8 mos</div>
          </div>
          <ul class="mt-2 list-disc pl-5 text-slate-300">
            <li>Delivered accounting customizations for a multinational manufacturer, aligning reporting, and multi-company development.</li>
            <li>Led the Odoo POS stream, redesigning UX and hardening beta 18.2 builds on the way to the Odoo 19 release.</li>
            <li>Extended POS integrations with Mews Hotel System, Piggy coupons, and Glory cash machines for tightly synced front-of-house ops.</li>
          </ul>
        </div>
      </div>
    </article>

    <!-- Upwork · Odoo Developer (2022–2024) -->
    <article class="rounded-xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/[.07]">
      <div class="flex items-start gap-4">
        <img class="h-10 w-10 rounded-md object-contain bg-white/5 p-1 ring-1 ring-white/10" src="{{ '/assets/images/upwork.png' | relative_url }}" alt="Upwork logo">
        <div class="flex-1">
          <div class="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-4">
            <h3 class="font-semibold text-white">Odoo Developer <span class="font-normal text-slate-400">@ Upwork.com</span></h3>
            <div class="text-sm text-slate-400 mt-1 md:mt-0 md:shrink-0 md:text-right">Sep 2022 – Sep 2024 · 2 yrs 1 mo</div>
          </div>
          <ul class="mt-2 list-disc pl-5 text-slate-300">
            <li>Architected and implemented advanced CRM solutions by integrating a LangChain‑based AI system with Odoo, replacing native GPT integration.</li>
            <li>Built AI‑driven workflows for customer analysis and automated responses, cutting manual CRM tasks by ~40%.</li>
            <li>Engineered LinkedIn scraping + AI profile analysis with personalized email generation to improve B2B outreach.</li>
          </ul>
        </div>
      </div>
    </article>

    <!-- Simplify‑ERP · Odoo Developer (2022) -->
    <article class="rounded-xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/[.07]">
      <div class="flex items-start gap-4">
        <img class="h-10 w-10 rounded-md object-contain bg-white/5 p-1 ring-1 ring-white/10" src="{{ '/assets/images/simplifyerp.jpeg' | relative_url }}" alt="Simplify‑ERP logo">
        <div class="flex-1">
          <div class="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-4">
            <h3 class="font-semibold text-white">Odoo Developer <span class="font-normal text-slate-400">@ Simplify‑ERP.com</span></h3>
            <div class="text-sm text-slate-400 mt-1 md:mt-0 md:shrink-0 md:text-right">Jan 2022 – May 2022 · 5 mos</div>
          </div>
          <ul class="mt-2 list-disc pl-5 text-slate-300">
            <li>Migrated a book‑printing company from Odoo v8 → v14 with custom module adaptation and data preservation.</li>
            <li>Extended open‑source migration scripts for legacy structures ensuring zero data loss.</li>
            <li>Built a bidirectional Shopify↔Odoo integration for inventory, orders, and customer sync.</li>
          </ul>
        </div>
      </div>
    </article>

    <!-- E‑commerce (Miko Solar) · Founder & Technical Lead (2019–2021) -->
    <article class="rounded-xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/[.07]">
      <div class="flex items-start gap-4">
        <img class="h-10 w-10 rounded-md object-contain bg-white/5 p-1 ring-1 ring-white/10" src="{{ '/assets/images/mikosolar.png' | relative_url }}" alt="Miko Solar logo">
        <div class="flex-1">
          <div class="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-4">
            <h3 class="font-semibold text-white">Founder &amp; Technical Lead <span class="font-normal text-slate-400">@ E‑commerce business</span></h3>
            <div class="text-sm text-slate-400 mt-1 md:mt-0 md:shrink-0 md:text-right">Sep 2019 – Sep 2021 · 2 yrs 1 mo</div>
          </div>
          <ul class="mt-2 list-disc pl-5 text-slate-300">
            <li>Designed and operated multi‑site e‑commerce infrastructure on WordPress/WooCommerce.</li>
            <li>Achieved 99% uptime and sub‑2s loads via caching and performance optimization.</li>
            <li>Ran end‑to‑end ops: supplier management, marketing strategy, and ads optimization.</li>
          </ul>
        </div>
      </div>
    </article>

    <!-- SerpWatch · Technical Lead (2018–2019) -->
    <article class="rounded-xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/[.07]">
      <div class="flex items-start gap-4">
        <img class="h-10 w-10 rounded-md object-contain bg-white/5 p-1 ring-1 ring-white/10" src="{{ '/assets/images/serpwatch.png' | relative_url }}" alt="SerpWatch logo">
        <div class="flex-1">
          <div class="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-4">
            <h3 class="font-semibold text-white">Technical Lead <span class="font-normal text-slate-400">@ Serpwatch.io</span></h3>
            <div class="text-sm text-slate-400 mt-1 md:mt-0 md:shrink-0 md:text-right">Aug 2018 – Sep 2019 · 1 yr 2 mos</div>
          </div>
          <ul class="mt-2 list-disc pl-5 text-slate-300">
            <li>Led development of a real‑time SERP monitoring platform on GCP + Vue.js.</li>
            <li>Pioneered early Firestore architecture with Cloud Functions for elastic scalability.</li>
            <li>Owned cloud infra and product strategy with automated scaling.</li>
          </ul>
        </div>
      </div>
    </article>

    <!-- Upwork · Scrapy Developer (2017–2018) -->
    <article class="rounded-xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/[.07]">
      <div class="flex items-start gap-4">
        <img class="h-10 w-10 rounded-md object-contain bg-white/5 p-1 ring-1 ring-white/10" src="{{ '/assets/images/upwork.png' | relative_url }}" alt="Upwork logo">
        <div class="flex-1">
          <div class="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-4">
            <h3 class="font-semibold text-white">Scrapy Developer <span class="font-normal text-slate-400">@ Upwork.com</span></h3>
            <div class="text-sm text-slate-400 mt-1 md:mt-0 md:shrink-0 md:text-right">Dec 2017 – Aug 2018 · 9 mos</div>
          </div>
          <ul class="mt-2 list-disc pl-5 text-slate-300">
            <li>Architected distributed crawling infrastructure processing hundreds of thousands of pages daily.</li>
            <li>Built AI‑powered form detection for web automation, reducing manual mapping by ~80%.</li>
            <li>Deployed proxy rotation, rate‑limiting and robust data pipelines at scale.</li>
          </ul>
        </div>
      </div>
    </article>

    <!-- Skilled.co · Python Developer (2017–2018) -->
    <article class="rounded-xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/[.07]">
      <div class="flex items-start gap-4">
        <img class="h-10 w-10 rounded-md object-contain bg-white/5 p-1 ring-1 ring-white/10" src="{{ '/assets/images/skilled.png' | relative_url }}" alt="Skilled.co logo">
        <div class="flex-1">
          <div class="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-4">
            <h3 class="font-semibold text-white">Python Developer <span class="font-normal text-slate-400">@ Skilled.co</span></h3>
            <div class="text-sm text-slate-400 mt-1 md:mt-0 md:shrink-0 md:text-right">Mar 2017 – Jan 2018 · 11 mos</div>
          </div>
          <ul class="mt-2 list-disc pl-5 text-slate-300">
            <li>Automated enrichment of company data with LinkedIn and other sources.</li>
            <li>Built crawlers for Alexa Top 1M to compute SEO metrics and performance.</li>
            <li>Exposed enriched data via a REST API for the interactive frontend.</li>
          </ul>
        </div>
      </div>
    </article>

    <!-- CosmicDevelopment · Django Developer (2016–2017) -->
    <article class="rounded-xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/[.07]">
      <div class="flex items-start gap-4">
        <img class="h-10 w-10 rounded-md object-contain bg-white/5 p-1 ring-1 ring-white/10" src="{{ '/assets/images/cosmicdevelopment.jpeg' | relative_url }}" alt="CosmicDevelopment.com logo">
        <div class="flex-1">
          <div class="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-4">
            <h3 class="font-semibold text-white">Django Developer <span class="font-normal text-slate-400">@ CosmicDevelopment.com</span></h3>
            <div class="text-sm text-slate-400 mt-1 md:mt-0 md:shrink-0 md:text-right">Sep 2016 – Feb 2017 · 6 mos</div>
          </div>
          <ul class="mt-2 list-disc pl-5 text-slate-300">
            <li>Enhanced features for a webcam streaming platform, improving UX and functionality.</li>
            <li>Delivered robust Django backend solutions focused on scalability and performance.</li>
            <li>Collaborated across teams to optimize codebase and integrate APIs effectively.</li>
          </ul>
        </div>
      </div>
    </article>

    <!-- PlacePixel · Python Developer (2016–2017) -->
    <article class="rounded-xl border border-white/10 bg-white/5 p-5 transition hover:bg-white/[.07]">
      <div class="flex items-start gap-4">
        <img class="h-10 w-10 rounded-md object-contain bg-white/5 p-1 ring-1 ring-white/10" src="{{ '/assets/images/placepixel.jpeg' | relative_url }}" alt="PlacePixel.com logo">
        <div class="flex-1">
          <div class="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1 md:gap-4">
            <h3 class="font-semibold text-white">Python Developer <span class="font-normal text-slate-400">@ PlacePixel.com</span></h3>
            <div class="text-sm text-slate-400 mt-1 md:mt-0 md:shrink-0 md:text-right">Jun 2016 – Mar 2017 · 10 mos</div>
          </div>
          <ul class="mt-2 list-disc pl-5 text-slate-300">
            <li>Built high‑performance scrapers for global event aggregation with smart retry and rate‑limits.</li>
            <li>Designed a processing pipeline for deduplicated, standardized data ready for map plotting.</li>
            <li>Adopted Docker early for reproducible, scalable deployments on AWS.</li>
          </ul>
        </div>
      </div>
    </article>
  </div>
</section>

<!-- Skills -->
<section class="mt-16">
  <h2 class="text-2xl font-bold text-white">Relevant skills</h2>
  <div class="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <div class="rounded-xl border border-white/10 bg-white/5 p-5">
      <h3 class="font-semibold text-white">Languages</h3>
      <div class="mt-2 flex flex-wrap gap-2 text-sm">
        <span class="rounded-md bg-white/10 px-2 py-1 text-slate-200">Python (10y)</span>
        <span class="rounded-md bg-white/10 px-2 py-1 text-slate-200">JavaScript</span>
        <span class="rounded-md bg-white/10 px-2 py-1 text-slate-200">PHP</span>
        <span class="rounded-md bg-white/10 px-2 py-1 text-slate-200">Lua</span>
      </div>
    </div>
    <div class="rounded-xl border border-white/10 bg-white/5 p-5">
      <h3 class="font-semibold text-white">Frameworks</h3>
      <div class="mt-2 flex flex-wrap gap-2 text-sm">
        <span class="rounded-md bg-white/10 px-2 py-1 text-slate-200">Django</span>
        <span class="rounded-md bg-white/10 px-2 py-1 text-slate-200">LangChain</span>
        <span class="rounded-md bg-white/10 px-2 py-1 text-slate-200">Scrapy</span>
        <span class="rounded-md bg-white/10 px-2 py-1 text-slate-200">Vue.js</span>
        <span class="rounded-md bg-white/10 px-2 py-1 text-slate-200">Odoo</span>
      </div>
    </div>
    <div class="rounded-xl border border-white/10 bg-white/5 p-5">
      <h3 class="font-semibold text-white">Cloud &amp; DevOps</h3>
      <div class="mt-2 flex flex-wrap gap-2 text-sm">
        <span class="rounded-md bg-white/10 px-2 py-1 text-slate-200">GCP</span>
        <span class="rounded-md bg-white/10 px-2 py-1 text-slate-200">AWS</span>
        <span class="rounded-md bg-white/10 px-2 py-1 text-slate-200">Docker</span>
        <span class="rounded-md bg-white/10 px-2 py-1 text-slate-200">Terraform</span>
      </div>
    </div>
    <div class="rounded-xl border border-white/10 bg-white/5 p-5">
      <h3 class="font-semibold text-white">Data &amp; AI</h3>
      <div class="mt-2 flex flex-wrap gap-2 text-sm">
        <span class="rounded-md bg-white/10 px-2 py-1 text-slate-200">Web Crawling</span>
        <span class="rounded-md bg-white/10 px-2 py-1 text-slate-200">Pipelines</span>
        <span class="rounded-md bg-white/10 px-2 py-1 text-slate-200">AI Integration</span>
        <span class="rounded-md bg-white/10 px-2 py-1 text-slate-200">LLMs</span>
      </div>
    </div>
    <div class="rounded-xl border border-white/10 bg-white/5 p-5">
      <h3 class="font-semibold text-white">Databases</h3>
      <div class="mt-2 flex flex-wrap gap-2 text-sm">
        <span class="rounded-md bg-white/10 px-2 py-1 text-slate-200">Firestore</span>
        <span class="rounded-md bg-white/10 px-2 py-1 text-slate-200">ElasticSearch</span>
        <span class="rounded-md bg-white/10 px-2 py-1 text-slate-200">SQL/NoSQL</span>
      </div>
    </div>
  </div>
</section>
