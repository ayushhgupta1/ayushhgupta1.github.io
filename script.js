// Ayush Kumar Gupta — portfolio interactions (kept deliberately light)
document.documentElement.classList.add("js");

(function () {
  const nav = document.getElementById("nav");
  const toggle = document.getElementById("navToggle");
  const links = document.getElementById("navLinks");

  // Nav background after scrolling
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );

  // Reveal on scroll
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("in"));
  }

  // Highlight the current section in the nav
  const navAnchors = [...links.querySelectorAll('a[href^="#"]')];
  const sections = navAnchors
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            navAnchors.forEach((a) =>
              a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id)
            );
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => spy.observe(s));
  }

  // Fit the giant "PORTFOLIO" word to the stage width (works with any font that loads)
  const stage = document.querySelector(".hero-stage");
  const words = document.querySelectorAll(".word");
  const fitWord = () => {
    if (!stage || !words.length) return;
    const probe = words[0];
    probe.style.fontSize = "100px";
    const w = probe.scrollWidth || probe.getBoundingClientRect().width;
    const desktop = window.matchMedia("(min-width: 961px)").matches;
    let size = (100 * stage.clientWidth * 0.97) / w;
    if (desktop) size = Math.min(size, window.innerHeight * 0.38);
    words.forEach((el) => (el.style.fontSize = size.toFixed(1) + "px"));

    // On short desktop screens, grow the hero so the word never runs into the buttons
    const hero = document.querySelector(".hero");
    const copy = document.querySelector(".hero-copy");
    hero.style.minHeight = "";
    if (desktop && copy) {
      const copyBottom = copy.getBoundingClientRect().bottom - hero.getBoundingClientRect().top;
      const needed = copyBottom + size * 0.86 + window.innerHeight * 0.02 + 36;
      if (needed > hero.clientHeight) hero.style.minHeight = Math.ceil(needed) + "px";
    }
  };
  fitWord();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitWord);
  let rt;
  window.addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(fitWord, 80);
  });

  // Footer year
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();
})();
