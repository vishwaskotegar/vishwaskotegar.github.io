(function () {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  document.getElementById("year").textContent = new Date().getFullYear();

  /* ---------------- dot nav: scrollspy ---------------- */
  const dotItems = document.querySelectorAll(".dotnav__item");
  if (dotItems.length && "IntersectionObserver" in window) {
    const sections = Array.from(dotItems)
      .map((item) => document.getElementById(item.dataset.section))
      .filter(Boolean);

    const setActive = (id) => {
      dotItems.forEach((item) => {
        item.classList.toggle("is-active", item.dataset.section === id);
      });
    };

    // Track every section's latest ratio, not just the ones that changed in
    // the current callback batch — IntersectionObserver only reports targets
    // whose state crossed a threshold, so picking from the batch alone can
    // land on a section that's briefly passing through mid-scroll while a
    // still-fully-visible section (like the top of the page) goes unreported.
    const ratios = new Map(sections.map((s) => [s.id, 0]));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          ratios.set(e.target.id, e.isIntersecting ? e.intersectionRatio : 0);
        });

        let bestId = null;
        let bestRatio = 0;
        ratios.forEach((ratio, id) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestId = id;
          }
        });
        if (bestId) setActive(bestId);
      },
      { rootMargin: "-40% 0px -40% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((s) => observer.observe(s));
  }

  /* ---------------- hero: console response stream ---------------- */
  const RESPONSE =
    "I'm Vishwas — I build RAG pipelines and agents that hold up past the demo.";

  const responseEl = document.getElementById("console-response");
  const tokensEl = document.getElementById("console-tokens");
  const ctas = document.getElementById("hero-ctas");

  function sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }

  function revealCtas() {
    if (!ctas) return;
    if (reduceMotion || !window.gsap) {
      ctas.style.opacity = "1";
      return;
    }
    gsap.set(ctas, { y: 10 });
    gsap.to(ctas, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" });
  }

  function tokenCount(wordsSoFar) {
    return Math.round(wordsSoFar * 1.4);
  }

  async function streamResponse() {
    const words = RESPONSE.split(" ");
    const textSpan = document.createElement("span");
    responseEl.appendChild(textSpan);
    const cursor = document.createElement("span");
    cursor.className = "console__cursor";
    responseEl.appendChild(cursor);

    if (reduceMotion) {
      textSpan.textContent = RESPONSE;
      tokensEl.textContent = tokenCount(words.length);
      revealCtas();
      return;
    }

    await sleep(450);
    for (let i = 0; i < words.length; i++) {
      textSpan.textContent += (i === 0 ? "" : " ") + words[i];
      tokensEl.textContent = tokenCount(i + 1);
      const burst = i % 7 === 6 ? 180 : 45 + Math.random() * 55;
      await sleep(burst);
    }

    revealCtas();
  }

  if (responseEl) {
    streamResponse();
  }

  /* ---------------- context bar: fills once on load, then stays put ---------------- */
  (function () {
    const root = document.getElementById("context-bar");
    const stat = document.getElementById("context-bar-stat");
    if (!root) return;

    const SEGMENTS = [
      { key: "about", frac: 0.2, start: 300, dur: 450 },
      { key: "stack", frac: 0.2, start: 750, dur: 450 },
      { key: "experience", frac: 0.22, start: 1200, dur: 500 },
      { key: "projects", frac: 0.22, start: 1700, dur: 500 },
      { key: "contact", frac: 0.16, start: 2200, dur: 400 },
    ];
    const COMPLETE_AT = 2600;

    const segEls = SEGMENTS.map((s) => ({
      ...s,
      el: root.querySelector(`.context-bar__seg[data-key="${s.key}"]`),
      labelEl: root.querySelector(`.context-bar__labels [data-key="${s.key}"]`),
    }));

    if (reduceMotion) {
      segEls.forEach((s) => {
        s.el.style.width = s.frac * 100 + "%";
        s.labelEl.style.opacity = "1";
      });
      stat.style.opacity = "1";
      return;
    }

    const startTime = performance.now();
    function frame(now) {
      const t = now - startTime;
      let stillRunning = false;

      segEls.forEach((s) => {
        const local = Math.min(1, Math.max(0, (t - s.start) / s.dur));
        s.el.style.width = local * s.frac * 100 + "%";
        s.labelEl.style.opacity = Math.min(1, local + 0.4).toString();
        if (local < 1) stillRunning = true;
      });

      if (t >= COMPLETE_AT) {
        stat.style.opacity = "1";
      }

      if (stillRunning || t < COMPLETE_AT) {
        requestAnimationFrame(frame);
      }
    }
    requestAnimationFrame(frame);
  })();

  /* ---------------- scroll reveals ---------------- */
  if (!reduceMotion && window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    document.querySelectorAll(".reveal").forEach((el) => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: "power2.out",
        scrollTrigger: {
          trigger: el,
          start: "top 82%",
          once: true,
        },
      });
    });
  } else {
    document.querySelectorAll(".reveal").forEach((el) => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }
})();
