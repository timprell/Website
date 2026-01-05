// Knuth hero scroll animations: adjust maxScroll to change the range.
(() => {
  const hero = document.querySelector("[data-knuth-hero]");
  if (!hero) return;

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const maxScroll = 400; // px over which the effect progresses
  let ticking = false;
  let clinked = false;

  const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

  const applyProgress = (p) => {
    // Interpolate overlay + glass movement (make it more present but still subtle)
    const blur = 18 - 10 * p;          // 18px -> 8px
    const opacity = 0.42 - 0.30 * p;   // 0.42 -> 0.12
    const translate = -32 * p;         // 0px -> -32px parallax lift
    const scale = 1 + 0.08 * p;        // 1 -> 1.08
    const tiltLeft = -3 * p;           // deg
    const tiltRight = 3 * p;           // deg
    const lift = -6 * p;               // shared slight lift

    hero.style.setProperty("--knuth-overlay-blur", `${blur}px`);
    hero.style.setProperty("--knuth-overlay-opacity", opacity.toFixed(3));
    hero.style.setProperty("--knuth-glass-translate", `${translate}px`);
    hero.style.setProperty("--knuth-glass-scale", scale.toFixed(3));
    hero.style.setProperty("--knuth-tilt-left", `${tiltLeft.toFixed(2)}deg`);
    hero.style.setProperty("--knuth-tilt-right", `${tiltRight.toFixed(2)}deg`);
    hero.style.setProperty("--knuth-tilt-lift", `${lift.toFixed(2)}px`);
  };

  const update = () => {
    const scrolled = window.scrollY || window.pageYOffset;
    const progress = clamp(scrolled / maxScroll, 0, 1);

    if (!prefersReduced) {
      applyProgress(progress);

      // Trigger the subtle clink on the first scroll nudge
      if (!clinked && progress > 0.02) {
        hero.classList.add("knuth-clink");
        clinked = true;
        setTimeout(() => hero.classList.remove("knuth-clink"), 800);
      }
    }
    ticking = false;
  };

  const onScroll = () => {
    if (prefersReduced) return;
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  update(); // set initial state
})();

// Speisekarte: Karten klicken, um passenden Abschnitt einzublenden.
(() => {
  const cards = document.querySelectorAll(".menu .card-link");
  const sections = document.querySelectorAll(".menu-sections");
  if (!cards.length || !sections.length) return;

  const activate = (hash) => {
    const targetId = (hash || "").replace("#", "");
    if (!targetId) return;
    sections.forEach((section) => {
      const isActive = section.id === targetId;
      section.classList.toggle("active", isActive);
    });
    const targetEl = document.getElementById(targetId);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  cards.forEach((card) => {
    card.addEventListener("click", (e) => {
      e.preventDefault();
      const href = card.getAttribute("href");
      activate(href);
      history.replaceState(null, "", href);
    });
  });

  // Falls die Seite mit Hash geladen wird, direkt passenden Abschnitt zeigen.
  activate(window.location.hash);
})();
