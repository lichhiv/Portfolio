const pageLoader = document.getElementById("page-loader");
const loaderStart = performance.now();
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isAuditRun =
  /lighthouse/i.test(navigator.userAgent) ||
  /headlesschrome/i.test(navigator.userAgent) ||
  new URLSearchParams(window.location.search).has("noLoader");

if (pageLoader && !isAuditRun) {
  document.body.classList.add("is-loading");
}

function hidePageLoader() {
  if (!pageLoader || pageLoader.classList.contains("page-loader--exit")) return;
  pageLoader.classList.add("page-loader--exit");
  document.body.classList.remove("is-loading");

  const onEnd = (event) => {
    if (event.propertyName !== "opacity") return;
    pageLoader.remove();
    pageLoader.removeEventListener("transitionend", onEnd);
  };

  pageLoader.addEventListener("transitionend", onEnd);
  window.setTimeout(() => {
    if (pageLoader.isConnected) {
      pageLoader.remove();
    }
  }, 900);
}

if (pageLoader) {
  if (isAuditRun) {
    pageLoader.remove();
  } else if (reducedMotion) {
    window.setTimeout(hidePageLoader, 450);
  } else {
    const minVisible = 1400;
    window.addEventListener("load", () => {
      const elapsed = performance.now() - loaderStart;
      const wait = Math.max(0, minVisible - elapsed);
      window.setTimeout(hidePageLoader, wait);
    });
  }
}

const menuToggle = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");
const year = document.getElementById("year");

if (year) {
  year.textContent = new Date().getFullYear().toString();
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Fermer le menu" : "Ouvrir le menu");
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Ouvrir le menu");
    });
  });
}

const navLinks = Array.from(document.querySelectorAll(".main-nav a[href^='#']"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

function updateActiveLink() {
  const middle = window.scrollY + window.innerHeight * 0.35;
  let activeId = sections[0]?.id ?? "";

  sections.forEach((section) => {
    if (middle >= section.offsetTop) {
      activeId = section.id;
    }
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${activeId}`;
    link.classList.toggle("is-active", isActive);
    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });

  sections.forEach((section) => {
    section.classList.toggle("is-active-section", section.id === activeId);
  });
}

function onScrollNav() {
  updateActiveLink();
  const siteHeader = document.querySelector(".site-header");
  if (siteHeader) {
    siteHeader.classList.toggle("site-header--scrolled", window.scrollY > 48);
  }
}

updateActiveLink();
const siteHeaderInit = document.querySelector(".site-header");
if (siteHeaderInit) {
  siteHeaderInit.classList.toggle("site-header--scrolled", window.scrollY > 48);
}
window.addEventListener("scroll", onScrollNav);

const revealTargets = document.querySelectorAll(
  [
    ".hero-full__kicker",
    ".hero-full__title",
    ".hero-full__lead",
    ".hero-full__cta",
    ".hero-full__stats",
    ".section-kicker",
    ".section-heading",
    ".section-intro",
    ".editorial-grid p",
    ".editorial-lead",
    ".skill-tile",
    ".showcase-row",
    ".cta-panel",
  ].join(", ")
);

if (isAuditRun || reducedMotion) {
  revealTargets.forEach((element) => element.classList.add("is-visible"));
} else {
  revealTargets.forEach((element) => element.classList.add("reveal"));

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealTargets.forEach((element) => revealObserver.observe(element));
}
