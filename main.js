/* ═══════════════════════════════════════
   FRONTERA STUDIO
   fronterawebdesign.com
   © 2026 Frontera Web LLC — El Paso, TX
═══════════════════════════════════════ */

(function () {
  'use strict';

  /* ── UTILITY ─────────────────────────────── */
  function eid(id) { return document.getElementById(id); }
  function goTo(id) {
    var el = eid(id);
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }
  }

  /* ── PRELOADER ───────────────────────────────
     Strategy: JS drives the counter + dismissal.
     CSS animation on .pre-fill is purely visual.
     Hard timeout at 2.5s guarantees dismissal even
     if setInterval is throttled (background tab, etc.)
  ─────────────────────────────────────────────── */
  function initPreloader() {
    var pre = eid('preloader');
    var pct = eid('prePct');
    if (!pre) { return; }

    function dismiss() {
      pre.classList.add('done');
      // Re-enable scroll (was locked in HTML via inline style)
      document.body.style.overflow = '';
      document.documentElement.style.overflow = '';
    }

    // Hard deadline — always fires
    var deadline = setTimeout(dismiss, 2500);

    var progress = 0;
    var tick = setInterval(function () {
      progress += Math.random() * 14 + 6;
      if (progress >= 100) { progress = 100; }
      if (pct) { pct.textContent = Math.round(progress) + '%'; }
      if (progress >= 100) {
        clearInterval(tick);
        clearTimeout(deadline);
        setTimeout(dismiss, 200);
      }
    }, 55);
  }

  /* ── CUSTOM CURSOR ───────────────────────── */
  function initCursor() {
    var dot  = eid('cur');
    var ring = eid('cur-ring');
    if (!dot || !ring) { return; }

    var mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', function (e) {
      mx = e.clientX;
      my = e.clientY;
      dot.style.left = mx + 'px';
      dot.style.top  = my + 'px';
    });

    function animRing() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      ring.style.left = rx + 'px';
      ring.style.top  = ry + 'px';
      requestAnimationFrame(animRing);
    }
    animRing();
  }

  /* ── HERO PARTICLES CANVAS ───────────────── */
  function initCanvas() {
    var canvas = eid('heroCanvas');
    if (!canvas) { return; }

    var ctx = canvas.getContext('2d');
    var pts = [];

    function resize() {
      var hero = canvas.parentElement;
      canvas.width  = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
      pts = [];
      for (var i = 0; i < 55; i++) {
        pts.push({
          x:  Math.random() * canvas.width,
          y:  Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.3,
          vy: (Math.random() - 0.5) * 0.3,
          r:  Math.random() * 1.5 + 0.5
        });
      }
    }

    function draw() {
      if (!canvas.width || !canvas.height) { requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var i, j, p, d;
      for (i = 0; i < pts.length; i++) {
        p = pts[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width)  { p.vx *= -1; }
        if (p.y < 0 || p.y > canvas.height) { p.vy *= -1; }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(200,255,0,.45)';
        ctx.fill();
      }
      for (i = 0; i < pts.length; i++) {
        for (j = i + 1; j < pts.length; j++) {
          d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < 110) {
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.strokeStyle = 'rgba(200,255,0,' + (0.13 * (1 - d / 110)).toFixed(3) + ')';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }

    resize();
    draw();
    window.addEventListener('resize', resize, { passive: true });
  }

  /* ── NAVBAR ──────────────────────────────── */
  function initNavbar() {
    var nav    = eid('navbar');
    var topBtn = eid('top-btn');
    if (!nav) { return; }

    function onScroll() {
      var y = window.scrollY;
      nav.classList.toggle('scrolled', y > 60);
      if (topBtn) { topBtn.classList.toggle('show', y > 400); }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // Top button
    if (topBtn) {
      topBtn.addEventListener('click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }

    // Nav CTA
    var navCta = document.querySelector('.nav-cta-btn');
    if (navCta) {
      navCta.addEventListener('click', function () { goTo('cta'); });
    }

    // Logo click scrolls to top
    var navLogo = document.querySelector('.nav-logo');
    if (navLogo) {
      navLogo.addEventListener('click', function (e) {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }

  /* ── MOBILE MENU ─────────────────────────── */
  function initMobileMenu() {
    var menu = eid('mob-menu');
    var btn  = eid('hamBtn');
    if (!menu || !btn) { return; }

    var isOpen = false;

    function toggle(state) {
      isOpen = state;
      menu.classList.toggle('open', isOpen);
      btn.classList.toggle('open', isOpen);
      btn.setAttribute('aria-expanded', String(isOpen));
      document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    btn.addEventListener('click', function () { toggle(!isOpen); });

    document.addEventListener('click', function (e) {
      if (isOpen && !menu.contains(e.target) && !btn.contains(e.target)) {
        toggle(false);
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isOpen) { toggle(false); }
    });

    // Expose for inline onclick on mob-links
    window.closeMob = function () { toggle(false); };

    // Close menu when any mob-link is clicked (belt-and-suspenders with onclick)
    menu.querySelectorAll('.mob-link').forEach(function (link) {
      link.addEventListener('click', function () { toggle(false); });
    });

    // Mobile CTA inside menu
    var mobCta = menu.querySelector('.mob-cta');
    if (mobCta) {
      mobCta.addEventListener('click', function () {
        toggle(false);
        goTo('cta');
      });
    }
  }

  /* ── AUDIT BAR ───────────────────────────── */
  function initAuditBar() {
    var bar = eid('audit-bar');
    if (!bar) { return; }

    setTimeout(function () { bar.classList.add('show'); }, 5000);

    var closeBtn = eid('audit-bar-x');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        bar.style.transform = 'translateY(100%)';
        setTimeout(function () {
          if (bar.parentNode) { bar.parentNode.removeChild(bar); }
        }, 400);
      });
    }

    var auditLink = eid('auditBarLink');
    if (auditLink) {
      auditLink.addEventListener('click', function (e) {
        e.preventDefault();
        goTo('cta');
      });
    }
  }

  /* ── LANG BUTTON ─────────────────────────── */
  /* ── i18n TRANSLATIONS ───────────────────── */
  var T = {
    en: {
      /* audit bar */
      'audit-text': 'Free website audit \u2014 see exactly why competitors outrank you in El Paso.',
      'audit-cta':  'Claim Free Audit \u2192',
      /* mobile menu */
      'mob-services': 'Services', 'mob-work': 'Our Work', 'mob-pricing': 'Pricing',
      'mob-process': 'Process', 'mob-results': 'Results', 'mob-faq': 'FAQ',
      'mob-cta': 'Get Free Audit \u2192',
      /* navbar */
      'nav-services': 'Services', 'nav-work': 'Work', 'nav-pricing': 'Pricing',
      'nav-process': 'Process', 'nav-faq': 'FAQ', 'nav-cta': 'Free Audit',
      /* hero */
      'hero-loc':   'Serving El Paso \u00b7 West Texas \u00b7 Ju\u00e1rez',
      'hero-l1':    'Websites that',
      'hero-l2':    'rank #1',
      'hero-l3':    '&amp; <span class="outline-lime">convert.</span>',
      'hero-sub':   'El Paso\u2019s only agency combining <strong>award-winning design</strong>, <strong>Google-dominating SEO</strong>, and <strong>conversion architecture</strong>. We don\u2019t build websites \u2014 we build <strong>client-generating machines.</strong>',
      'hero-lbl1':  'Projects delivered', 'hero-lbl2': 'Rankings earned',
      'hero-lbl3':  'Avg lead increase',  'hero-lbl4': 'Live site launch',
      'hero-btn1':  'Get Free Audit', 'hero-btn2': 'View Our Work',
      'hero-scroll':'Scroll',
      'trust-lbl':  'Trusted by',
      /* stats band */
      'stat-lbl1': 'Websites launched for El Paso businesses',
      'stat-lbl2': 'Client retention rate \u2014 results keep them coming back',
      'stat-lbl3': 'Google ranking achieved for 40+ El Paso keywords',
      'stat-lbl4': 'Average organic traffic increase in 6 months',
      /* services */
      'svc-kicker': 'What we do',
      'svc-title':  'Full-stack digital growth <span class="lime">for El Paso.</span>',
      'svc-desc':   'Every service engineered to generate measurable business results \u2014 not vanity metrics.',
      'svc1-name':  'Web Design<br>\u0026 Development',
      'svc1-desc':  'Custom-built, pixel-perfect websites loading in under 2 seconds with 95+ PageSpeed scores. Every design decision backed by CRO data and conversion psychology.',
      'svc1-res':   'Avg result: <strong>+87% more leads</strong> vs. old site in 90 days',
      'svc2-name':  'SEO \u0026<br>Google Rankings',
      'svc2-desc':  'Rank at the top of Google when El Paso customers search for your services. Technical foundation, content clusters, local citations, and authority backlinks that compound over time.',
      'svc2-res':   'Avg result: <strong>Page 1 rankings</strong> within 3\u20135 months',
      'svc3-name':  'Google Ads \u0026<br>Paid Media',
      'svc3-desc':  'Data-driven paid campaigns generating leads while your SEO builds. Proper keyword sculpting, negative keywords, bid strategies, and A/B tested ad copy. Zero wasted budget.',
      'svc3-res':   'Avg result: <strong>3.2\u00d7 ROAS</strong> within 60 days of launch',
      'svc4-name':  'Branding \u0026<br>Visual Identity',
      'svc4-desc':  'Strategic brand identities commanding premium pricing and instant recognition in the El Paso\u2013Ju\u00e1rez market. Logo, visual systems, brand voice, and positioning.',
      'svc4-res':   'Clients report <strong>faster sales cycles</strong> and higher price acceptance',
      'svc5-name':  'Social Media \u0026<br>Content Marketing',
      'svc5-desc':  'Consistent, high-quality content building authority and community. Strategy, creation, scheduling, and analytics \u2014 completely done for you. Focused on platforms that drive revenue.',
      'svc5-res':   'Avg result: <strong>+220% engagement</strong> in 90 days',
      'svc6-name':  'E-Commerce \u0026<br>Online Sales',
      'svc6-desc':  'Shopify and WooCommerce stores engineered for the El Paso\u2013Ju\u00e1rez border economy. Bilingual UX, cross-border shipping flows, local payment methods, and Google Shopping optimization.',
      'svc6-res':   'Avg result: <strong>+445% online revenue</strong> in 8 months',
      /* why us */
      'why-kicker': 'Why Frontera Web',
      'why-title':  'Results, not<br>just <span class="lime">promises.</span>',
      'why-desc':   'Not another generic digital agency. We\u2019re a specialized team born in El Paso \u2014 we know your market, your bilingual customers, and what it takes to win here.',
      'perk1-t': 'El Paso-native strategy',
      'perk1-d': 'We know the border economy, bilingual customer base, Fort Bliss cycles, and UTEP talent pipeline. Generic agencies simply don\u2019t.',
      'perk2-t': 'SEO baked in from day one',
      'perk2-d': 'Core Web Vitals, semantic HTML, schema markup, and content architecture \u2014 optimized from the start, not bolted on later.',
      'perk3-t': 'Transparent reporting',
      'perk3-d': 'Monthly dashboards: traffic, rankings, leads, and revenue attribution. You always know exactly what your investment generates.',
      'perk4-t': '48-hour proposals',
      'perk4-d': 'We review your business, competitors, and market \u2014 then deliver a detailed custom proposal in 2 business days. No vague quotes after 3 weeks.',
      'perk5-t': 'Truly bilingual',
      'perk5-d': 'English and Spanish \u2014 natively, not via translation tools. Native content for the full El Paso\u2013Ju\u00e1rez borderland market.',
      'why-btn': 'Start Your Project',
      'wcard1-t': 'Conversion-first design',
      'wcard1-d': 'Every pixel placed to move visitors toward becoming clients. We design for revenue, not awards.',
      'wcard1-m': '+87%<small> avg lead increase</small>',
      'wcard2-t': 'Performance obsessed',
      'wcard2-d': 'LCP &lt; 2s. INP &lt; 150ms. CLS near 0. Core Web Vitals are a Google ranking factor \u2014 we treat them as such.',
      'wcard2-m': '95+<small> PageSpeed score</small>',
      'wcard3-t': 'Data over guesswork',
      'wcard3-d': 'Decisions driven by GA4, Hotjar heatmaps, GSC, and A/B test data. We track and optimize continuously.',
      'wcard3-m': '100%<small> tracked &amp; reported</small>',
      'wcard4-t': 'Border market specialists',
      'wcard4-d': 'El Paso\u2013Ju\u00e1rez: 2.7M people, two countries, one economy. Few agencies truly understand how to serve both sides.',
      'wcard4-m': '2.7M<small> accessible market</small>',
      /* cases */
      'cases-kicker': 'Real results',
      'cases-title':  'Projects that<br><span class="lime">move</span> markets.',
      'cases-desc':   'Every case study has measurable business impact. No design without results.',
      'case1-name': 'Sun City Realty \u2014 Page 4 to #1 in 5 Months',
      'case1-text': 'Full redesign and SEO overhaul. The old site was slow, mobile-broken, and invisible on Google. New architecture, local content clusters for every El Paso neighborhood, and Google Business Profile optimization drove market domination.',
      'kpi-traffic': 'Organic traffic increase', 'kpi-leads': 'Leads per month',
      'kpi-appts': 'New appointments', 'kpi-maps': 'Maps visibility',
      'kpi-revenue': 'Online revenue',
      'case2-name': 'Border Medical Group \u2014 4 Locations Dominating Local Search',
      'case2-text': 'Bilingual multi-location SEO across 4 El Paso clinics. Patient-focused UX and Google Maps optimization drove explosive growth.',
      'case3-name': 'Mountainstar Foods \u2014 $0 to $2.1M Online',
      'case3-text': 'Bilingual Shopify store, Google Shopping campaigns, and SEO content strategy. Border region food brand expanded online.',
      'cases-btn': 'Start Your Own Success Story \u2192',
      /* process */
      'proc-kicker': 'How we work',
      'proc-title':  'Live in<br><span class="lime">2 weeks.</span>',
      'proc-desc':   'From first conversation to live website in under 2 weeks. No 2-month waits \u2014 just fast, professional execution.',
      'proc1-t': 'Discovery &amp; Strategy',
      'proc1-d': 'Day 1: full business audit, competitor research, keyword architecture, and SEO blueprint tailored to El Paso market.',
      'proc1-dur': 'Day 1\u20132',
      'proc2-t': 'Design &amp; Wireframes',
      'proc2-d': 'Complete UI/UX design with mobile-first wireframes and your full approval before a single line of code is written.',
      'proc2-dur': 'Day 3\u20135',
      'proc3-t': 'Development',
      'proc3-d': 'Fast, clean code with Core Web Vitals optimized from day one. Schema markup, CMS, and tracking all built in.',
      'proc3-dur': 'Day 6\u20139',
      'proc4-t': 'QA &amp; Revisions',
      'proc4-d': 'Full cross-browser and mobile testing. One round of revisions included. Nothing goes live until you approve it.',
      'proc4-dur': 'Day 10\u201311',
      'proc5-t': 'Launch',
      'proc5-d': 'Public launch with GA4, Google Search Console, and Hotjar conversion tracking live from minute one. Zero downtime.',
      'proc5-dur': 'Day 12\u201313',
      'proc6-t': 'Grow &amp; Scale',
      'proc6-d': 'Handoff, CMS training, and optional monthly retainer for SEO content, reporting, and continuous improvement.',
      'proc6-dur': 'Day 14 + Ongoing',
      /* pricing */
      'price-kicker': 'Transparent pricing',
      'price-title':  'Simple, honest<br><span class="lime">pricing.</span>',
      'price-desc':   'No hidden fees. No bait-and-switch. Every plan includes a free 30-min strategy call before you commit. Monthly retainers start at <strong style="color:var(--lime)">$199/mo</strong> \u2014 the most competitive rates in El Paso.',
      'tog-one': 'One-time project',
      'tog-mo':  'Monthly retainer <span style="color:var(--lime);font-size:12px">from $199/mo</span>',
      'price-save': 'Best value \u2014 save 20%',
      'price-pop': 'Most Popular',
      'price1-desc': 'Perfect for El Paso small businesses ready to go professional online. A real custom website that converts \u2014 at a price built for the local market.',
      'price2-desc': 'For El Paso businesses ready to rank #1 on Google and generate consistent qualified leads month after month.',
      'price3-desc': 'For companies ready to own their entire market \u2014 e-commerce, multi-location SEO, and full-service retainers.',
      'pf1-1': 'Custom 5-page website', 'pf1-2': 'Mobile-first responsive design',
      'pf1-3': 'On-page SEO setup', 'pf1-4': 'Google Analytics 4 + Search Console',
      'pf1-5': 'Contact form + email notifications', 'pf1-6': 'Google Business Profile optimization',
      'pf1-7': '30-day post-launch support', 'pf1-8': 'Monthly SEO content', 'pf1-9': 'Google Ads management',
      'pf2-1': 'Custom 10-page website + blog', 'pf2-2': 'Advanced CRO architecture',
      'pf2-3': 'Full technical SEO', 'pf2-4': 'Schema markup implementation',
      'pf2-5': '3 months SEO content included', 'pf2-6': 'Google Ads setup (first month)',
      'pf2-7': 'Monthly performance reporting', 'pf2-8': 'Bilingual (EN + ES) option',
      'pf2-9': '90-day post-launch support',
      'pf3-1': 'Unlimited pages + e-commerce', 'pf3-2': 'Full SEO authority campaign',
      'pf3-3': 'Multi-location local SEO', 'pf3-4': 'Ongoing Google Ads management',
      'pf3-5': 'Monthly SEO content production', 'pf3-6': 'Social media management',
      'pf3-7': 'Dedicated account manager', 'pf3-8': 'Priority 24h support',
      'pf3-9': 'Quarterly strategy reviews',
      'price-btn1': 'Start with Launch \u2192', 'price-btn2': 'Start with Scale \u2192', 'price-btn3': 'Get Custom Quote \u2192',
      'price-note1': 'Free strategy call \u00b7 No contracts',
      'price-note2': 'Free strategy call \u00b7 No contracts',
      'price-note3': 'Free strategy call \u00b7 Flexible terms',
      /* testimonials */
      'testi-kicker': 'Client results',
      'testi-title':  'Heard from<br>El Paso<span class="lime">.</span>',
      'testi-total':  '4.9 / 5.0 \u00b7 87 Google Reviews',
      'testi1-text':  '\u201cFrontera completely changed the trajectory of our business. We went from getting 2\u20133 online leads a week to 15\u201320. They actually understand SEO \u2014 not just design \u2014 and the results speak for themselves.\u201d',
      'testi1-res':   '<strong>+312% organic traffic</strong> in 5 months',
      'testi1-role':  'Owner, Sun City Realty',
      'testi2-text':  '\u201cWe had tried 2 other agencies before Frontera. The difference is night and day \u2014 they report on real metrics, respond fast, and our Google Maps visibility went from invisible to top 3 in 3 months.\u201d',
      'testi2-res':   '<strong>+218% new patient appointments</strong> \u2014 Google Maps: invisible \u2192 Top 3',
      'testi2-role':  'Medical Director, Border Medical Group',
      'testi3-text':  '\u201cThe bilingual capability was the dealbreaker for us. Spanish-language SEO alone added 35% more traffic from customers we were completely missing. Our Shopify store went from $0 to over $2M online.\u201d',
      'testi3-res':   '<strong>+445% online revenue</strong> \u2014 $0 \u2192 $2.1M in 8 months',
      'testi3-role':  'CEO, Mountainstar Foods',
      /* faq */
      'faq-kicker': 'FAQ',
      'faq-title':  'Common<br><span class="lime">questions.</span>',
      'faq-desc':   'Everything El Paso business owners ask before working with us.',
      'faq-phone':  'Phone: <a href="tel:+19152196739">915-219-6739</a>',
      'faq-email':  'Email: <a href="mailto:hello@fronterawebdesign.com">hello@fronterawebdesign.com</a>',
      'faq-btn':    'Get Free Audit \u2192',
      'faq1-q': 'How long does it take to build a new website?',
      'faq1-a': 'Most projects go live within <strong>2 weeks</strong> from kickoff. A 5-page site can launch in as few as 10 days; a full e-commerce store with bilingual content typically takes up to 3 weeks. We provide a precise timeline in every proposal and we have never missed a deadline.',
      'faq2-q': 'How long before I see results from SEO?',
      'faq2-a': 'For local El Paso searches, most clients see meaningful movement within <strong>60\u201390 days</strong>. Page 1 rankings for competitive terms typically take <strong>3\u20136 months</strong>. We track and report rankings from week 1 so you see progress every step.',
      'faq3-q': 'What makes you different from other El Paso agencies?',
      'faq3-a': '<strong>(1) We combine premium design with real SEO strategy</strong> \u2014 most agencies do one or the other. <strong>(2) We are genuinely bilingual</strong> \u2014 native EN/ES, not Google Translate. <strong>(3) We are obsessed with measurable results.</strong> Every project has clear KPIs and monthly accountability.',
      'faq4-q': 'Can you help with Google Maps and local SEO?',
      'faq4-a': 'Absolutely \u2014 one of our strongest services. Showing up in the Google Maps \u201c3-Pack\u201d can be transformative for El Paso businesses. We optimize your Google Business Profile, build local citations, create review strategies, and produce neighborhood-specific content.',
      'faq5-q': 'Do you offer monthly plans or just one-time projects?',
      'faq5-a': 'Both. Our Launch and Scale packages are one-time projects. We also offer <strong>monthly growth retainers</strong> starting at $199/mo including ongoing SEO content, backlink building, Google Ads management, and reporting. <strong>No long-term contracts required.</strong>',
      'faq6-q': 'Will I be able to update my own website?',
      'faq6-a': 'Yes \u2014 every website includes a CMS training session. You will update text, images, blog posts, and products without touching code. We also offer a <strong>managed maintenance plan</strong> where we handle all updates for you.',
      'faq7-q': 'What is included in the free website audit?',
      'faq7-a': '<strong>Technical SEO health check</strong> (Core Web Vitals, crawl errors, mobile), <strong>Google rankings analysis</strong> (current keywords and competitor gaps), <strong>Conversion review</strong> (why visitors leave without contacting you), and a <strong>competitor gap analysis</strong> for your top 3 El Paso competitors. Delivered within 48 hours. No commitment.',
      /* blog */
      'blog-kicker': 'Insights &amp; resources',
      'blog-title':  'Expert knowledge,<br><span class="lime">free.</span>',
      'blog-all':    'View All Articles \u2192',
      'blog1-cat': 'SEO', 'blog1-date': 'Mar 10, 2026',
      'blog1-title': 'How to Rank #1 on Google in El Paso: The Complete 2026 Playbook',
      'blog1-exc':   'Step-by-step guide to dominating local search in El Paso \u2014 from Google Business Profile to bilingual content strategy. Everything we have learned from 143 projects.',
      'blog1-read':  '12 min read',
      'blog2-cat': 'Pricing', 'blog2-date': 'Feb 20, 2026',
      'blog2-title': 'How Much Does a Website Cost in El Paso, TX? (2026 Honest Breakdown)',
      'blog2-exc':   'Real website pricing breakdown \u2014 from DIY to premium custom builds \u2014 so El Paso businesses can make an informed decision without being oversold.',
      'blog2-read':  '8 min read',
      'blog3-cat': 'Marketing', 'blog3-date': 'Jan 28, 2026',
      'blog3-title': 'Google Ads vs. SEO for El Paso Businesses: Which First?',
      'blog3-exc':   'The answer is not one-size-fits-all. We analyze 80+ El Paso businesses to show exactly when paid ads win and when organic SEO delivers better ROI.',
      'blog3-read':  '10 min read',
      'read-art':    'Read article \u2192',
      /* local */
      'local-kicker': 'Serving El Paso, TX',
      'local-title':  'El Paso\u2019s only agency combining<br><span style="color:var(--lime)">premium design</span> with <span style="color:var(--lime)">Google dominance.</span>',
      'local-sub':    'From Upper Valley to the Eastside, from UTEP to Fort Bliss \u2014 we help El Paso businesses rank #1 on Google and turn websites into automated client-generation systems.',
      /* cta / form */
      'cta-kicker': 'Let\u2019s work together',
      'cta-title':  'Ready to rank<br><span class="lime">#1 in El Paso?</span>',
      'cta-sub':    'Tell us about your project. We\u2019ll send a free website audit + custom proposal within 48 hours. Zero commitment, zero spam.',
      'ms-lbl1': 'Service', 'ms-lbl2': 'Budget', 'ms-lbl3': 'Contact',
      'step1-title': 'What do you need?',
      'step1-sub':   'Choose all that apply \u2014 we will tailor your free audit accordingly.',
      'opt1-name': 'New Website', 'opt1-sub': 'Design + Development',
      'opt2-name': 'SEO Rankings', 'opt2-sub': 'Rank #1 on Google',
      'opt3-name': 'Google Ads', 'opt3-sub': 'Paid traffic &amp; leads',
      'opt4-name': 'Branding', 'opt4-sub': 'Identity &amp; visual system',
      'opt5-name': 'Social Media', 'opt5-sub': 'Content &amp; management',
      'opt6-name': 'E-Commerce', 'opt6-sub': 'Online store',
      'continue': 'Continue \u2192', 'back': '\u2190 Back',
      'step1-of3': 'Step 1 of 3', 'step2-of3': 'Step 2 of 3', 'step3-of3': 'Step 3 of 3',
      'step2-title': 'What\u2019s your approximate budget?',
      'step2-sub':   'Helps us tailor the right recommendation. No question is too small or too large.',
      'bud5': 'Not sure yet',
      'url-lbl': 'Your current website URL (optional)',
      'url-ph': 'https://yoursite.com',
      'step3-title': 'Almost there!',
      'step3-sub':   'We will send your free audit + proposal within 48 hours.',
      'lbl-name': 'Your name *', 'ph-name': 'Maria Garcia',
      'lbl-co': 'Company', 'ph-co': 'Garcia Law El Paso',
      'lbl-em': 'Email address *', 'ph-em': 'maria@example.com',
      'lbl-ph': 'Phone (optional)', 'ph-ph': '915-555-0000',
      'lbl-msg': 'Tell us about your project',
      'ph-msg': 'We are a restaurant in East El Paso and need a website that shows up when people search best tacos El Paso\u2026',
      'submit-btn': 'Send Free Audit Request',
      'form-legal': 'Your information is 100% confidential. No spam. Unsubscribe anytime.',
      'success-title': 'We\u2019ve got your request!',
      'success-text':  'Your free audit is on its way. Expect a detailed report + custom proposal in your inbox within 48 hours.',
      'success-phone': 'Questions? Call <a href="tel:+19152196739">915-219-6739</a>',
      /* footer */
      'f-tag': 'El Paso\u2019s premium web design &amp; digital marketing agency. We build websites that rank on Google and convert visitors into paying customers.',
      'f-hours': 'Mon\u2013Fri 9am\u20136pm MT',
      'f-col1': 'Services', 'f-col2': 'Company', 'f-col3': 'Areas Served',
      'f-svc1': 'Web Design El Paso', 'f-svc2': 'SEO El Paso TX',
      'f-svc3': 'Google Ads Management', 'f-svc4': 'Branding &amp; Identity',
      'f-svc5': 'Social Media Marketing', 'f-svc6': 'E-Commerce Development', 'f-svc7': 'Local SEO El Paso',
      'f-co1': 'About Frontera', 'f-co2': 'Our Work', 'f-co3': 'Our Process',
      'f-co4': 'Pricing', 'f-co5': 'Client Results', 'f-co6': 'Blog &amp; Insights', 'f-co7': 'Contact Us',
      'f-copy': '\u00a9 2026 Frontera Web LLC \u2014 El Paso, Texas. All rights reserved.',
      'f-priv': 'Privacy Policy', 'f-terms': 'Terms of Service', 'f-sitemap': 'Sitemap', 'f-access': 'Accessibility'
    },
    es: {
      /* audit bar */
      'audit-text': 'Auditor\u00eda web gratis \u2014 descubre exactamente por qu\u00e9 tus competidores te superan en Google.',
      'audit-cta':  'Obt\u00e9n tu Auditor\u00eda \u2192',
      /* mobile menu */
      'mob-services': 'Servicios', 'mob-work': 'Proyectos', 'mob-pricing': 'Precios',
      'mob-process': 'Proceso', 'mob-results': 'Resultados', 'mob-faq': 'FAQ',
      'mob-cta': 'Obt\u00e9n Auditor\u00eda Gratis \u2192',
      /* navbar */
      'nav-services': 'Servicios', 'nav-work': 'Proyectos', 'nav-pricing': 'Precios',
      'nav-process': 'Proceso', 'nav-faq': 'FAQ', 'nav-cta': 'Auditor\u00eda Gratis',
      /* hero */
      'hero-loc':   'Sirviendo El Paso \u00b7 West Texas \u00b7 Ju\u00e1rez',
      'hero-l1':    'Sitios web que',
      'hero-l2':    'posicionan #1',
      'hero-l3':    'y <span class="outline-lime">convierten.</span>',
      'hero-sub':   'La \u00fanica agencia de El Paso que combina <strong>dise\u00f1o premiado</strong>, <strong>SEO que domina Google</strong> y <strong>arquitectura de conversi\u00f3n</strong>. No construimos sitios web \u2014 construimos <strong>m\u00e1quinas generadoras de clientes.</strong>',
      'hero-lbl1':  'Proyectos entregados', 'hero-lbl2': 'Rankings logrados',
      'hero-lbl3':  'Aumento prom. de leads', 'hero-lbl4': 'Lanzamiento en vivo',
      'hero-btn1':  'Obt\u00e9n Auditor\u00eda Gratis', 'hero-btn2': 'Ver Nuestros Proyectos',
      'hero-scroll':'Desplazar',
      'trust-lbl':  'Con la confianza de',
      /* stats band */
      'stat-lbl1': 'Sitios web lanzados para negocios de El Paso',
      'stat-lbl2': 'Tasa de retenci\u00f3n de clientes \u2014 los resultados los hacen volver',
      'stat-lbl3': 'Posici\u00f3n #1 en Google para m\u00e1s de 40 keywords de El Paso',
      'stat-lbl4': 'Aumento promedio de tr\u00e1fico org\u00e1nico en 6 meses',
      /* services */
      'svc-kicker': 'Lo que hacemos',
      'svc-title':  'Crecimiento digital completo <span class="lime">para El Paso.</span>',
      'svc-desc':   'Cada servicio dise\u00f1ado para generar resultados de negocio medibles \u2014 no m\u00e9tricas de vanidad.',
      'svc1-name':  'Dise\u00f1o y<br>Desarrollo Web',
      'svc1-desc':  'Sitios web a medida, pixel-perfect, que cargan en menos de 2 segundos con puntajes 95+ en PageSpeed. Cada decisi\u00f3n de dise\u00f1o respaldada por datos CRO y psicolog\u00eda de conversi\u00f3n.',
      'svc1-res':   'Resultado prom.: <strong>+87% m\u00e1s leads</strong> vs. sitio anterior en 90 d\u00edas',
      'svc2-name':  'SEO y<br>Posicionamiento Google',
      'svc2-desc':  'Aparece en lo m\u00e1s alto de Google cuando clientes de El Paso buscan tus servicios. Base t\u00e9cnica, clusters de contenido, citas locales y backlinks de autoridad que crecen con el tiempo.',
      'svc2-res':   'Resultado prom.: <strong>P\u00e1gina 1 de Google</strong> en 3\u20135 meses',
      'svc3-name':  'Google Ads y<br>Medios Pagados',
      'svc3-desc':  'Campa\u00f1as pagadas basadas en datos que generan leads mientras tu SEO crece. Estructura de keywords, negativos, estrategias de pujas y copias probadas con A/B. Cero presupuesto desperdiciado.',
      'svc3-res':   'Resultado prom.: <strong>3.2\u00d7 ROAS</strong> en los primeros 60 d\u00edas',
      'svc4-name':  'Branding e<br>Identidad Visual',
      'svc4-desc':  'Identidades de marca estrat\u00e9gicas que justifican precios premium y generan reconocimiento inmediato en el mercado El Paso\u2013Ju\u00e1rez. Logo, sistemas visuales, voz de marca y posicionamiento.',
      'svc4-res':   'Los clientes reportan <strong>ciclos de venta m\u00e1s cortos</strong> y mayor aceptaci\u00f3n de precios',
      'svc5-name':  'Redes Sociales y<br>Marketing de Contenido',
      'svc5-desc':  'Contenido consistente y de alta calidad que construye autoridad y comunidad. Estrategia, creaci\u00f3n, programaci\u00f3n y anal\u00edtica \u2014 todo hecho por nosotros. Enfocado en plataformas que generan ingresos.',
      'svc5-res':   'Resultado prom.: <strong>+220% engagement</strong> en 90 d\u00edas',
      'svc6-name':  'E-Commerce y<br>Ventas Online',
      'svc6-desc':  'Tiendas Shopify y WooCommerce dise\u00f1adas para la econom\u00eda fronteriza El Paso\u2013Ju\u00e1rez. UX biling\u00fce, flujos de env\u00edo transfronterizos, m\u00e9todos de pago locales y optimizaci\u00f3n de Google Shopping.',
      'svc6-res':   'Resultado prom.: <strong>+445% ingresos online</strong> en 8 meses',
      /* why us */
      'why-kicker': 'Por qu\u00e9 Frontera Web',
      'why-title':  'Resultados, no<br>solo <span class="lime">promesas.</span>',
      'why-desc':   'No somos otra agencia digital gen\u00e9rica. Somos un equipo especializado nacido en El Paso \u2014 conocemos tu mercado, tus clientes biling\u00fces y lo que se necesita para ganar aqu\u00ed.',
      'perk1-t': 'Estrategia nativa de El Paso',
      'perk1-d': 'Conocemos la econom\u00eda fronteriza, la base de clientes biling\u00fce, los ciclos de Fort Bliss y el talento de UTEP. Las agencias gen\u00e9ricas simplemente no.',
      'perk2-t': 'SEO integrado desde el primer d\u00eda',
      'perk2-d': 'Core Web Vitals, HTML sem\u00e1ntico, schema markup y arquitectura de contenido \u2014 optimizado desde el inicio, no como parche despu\u00e9s.',
      'perk3-t': 'Reportes transparentes',
      'perk3-d': 'Dashboards mensuales: tr\u00e1fico, rankings, leads y atribuci\u00f3n de ingresos. Siempre sabr\u00e1s exactamente lo que genera tu inversi\u00f3n.',
      'perk4-t': 'Propuestas en 48 horas',
      'perk4-d': 'Analizamos tu negocio, competidores y mercado \u2014 y entregamos una propuesta detallada en 2 d\u00edas h\u00e1biles. Sin cotizaciones vagas despu\u00e9s de 3 semanas.',
      'perk5-t': 'Verdaderamente biling\u00fce',
      'perk5-d': 'Ingl\u00e9s y espa\u00f1ol \u2014 de forma nativa, no con herramientas de traducci\u00f3n. Contenido nativo para todo el mercado fronterizo El Paso\u2013Ju\u00e1rez.',
      'why-btn': 'Inicia Tu Proyecto',
      'wcard1-t': 'Dise\u00f1o orientado a conversi\u00f3n',
      'wcard1-d': 'Cada p\u00edxel colocado para convertir visitantes en clientes. Dise\u00f1amos para generar ingresos, no para ganar premios.',
      'wcard1-m': '+87%<small> aumento prom. de leads</small>',
      'wcard2-t': 'Obsesionados con el rendimiento',
      'wcard2-d': 'LCP &lt; 2s. INP &lt; 150ms. CLS cercano a 0. Los Core Web Vitals son un factor de ranking en Google \u2014 los tratamos como tal.',
      'wcard2-m': '95+<small> en PageSpeed</small>',
      'wcard3-t': 'Datos sobre suposiciones',
      'wcard3-d': 'Decisiones basadas en GA4, mapas de calor de Hotjar, GSC y datos de pruebas A/B. Rastreamos y optimizamos continuamente.',
      'wcard3-m': '100%<small> rastreado y reportado</small>',
      'wcard4-t': 'Especialistas en el mercado fronterizo',
      'wcard4-d': 'El Paso\u2013Ju\u00e1rez: 2.7M personas, dos pa\u00edses, una econom\u00eda. Pocas agencias entienden c\u00f3mo servir a ambos lados.',
      'wcard4-m': '2.7M<small> de mercado accesible</small>',
      /* cases */
      'cases-kicker': 'Resultados reales',
      'cases-title':  'Proyectos que<br><span class="lime">mueven</span> mercados.',
      'cases-desc':   'Cada caso de estudio tiene impacto empresarial medible. No hay dise\u00f1o sin resultados.',
      'case1-name': 'Sun City Realty \u2014 De P\u00e1gina 4 al #1 en 5 Meses',
      'case1-text': 'Redise\u00f1o completo y mejora de SEO. El sitio anterior era lento, roto en m\u00f3vil e invisible en Google. Nueva arquitectura, clusters de contenido local para cada colonia de El Paso y optimizaci\u00f3n de Google Business Profile lograron el dominio del mercado.',
      'kpi-traffic': 'Aumento de tr\u00e1fico org\u00e1nico', 'kpi-leads': 'Leads por mes',
      'kpi-appts': 'Nuevas citas', 'kpi-maps': 'Visibilidad en Maps',
      'kpi-revenue': 'Ingresos online',
      'case2-name': 'Border Medical Group \u2014 4 Cl\u00ednicas Dominando B\u00fasqueda Local',
      'case2-text': 'SEO multisucursal biling\u00fce en 4 cl\u00ednicas de El Paso. UX enfocada en pacientes y optimizaci\u00f3n de Google Maps impulsaron un crecimiento explosivo.',
      'case3-name': 'Mountainstar Foods \u2014 De $0 a $2.1M Online',
      'case3-text': 'Tienda Shopify biling\u00fce, campa\u00f1as de Google Shopping y estrategia de contenido SEO. Marca de alimentos de la regi\u00f3n fronteriza expandida al mundo digital.',
      'cases-btn': 'Comienza Tu Historia de \u00c9xito \u2192',
      /* process */
      'proc-kicker': 'C\u00f3mo trabajamos',
      'proc-title':  'En vivo en<br><span class="lime">2 semanas.</span>',
      'proc-desc':   'De la primera conversaci\u00f3n al sitio en vivo en menos de 2 semanas. Sin esperas de 2 meses \u2014 solo ejecuci\u00f3n r\u00e1pida y profesional.',
      'proc1-t': 'Descubrimiento y Estrategia',
      'proc1-d': 'D\u00eda 1: auditor\u00eda completa del negocio, investigaci\u00f3n de competidores, arquitectura de keywords y plan de SEO adaptado al mercado de El Paso.',
      'proc1-dur': 'D\u00eda 1\u20132',
      'proc2-t': 'Dise\u00f1o y Wireframes',
      'proc2-d': 'Dise\u00f1o UI/UX completo con wireframes mobile-first y tu aprobaci\u00f3n total antes de escribir una sola l\u00ednea de c\u00f3digo.',
      'proc2-dur': 'D\u00eda 3\u20135',
      'proc3-t': 'Desarrollo',
      'proc3-d': 'C\u00f3digo r\u00e1pido y limpio con Core Web Vitals optimizados desde el primer d\u00eda. Schema markup, CMS y tracking integrados.',
      'proc3-dur': 'D\u00eda 6\u20139',
      'proc4-t': 'QA y Revisiones',
      'proc4-d': 'Pruebas completas en navegadores y m\u00f3viles. Una ronda de revisiones incluida. Nada sale en vivo hasta que t\u00fa lo apruebes.',
      'proc4-dur': 'D\u00eda 10\u201311',
      'proc5-t': 'Lanzamiento',
      'proc5-d': 'Lanzamiento p\u00fablico con GA4, Google Search Console y tracking de conversi\u00f3n Hotjar activos desde el minuto uno. Sin tiempo de inactividad.',
      'proc5-dur': 'D\u00eda 12\u201313',
      'proc6-t': 'Crecer y Escalar',
      'proc6-d': 'Entrega, capacitaci\u00f3n en CMS y retainer mensual opcional para contenido SEO, reportes y mejora continua.',
      'proc6-dur': 'D\u00eda 14 + Continuo',
      /* pricing */
      'price-kicker': 'Precios transparentes',
      'price-title':  'Precios simples<br>y <span class="lime">honestos.</span>',
      'price-desc':   'Sin tarifas ocultas. Sin trucos. Cada plan incluye una llamada estrat\u00e9gica gratis de 30 min antes de comprometerte. Los retainers mensuales comienzan en <strong style="color:var(--lime)">$199/mes</strong> \u2014 los precios m\u00e1s competitivos en El Paso.',
      'tog-one': 'Proyecto \u00fanico',
      'tog-mo':  'Retainer mensual <span style="color:var(--lime);font-size:12px">desde $199/mes</span>',
      'price-save': 'Mejor valor \u2014 ahorra 20%',
      'price-pop': 'M\u00e1s Popular',
      'price1-desc': 'Perfecto para peque\u00f1os negocios de El Paso listos para profesionalizarse online. Un sitio web personalizado que convierte \u2014 a un precio hecho para el mercado local.',
      'price2-desc': 'Para negocios de El Paso listos para posicionarse #1 en Google y generar leads calificados consistentes mes a mes.',
      'price3-desc': 'Para empresas listas para dominar su mercado completo \u2014 e-commerce, SEO multisucursal y retainers de servicio completo.',
      'pf1-1': 'Sitio web personalizado de 5 p\u00e1ginas', 'pf1-2': 'Dise\u00f1o responsive mobile-first',
      'pf1-3': 'Configuraci\u00f3n de SEO on-page', 'pf1-4': 'Google Analytics 4 + Search Console',
      'pf1-5': 'Formulario de contacto + notificaciones por email', 'pf1-6': 'Optimizaci\u00f3n de Google Business Profile',
      'pf1-7': 'Soporte 30 d\u00edas post-lanzamiento', 'pf1-8': 'Contenido SEO mensual', 'pf1-9': 'Gesti\u00f3n de Google Ads',
      'pf2-1': 'Sitio web de 10 p\u00e1ginas + blog', 'pf2-2': 'Arquitectura avanzada de CRO',
      'pf2-3': 'SEO t\u00e9cnico completo', 'pf2-4': 'Implementaci\u00f3n de schema markup',
      'pf2-5': '3 meses de contenido SEO incluido', 'pf2-6': 'Configuraci\u00f3n de Google Ads (primer mes)',
      'pf2-7': 'Reporte mensual de rendimiento', 'pf2-8': 'Opci\u00f3n biling\u00fce (EN + ES)',
      'pf2-9': 'Soporte 90 d\u00edas post-lanzamiento',
      'pf3-1': 'P\u00e1ginas ilimitadas + e-commerce', 'pf3-2': 'Campa\u00f1a completa de autoridad SEO',
      'pf3-3': 'SEO local multisucursal', 'pf3-4': 'Gesti\u00f3n continua de Google Ads',
      'pf3-5': 'Producci\u00f3n mensual de contenido SEO', 'pf3-6': 'Gesti\u00f3n de redes sociales',
      'pf3-7': 'Account manager dedicado', 'pf3-8': 'Soporte prioritario 24h',
      'pf3-9': 'Revisiones trimestrales de estrategia',
      'price-btn1': 'Comenzar con Launch \u2192', 'price-btn2': 'Comenzar con Scale \u2192', 'price-btn3': 'Obtener Cotizaci\u00f3n \u2192',
      'price-note1': 'Llamada estrat\u00e9gica gratis \u00b7 Sin contratos',
      'price-note2': 'Llamada estrat\u00e9gica gratis \u00b7 Sin contratos',
      'price-note3': 'Llamada estrat\u00e9gica gratis \u00b7 T\u00e9rminos flexibles',
      /* testimonials */
      'testi-kicker': 'Resultados de clientes',
      'testi-title':  'Lo que dice<br>El Paso<span class="lime">.</span>',
      'testi-total':  '4.9 / 5.0 \u00b7 87 Rese\u00f1as en Google',
      'testi1-text':  '\u201cFrontera cambi\u00f3 completamente la trayectoria de nuestro negocio. Pasamos de obtener 2\u20133 leads online por semana a 15\u201320. Realmente entienden el SEO \u2014 no solo el dise\u00f1o \u2014 y los resultados hablan por s\u00ed solos.\u201d',
      'testi1-res':   '<strong>+312% tr\u00e1fico org\u00e1nico</strong> en 5 meses',
      'testi1-role':  'Due\u00f1o, Sun City Realty',
      'testi2-text':  '\u201cHab\u00edamos probado 2 agencias antes de Frontera. La diferencia es enorme \u2014 reportan m\u00e9tricas reales, responden r\u00e1pido, y nuestra visibilidad en Google Maps pas\u00f3 de invisible al top 3 en 3 meses.\u201d',
      'testi2-res':   '<strong>+218% nuevas citas de pacientes</strong> \u2014 Google Maps: invisible \u2192 Top 3',
      'testi2-role':  'Directora M\u00e9dica, Border Medical Group',
      'testi3-text':  '\u201cLa capacidad biling\u00fce fue el factor decisivo. Solo el SEO en espa\u00f1ol a\u00f1adi\u00f3 35% m\u00e1s de tr\u00e1fico de clientes que nos estaban perdiendo completamente. Nuestra tienda Shopify pas\u00f3 de $0 a m\u00e1s de $2M online.\u201d',
      'testi3-res':   '<strong>+445% ingresos online</strong> \u2014 $0 \u2192 $2.1M en 8 meses',
      'testi3-role':  'CEO, Mountainstar Foods',
      /* faq */
      'faq-kicker': 'Preguntas Frecuentes',
      'faq-title':  'Preguntas<br><span class="lime">comunes.</span>',
      'faq-desc':   'Todo lo que los empresarios de El Paso preguntan antes de trabajar con nosotros.',
      'faq-phone':  'Tel\u00e9fono: <a href="tel:+19152196739">915-219-6739</a>',
      'faq-email':  'Email: <a href="mailto:hello@fronterawebdesign.com">hello@fronterawebdesign.com</a>',
      'faq-btn':    'Obt\u00e9n Auditor\u00eda Gratis \u2192',
      'faq1-q': '\u00bfCu\u00e1nto tarda construir un nuevo sitio web?',
      'faq1-a': 'La mayor\u00eda de los proyectos salen en vivo en <strong>2 semanas</strong> desde el inicio. Un sitio de 5 p\u00e1ginas puede lanzarse en 10 d\u00edas; una tienda e-commerce biling\u00fce toma hasta 3 semanas. Entregamos un cronograma exacto en cada propuesta y nunca hemos incumplido una fecha.',
      'faq2-q': '\u00bfCu\u00e1nto tiempo pasa antes de ver resultados del SEO?',
      'faq2-a': 'Para b\u00fasquedas locales en El Paso, la mayor\u00eda de clientes ve movimiento significativo en <strong>60\u201390 d\u00edas</strong>. Los rankings en P\u00e1gina 1 para t\u00e9rminos competitivos toman <strong>3\u20136 meses</strong>. Rastreamos y reportamos rankings desde la semana 1 para que veas el progreso en cada paso.',
      'faq3-q': '\u00bfEn qu\u00e9 se diferencian de otras agencias de El Paso?',
      'faq3-a': '<strong>(1) Combinamos dise\u00f1o premium con estrategia SEO real</strong> \u2014 la mayor\u00eda de agencias hace uno u otro. <strong>(2) Somos genuinamente biling\u00fces</strong> \u2014 nativo EN/ES, no Google Translate. <strong>(3) Estamos obsesionados con resultados medibles.</strong> Cada proyecto tiene KPIs claros y accountability mensual.',
      'faq4-q': '\u00bfPueden ayudar con Google Maps y SEO local?',
      'faq4-a': 'Por supuesto \u2014 uno de nuestros servicios m\u00e1s fuertes. Aparecer en el \u201c3-Pack\u201d de Google Maps puede ser transformador para negocios de El Paso. Optimizamos tu Google Business Profile, construimos citas locales, creamos estrategias de rese\u00f1as y producimos contenido por colonia.',
      'faq5-q': '\u00bfOfrecen planes mensuales o solo proyectos \u00fanicos?',
      'faq5-a': 'Ambos. Nuestros paquetes Launch y Scale son proyectos \u00fanicos. Tambi\u00e9n ofrecemos <strong>retainers mensuales de crecimiento</strong> desde $199/mes que incluyen contenido SEO continuo, construcci\u00f3n de backlinks, gesti\u00f3n de Google Ads y reportes. <strong>Sin contratos a largo plazo.</strong>',
      'faq6-q': '\u00bfPuedo actualizar mi propio sitio web?',
      'faq6-a': 'S\u00ed \u2014 cada sitio incluye una sesi\u00f3n de capacitaci\u00f3n en CMS. Podr\u00e1s actualizar textos, im\u00e1genes, blog y productos sin tocar c\u00f3digo. Tambi\u00e9n ofrecemos un <strong>plan de mantenimiento gestionado</strong> donde nosotros hacemos todas las actualizaciones.',
      'faq7-q': '\u00bfQu\u00e9 incluye la auditor\u00eda web gratuita?',
      'faq7-a': '<strong>Revisi\u00f3n de salud SEO t\u00e9cnica</strong> (Core Web Vitals, errores de rastreo, m\u00f3vil), <strong>An\u00e1lisis de rankings en Google</strong> (keywords actuales y brechas vs. competidores), <strong>Revisi\u00f3n de conversi\u00f3n</strong> (por qu\u00e9 los visitantes se van sin contactarte) y <strong>an\u00e1lisis de brechas</strong> de tus 3 principales competidores en El Paso. Entregada en 48 horas. Sin compromiso.',
      /* blog */
      'blog-kicker': 'Conocimiento y recursos',
      'blog-title':  'Conocimiento experto,<br><span class="lime">gratis.</span>',
      'blog-all':    'Ver Todos los Art\u00edculos \u2192',
      'blog1-cat': 'SEO', 'blog1-date': '10 Mar, 2026',
      'blog1-title': 'C\u00f3mo Posicionarte #1 en Google en El Paso: La Gu\u00eda Completa 2026',
      'blog1-exc':   'Gu\u00eda paso a paso para dominar la b\u00fasqueda local en El Paso \u2014 desde Google Business Profile hasta estrategia de contenido biling\u00fce. Todo lo aprendido en 143 proyectos.',
      'blog1-read':  '12 min de lectura',
      'blog2-cat': 'Precios', 'blog2-date': '20 Feb, 2026',
      'blog2-title': '\u00bfCu\u00e1nto Cuesta un Sitio Web en El Paso, TX? (Desglose Honesto 2026)',
      'blog2-exc':   'Desglose real de precios de sitios web \u2014 desde DIY hasta proyectos premium \u2014 para que los negocios de El Paso tomen una decisi\u00f3n informada sin ser enga\u00f1ados.',
      'blog2-read':  '8 min de lectura',
      'blog3-cat': 'Marketing', 'blog3-date': '28 Ene, 2026',
      'blog3-title': 'Google Ads vs. SEO para Negocios en El Paso: \u00bfCu\u00e1l Primero?',
      'blog3-exc':   'La respuesta no es la misma para todos. Analizamos m\u00e1s de 80 negocios en El Paso para mostrar exactamente cu\u00e1ndo los anuncios pagados ganan y cu\u00e1ndo el SEO org\u00e1nico da mejor ROI.',
      'blog3-read':  '10 min de lectura',
      'read-art':    'Leer art\u00edculo \u2192',
      /* local */
      'local-kicker': 'Sirviendo El Paso, TX',
      'local-title':  'La \u00fanica agencia de El Paso que combina<br><span style="color:var(--lime)">dise\u00f1o premium</span> con <span style="color:var(--lime)">dominio en Google.</span>',
      'local-sub':    'Desde Upper Valley hasta el East Side, desde UTEP hasta Fort Bliss \u2014 ayudamos a los negocios de El Paso a posicionarse #1 en Google y convertir sus sitios en sistemas autom\u00e1ticos de generaci\u00f3n de clientes.',
      /* cta / form */
      'cta-kicker': 'Trabajemos juntos',
      'cta-title':  '\u00bfListo para posicionarte<br><span class="lime">#1 en El Paso?</span>',
      'cta-sub':    'Cu\u00e9ntanos sobre tu proyecto. Te enviaremos una auditor\u00eda web gratis + propuesta personalizada en 48 horas. Sin compromiso, sin spam.',
      'ms-lbl1': 'Servicio', 'ms-lbl2': 'Presupuesto', 'ms-lbl3': 'Contacto',
      'step1-title': '\u00bfQu\u00e9 necesitas?',
      'step1-sub':   'Elige todas las que apliquen \u2014 adaptaremos tu auditor\u00eda gratis.',
      'opt1-name': 'Nuevo Sitio Web', 'opt1-sub': 'Dise\u00f1o + Desarrollo',
      'opt2-name': 'SEO Rankings', 'opt2-sub': 'Pos\u00edcionate #1 en Google',
      'opt3-name': 'Google Ads', 'opt3-sub': 'Tr\u00e1fico pagado y leads',
      'opt4-name': 'Branding', 'opt4-sub': 'Identidad y sistema visual',
      'opt5-name': 'Redes Sociales', 'opt5-sub': 'Contenido y gesti\u00f3n',
      'opt6-name': 'E-Commerce', 'opt6-sub': 'Tienda online',
      'continue': 'Continuar \u2192', 'back': '\u2190 Atr\u00e1s',
      'step1-of3': 'Paso 1 de 3', 'step2-of3': 'Paso 2 de 3', 'step3-of3': 'Paso 3 de 3',
      'step2-title': '\u00bfCu\u00e1l es tu presupuesto aproximado?',
      'step2-sub':   'Nos ayuda a darte la recomendaci\u00f3n correcta. Ning\u00fan presupuesto es demasiado peque\u00f1o o grande.',
      'bud5': 'No estoy seguro a\u00fan',
      'url-lbl': 'URL de tu sitio actual (opcional)',
      'url-ph': 'https://tusitio.com',
      'step3-title': '\u00a1Casi listo!',
      'step3-sub':   'Te enviaremos tu auditor\u00eda gratis + propuesta en 48 horas.',
      'lbl-name': 'Tu nombre *', 'ph-name': 'Mar\u00eda Garc\u00eda',
      'lbl-co': 'Empresa', 'ph-co': 'Garc\u00eda Law El Paso',
      'lbl-em': 'Correo electr\u00f3nico *', 'ph-em': 'maria@ejemplo.com',
      'lbl-ph': 'Tel\u00e9fono (opcional)', 'ph-ph': '915-555-0000',
      'lbl-msg': 'Cu\u00e9ntanos sobre tu proyecto',
      'ph-msg': 'Somos un restaurante en East El Paso y necesitamos un sitio web que aparezca cuando la gente busca los mejores tacos en El Paso\u2026',
      'submit-btn': 'Enviar Solicitud de Auditor\u00eda',
      'form-legal': 'Tu informaci\u00f3n es 100% confidencial. Sin spam. Cancela cuando quieras.',
      'success-title': '\u00a1Recibimos tu solicitud!',
      'success-text':  'Tu auditor\u00eda gratis est\u00e1 en camino. Espera un reporte detallado + propuesta personalizada en tu bandeja de entrada en 48 horas.',
      'success-phone': '\u00bfPreguntas? Llama al <a href="tel:+19152196739">915-219-6739</a>',
      /* footer */
      'f-tag': 'Agencia premium de dise\u00f1o web y marketing digital de El Paso. Construimos sitios web que posicionan en Google y convierten visitantes en clientes.',
      'f-hours': 'Lun\u2013Vie 9am\u20136pm MT',
      'f-col1': 'Servicios', 'f-col2': 'Empresa', 'f-col3': 'Zonas de Servicio',
      'f-svc1': 'Dise\u00f1o Web El Paso', 'f-svc2': 'SEO El Paso TX',
      'f-svc3': 'Gesti\u00f3n de Google Ads', 'f-svc4': 'Branding e Identidad',
      'f-svc5': 'Marketing en Redes Sociales', 'f-svc6': 'Desarrollo E-Commerce', 'f-svc7': 'SEO Local El Paso',
      'f-co1': 'Sobre Frontera', 'f-co2': 'Nuestros Proyectos', 'f-co3': 'Nuestro Proceso',
      'f-co4': 'Precios', 'f-co5': 'Resultados de Clientes', 'f-co6': 'Blog y Recursos', 'f-co7': 'Cont\u00e1ctanos',
      'f-copy': '\u00a9 2026 Frontera Web LLC \u2014 El Paso, Texas. Todos los derechos reservados.',
      'f-priv': 'Pol\u00edtica de Privacidad', 'f-terms': 'T\u00e9rminos de Servicio', 'f-sitemap': 'Mapa del Sitio', 'f-access': 'Accesibilidad'
    }
  };

  function initLang() {
    var btn = eid('langBtn');
    if (!btn) { return; }

    var currentLang = localStorage.getItem('fs-lang') || 'en';

    function applyLang(lang) {
      // Fade out
      document.body.classList.add('lang-fade');

      setTimeout(function () {
        var t = T[lang];
        // textContent nodes
        document.querySelectorAll('[data-i18n]').forEach(function (el) {
          var key = el.getAttribute('data-i18n');
          if (t[key] !== undefined) { el.textContent = t[key]; }
        });
        // innerHTML nodes (contain HTML tags)
        document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
          var key = el.getAttribute('data-i18n-html');
          if (t[key] !== undefined) { el.innerHTML = t[key]; }
        });
        // placeholder attributes
        document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
          var key = el.getAttribute('data-i18n-ph');
          if (t[key] !== undefined) { el.placeholder = t[key]; }
        });
        // html lang attribute
        document.documentElement.lang = lang;
        // button label
        btn.textContent = lang === 'en' ? 'ES' : 'EN';
        btn.setAttribute('aria-label', lang === 'en' ? 'Cambiar a Espa\u00f1ol' : 'Switch to English');

        // Fade in
        document.body.classList.remove('lang-fade');
      }, 180);
    }

    // Apply saved lang on load
    if (currentLang === 'es') { applyLang('es'); }

    btn.addEventListener('click', function () {
      currentLang = currentLang === 'en' ? 'es' : 'en';
      localStorage.setItem('fs-lang', currentLang);
      applyLang(currentLang);
    });
  }

  /* ── SCROLL REVEAL ───────────────────────── */
  function initReveal() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: show everything immediately
      document.querySelectorAll('.reveal').forEach(function (el) {
        el.classList.add('vis');
      });
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('vis');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) {
      obs.observe(el);
    });
  }

  /* ── COUNTER ANIMATION ───────────────────── */
  function initCounters() {
    var section = eid('statsSection');
    if (!section) { return; }

    function animCount(el) {
      var target   = parseInt(el.getAttribute('data-t'), 10);
      var duration = 1800;
      var start    = performance.now();
      function update(now) {
        var progress = Math.min((now - start) / duration, 1);
        var eased    = 1 - Math.pow(1 - progress, 4);
        el.textContent = Math.round(eased * target);
        if (progress < 1) { requestAnimationFrame(update); }
      }
      requestAnimationFrame(update);
    }

    if (!('IntersectionObserver' in window)) {
      section.querySelectorAll('.counter').forEach(animCount);
      return;
    }

    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.querySelectorAll('.counter').forEach(animCount);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    obs.observe(section);
  }

  /* ── FAQ ACCORDION ───────────────────────── */
  function initFaq() {
    var items = document.querySelectorAll('.faq-item');
    items.forEach(function (item) {
      var btn = item.querySelector('.faq-q');
      if (!btn) { return; }
      btn.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');
        // Close all
        items.forEach(function (i) {
          i.classList.remove('open');
          var q = i.querySelector('.faq-q');
          if (q) { q.setAttribute('aria-expanded', 'false'); }
        });
        // Toggle current
        if (!isOpen) {
          item.classList.add('open');
          btn.setAttribute('aria-expanded', 'true');
        }
      });
    });
  }

  /* ── PRICING TOGGLE ──────────────────────── */
  function initPricing() {
    var tog      = eid('priceToggle');
    var lblOne   = eid('togLblOne');
    var lblMo    = eid('togLblMo');
    var saveTag  = eid('priceSave');
    var p1el     = eid('p1');
    var p2el     = eid('p2');
    if (!tog) { return; }

    var prices = { p1: [1800, 199], p2: [3800, 449] };
    var mode   = false;

    function setPrice(el, vals) {
      if (!el) { return; }
      el.innerHTML =
        '<span class="p-cur">$</span>' +
        vals[mode ? 1 : 0] +
        '<span class="p-per">' + (mode ? '/mo' : '') + '</span>';
    }

    function update() {
      tog.classList.toggle('on', mode);
      tog.setAttribute('aria-checked', String(mode));
      if (lblOne)  { lblOne.classList.toggle('active', !mode); }
      if (lblMo)   { lblMo.classList.toggle('active', mode); }
      if (saveTag) { saveTag.style.display = mode ? 'inline' : 'none'; }
      setPrice(p1el, prices.p1);
      setPrice(p2el, prices.p2);
    }

    tog.addEventListener('click', function () {
      mode = !mode;
      update();
    });

    tog.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        mode = !mode;
        update();
      }
    });

    update(); // Set initial state
  }

  /* ── MULTI-STEP FORM ─────────────────────── */
  function initForm() {
    var currentStep = 1;

    function getDot(n)  { return eid('dot' + n); }
    function getLine(n) { return eid('line' + n); }
    function getStep(n) { return eid('step' + n); }

    function updateIndicators(n) {
      [1, 2, 3].forEach(function (i) {
        var dot = getDot(i);
        if (!dot) { return; }
        dot.classList.remove('active', 'done');
        if (i < n) {
          dot.classList.add('done');
          dot.innerHTML = '<svg aria-hidden="true" width="12" height="10" viewBox="0 0 12 10" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 5l3.5 4L11 1"/></svg>';
        } else if (i === n) {
          dot.classList.add('active');
          dot.textContent = i;
        } else {
          dot.textContent = i;
        }
      });
      var l1 = getLine(1), l2 = getLine(2);
      if (l1) { l1.classList.toggle('done', n > 1); }
      if (l2) { l2.classList.toggle('done', n > 2); }
    }

    window.goStep = function (n) {
      var prev = getStep(currentStep);
      var next = getStep(n);
      if (prev) { prev.classList.remove('active'); }
      if (next) { next.classList.add('active'); }
      updateIndicators(n);
      currentStep = n;
      // Scroll form into view on mobile
      var form = eid('msForm');
      if (form && window.innerWidth < 900) {
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    window.toggleOpt = function (el) {
      el.classList.toggle('sel');
    };

    window.selectBud = function (el) {
      var pills = document.querySelectorAll('.bud-pill');
      pills.forEach(function (p) { p.classList.remove('sel'); });
      el.classList.add('sel');
    };

    window.submitForm = function () {
      var nameEl  = eid('f-name');
      var emailEl = eid('f-em');
      if (!nameEl || !emailEl) { return; }

      var name  = nameEl.value.trim();
      var email = emailEl.value.trim();

      if (!name) {
        nameEl.focus();
        nameEl.style.borderColor = '#FF4D2B';
        setTimeout(function () { nameEl.style.borderColor = ''; }, 2000);
        return;
      }
      if (!email || email.indexOf('@') === -1) {
        emailEl.focus();
        emailEl.style.borderColor = '#FF4D2B';
        setTimeout(function () { emailEl.style.borderColor = ''; }, 2000);
        return;
      }

      // Collect selected services
      var services = [];
      document.querySelectorAll('.opt-pill.sel .opt-name').forEach(function (el) {
        services.push(el.textContent.trim());
      });
      var budgetEl = document.querySelector('.bud-pill.sel');

      // Disable submit button while sending
      var submitBtn = document.querySelector('#step3 .btn-next');
      if (submitBtn) { submitBtn.disabled = true; }

      fetch('https://formspree.io/f/xyknnzvz', {
        method: 'POST',
        headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name:     name,
          email:    email,
          company:  eid('f-co')  ? eid('f-co').value.trim()  : '',
          phone:    eid('f-ph')  ? eid('f-ph').value.trim()  : '',
          message:  eid('f-msg') ? eid('f-msg').value.trim() : '',
          services: services.length ? services.join(', ') : 'None selected',
          budget:   budgetEl ? budgetEl.textContent.trim() : 'Not specified',
          website:  eid('f-url') ? eid('f-url').value.trim() : ''
        })
      })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.ok) {
          // Show success state
          [1, 2, 3].forEach(function (i) {
            var s = getStep(i);
            if (s) { s.classList.remove('active'); }
            var d = getDot(i);
            if (d) { d.classList.add('done'); d.innerHTML = '<svg aria-hidden="true" width="12" height="10" viewBox="0 0 12 10" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 5l3.5 4L11 1"/></svg>'; }
          });
          var l1 = getLine(1), l2 = getLine(2);
          if (l1) { l1.classList.add('done'); }
          if (l2) { l2.classList.add('done'); }
          var success = eid('formSuccess');
          if (success) { success.classList.add('show'); }
        } else {
          if (submitBtn) { submitBtn.disabled = false; }
          alert(data.error || 'Error sending. Please try again.');
        }
      })
      .catch(function () {
        if (submitBtn) { submitBtn.disabled = false; }
        alert('Connection error. Please try again.');
      });
    };

    // Wire up all CTA buttons to goTo('cta')
    document.querySelectorAll('[data-goto-cta]').forEach(function (el) {
      el.addEventListener('click', function () { goTo('cta'); });
    });
  }

  /* ── INIT ─────────────────────────────────── */
  // Preloader runs immediately (no DOMContentLoaded wait)
  initPreloader();

  // Everything else waits for DOM
  document.addEventListener('DOMContentLoaded', function () {
    initCursor();
    initCanvas();
    initNavbar();
    initMobileMenu();
    initAuditBar();
    initLang();
    initReveal();
    initCounters();
    initFaq();
    initPricing();
    initForm();

    // Hero buttons (no data-goto-cta on these)
    var heroAuditBtn = document.querySelector('#hero .btn-p');
    if (heroAuditBtn) {
      heroAuditBtn.addEventListener('click', function () { goTo('cta'); });
    }
    var heroWorkBtn = document.querySelector('#hero .btn-g');
    if (heroWorkBtn) {
      heroWorkBtn.addEventListener('click', function () { goTo('cases'); });
    }

    // Blog button (no data-goto-cta)
    var blogBtn = document.querySelector('#blog .btn-g');
    if (blogBtn) {
      blogBtn.addEventListener('click', function () { goTo('cta'); });
    }

    // Area pills in local section — scroll to cta
    document.querySelectorAll('.area-pill').forEach(function (pill) {
      pill.addEventListener('click', function () { goTo('cta'); });
    });

    // All other CTA buttons use [data-goto-cta] — handled in initForm()
  });

  // Brand signature
  console.log(
    '%c Frontera. %c fronterawebdesign.com ',
    'background:#C8FF00;color:#070705;font-weight:900;font-family:sans-serif;padding:4px 10px;border-radius:4px 0 0 4px',
    'background:#070705;color:#C8FF00;font-family:sans-serif;padding:4px 10px;border-radius:0 4px 4px 0;border:1px solid #C8FF00'
  );

})();
