/* Meridian Defence — site interactions */
(function () {
  const $ = (s) => document.querySelector(s);
  const $$ = (s) => document.querySelectorAll(s);
  $("#year").textContent = new Date().getFullYear();

  /* ---------- Nav + progress + parallax ---------- */
  const nav = $("#nav"), bar = $("#progress"), heroImg = $(".hero-img");
  function onScroll() {
    const y = window.scrollY, h = document.body.scrollHeight - innerHeight;
    nav.classList.toggle("scrolled", y > 60);
    bar.style.width = (y / h) * 100 + "%";
    if (heroImg && y < innerHeight) heroImg.style.transform = `translateY(${y * 0.25}px)`;
  }
  addEventListener("scroll", onScroll, { passive: true }); onScroll();

  $("#menuBtn").addEventListener("click", () => $("#links").classList.toggle("open"));
  $$("#links a").forEach((a) => a.addEventListener("click", () => $("#links").classList.remove("open")));

  /* ---------- Reveal + counters ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      const n = e.target.querySelector("[data-count]");
      if (n) count(n);
      io.unobserve(e.target);
    });
  }, { threshold: 0.15 });
  $$(".reveal").forEach((el) => io.observe(el));

  function count(el) {
    const target = +el.dataset.count, suf = el.dataset.suffix || "", start = performance.now();
    const isYear = target > 1000;
    (function tick(t) {
      const p = Math.min((t - start) / 1800, 1), e = 1 - Math.pow(1 - p, 3);
      const v = isYear ? Math.round(2000 + (target - 2000) * e) : Math.round(target * e);
      el.textContent = v + suf;
      if (p < 1) requestAnimationFrame(tick);
    })(start);
  }

  /* ---------- Platform tabs ---------- */
  const platforms = [
    { tag: "High-altitude pseudo-satellite", title: "Halcyon", img: "assets/hero.jpg",
      body: "A solar-electric aircraft that flies for months at 65,000 ft. Surveillance, disaster response and atmospheric monitoring — with zero fuel and zero emissions.",
      list: ["180-day endurance", "Fully solar-electric", "Wildfire & flood early warning"] },
    { tag: "Earth observation constellation", title: "Meridian Orbit", img: "assets/orbit.jpg",
      body: "A 64-satellite constellation that measures emissions from every power plant, port and forest on Earth — giving governments verifiable, real-time carbon accounting.",
      list: ["Daily global methane mapping", "Secure sovereign data links", "Deorbit-by-design, zero debris"] },
    { tag: "Climate intelligence platform", title: "Terra", img: "assets/earth.jpg",
      body: "Our decision platform turns aerial and orbital data into net-zero roadmaps — modelling policy, supply chains and land use for ministries and Fortune 500s alike.",
      list: ["Scenario modelling to 2050", "Scope 1–3 verification", "Reforestation targeting"] },
  ];
  $$(".tab").forEach((btn) => btn.addEventListener("click", () => {
    $$(".tab").forEach((b) => b.classList.remove("active")); btn.classList.add("active");
    const p = platforms[+btn.dataset.tab], img = $("#featImg");
    img.classList.add("fading");
    setTimeout(() => {
      img.src = p.img; $("#featTag").textContent = p.tag; $("#featTitle").textContent = p.title;
      $("#featBody").textContent = p.body;
      $("#featList").innerHTML = p.list.map((l) => `<li>${l}</li>`).join("");
      img.classList.remove("fading");
    }, 300);
    chime(880, 0.04);
  }));

  /* ---------- Elegant audio (Web Audio, no files needed) ---------- */
  let ctx, soundOn = localStorage.getItem("md-sound") !== "off";
  const sBtn = $("#soundToggle");
  sBtn.classList.toggle("muted-snd", !soundOn);

  function ensureCtx() { if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)(); if (ctx.state === "suspended") ctx.resume(); }
  // soft bell-like tone: sine + gentle harmonic, slow decay
  function chime(freq = 660, vol = 0.06, dur = 1.8) {
    if (!soundOn) return; ensureCtx();
    const t = ctx.currentTime, g = ctx.createGain(), f = ctx.createBiquadFilter();
    f.type = "lowpass"; f.frequency.value = 2400;
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    [1, 2.01].forEach((m, i) => {
      const o = ctx.createOscillator(); o.type = "sine"; o.frequency.value = freq * m;
      const og = ctx.createGain(); og.gain.value = i ? 0.25 : 1;
      o.connect(og).connect(g); o.start(t); o.stop(t + dur);
    });
    g.connect(f).connect(ctx.destination);
  }
  function welcome() { [523.25, 659.25, 783.99].forEach((n, i) => setTimeout(() => chime(n, 0.045, 2.4), i * 180)); }

  let greeted = false;
  function firstInteraction() {
    if (greeted) return; greeted = true; welcome();
    ["pointerdown", "keydown"].forEach((e) => removeEventListener(e, firstInteraction));
  }
  ["pointerdown", "keydown"].forEach((e) => addEventListener(e, firstInteraction));

  $$(".btn, .links a, .post, .card").forEach((el) =>
    el.addEventListener("mouseenter", () => greeted && chime(1046.5, 0.015, 0.6)));

  sBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    soundOn = !soundOn; localStorage.setItem("md-sound", soundOn ? "on" : "off");
    sBtn.classList.toggle("muted-snd", !soundOn);
    if (soundOn) chime(783.99, 0.05);
  });

  /* ---------- Cookie banner ---------- */
  const cookie = $("#cookie");
  if (!localStorage.getItem("md-cookies")) setTimeout(() => cookie.classList.add("show"), 900);
  function setConsent(v) { localStorage.setItem("md-cookies", v); cookie.classList.remove("show"); chime(659.25, 0.04); }
  $("#cookieAccept").addEventListener("click", () => setConsent("all"));
  $("#cookieDecline").addEventListener("click", () => setConsent("essential"));
  $("#cookieSettings").addEventListener("click", (e) => { e.preventDefault(); cookie.classList.add("show"); });

  /* ---------- Contact form (demo) ---------- */
  $("#contactForm").addEventListener("submit", (e) => {
    e.preventDefault(); e.target.reset(); $("#formOk").hidden = false; welcome();
  });

  /* ---------- Support button → Botpress ---------- */
  $("#supportBtn").addEventListener("click", () => {
    chime(783.99, 0.04);
    if (window.botpress && typeof window.botpress.open === "function") {
      window.botpress.open();
    } else {
      alert("Support chat isn't connected yet. Add your Botpress embed scripts to index.html.");
    }
  });
})();
