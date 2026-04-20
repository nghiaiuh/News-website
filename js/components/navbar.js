/* =============================================================
   navbar.js — Shared Navbar Component
   Usage: add <div id="site-header"></div> to your page, then
   include this script with defer.
   Active link is auto-detected from the current filename.
   ============================================================= */

(function () {
  "use strict";

  // ── Config ─────────────────────────────────────────────────

  const HIDDEN_CLASS = "header--hidden";
  const SCROLL_DELTA = 1;  // px — minimum scroll to trigger hide/show
  const SCROLL_TOP_EDGE = 2;  // px — below this, always show navbar

  const LOGO_LETTERS = [
    { char: "D", color: "#c30000" },
    { char: "E", color: "#1c9a3f" },
    { char: "S", color: "#f2c200" },
    { char: "I", color: "#7a3bd6" },
    { char: "G", color: "#ff8a00" },
    { char: "N", color: "#1262ff" },
  ];

  const NAV_LEFT = [
    { href: "./Index.html", label: "Kinh tế &amp; Chính trị", key: "home" },
    { href: "./the-thao/the-thao-suc-khoe.html", label: "Thể thao &amp; Điện tử", key: "sports" },
  ];

  const NAV_RIGHT = [
    { href: "./giai-tri-doi-song/GiaiTrivsDoiSong.html", label: "Giải trí &amp; Đời sống", key: "lifestyle" },
    { href: "./vu-tru-thien-nhien/vu-tru-thien-nhien-detail.html", label: "Vũ trụ &amp; Thiên nhiên", key: "cosmos" },
  ];

  // ── Helpers ────────────────────────────────────────────────

  // Base path prefix — populated from data-base attribute on #site-header
  // e.g. data-base="./"  → links like ./Index.html (root page)
  //      data-base="../" → links like ../Index.html (one folder deep)
  let BASE = "./";

  /** Prepend BASE to a href that starts with "./" */
  function r(href) {
    return BASE + href.replace(/^\.?\//, "");
  }

  /** Detect which nav key matches the current page filename. */
  function getActiveKey() {
    const file = window.location.pathname.split("/").pop() || "";
    if (!file || file === "Index.html") return "home";
    if (file.startsWith("the-thao") || file.startsWith("suc-khoe")) return "sports";
    if (file.startsWith("vu-tru")) return "cosmos";
    if (file.startsWith("giai-tri") || file.startsWith("homeGTDS")) return "lifestyle";
    return "";
  }

  // ── HTML builders ──────────────────────────────────────────

  function buildNavLink({ href, label, key }, activeKey) {
    const active = key === activeKey;
    return (
      `<li class="nav-item menu-item${active ? " active" : ""}">` +
      `<a class="nav-link menu-link" href="${r(href)}"${active ? ' aria-current="page"' : ""}>` +
      label +
      `</a>` +
      `</li>`
    );
  }

  function buildNavList(links, extraClass, activeKey) {
    return (
      `<ul class="navbar-nav mb-0 main-menu ${extraClass}">` +
      links.map((link) => buildNavLink(link, activeKey)).join("") +
      `</ul>`
    );
  }

  function buildLogo() {
    const letters = LOGO_LETTERS
      .map(({ char, color }) => `<span style="color:${color}">${char}</span>`)
      .join("");
    return (
      `<a class="logo py-3 mb-0" href="${r("./Index.html")}">` +
      `<span>BÁO CHÍ <span aria-label="DESIGN">${letters}</span></span>` +
      `</a>`
    );
  }

  function buildNavbar(activeKey) {
    return (
      `<header class="header">` +
      `<nav class="navbar navbar-dark py-0">` +
      `<div class="container-fluid px-3 px-xl-4">` +

      `<div class="navbar-shell w-100">` +
      `<span class="team-tag">Nhóm 7</span>` +
      buildNavList(NAV_LEFT, "main-menu-left", activeKey) +
      buildLogo() +
      buildNavList(NAV_RIGHT, "main-menu-right", activeKey) +
      `<button class="navbar-toggler border-0 shadow-none hamburger-btn"` +
      ` type="button"` +
      ` data-bs-toggle="collapse"` +
      ` data-bs-target="#nwMenu"` +
      ` aria-controls="nwMenu"` +
      ` aria-expanded="false"` +
      ` aria-label="Toggle navigation">` +
      `<span class="hamburger" aria-hidden="true">` +
      `<span class="ham-line ham-top"></span>` +
      `<span class="ham-line ham-bottom"></span>` +
      `</span>` +
      `</button>` +
      `</div>` +

      `<div class="collapse navbar-collapse justify-content-end" id="nwMenu">` +
      `<div class="d-flex justify-content-center justify-content-lg-end w-100 mb-2 menu-actions">` +
      `<a class="btn login-btn rounded-0 px-4 py-4" id="login-link" href="./dang-nhap.html">Đăng nhập</a>` +
      `</div>` +
      `<ul class="navbar-nav list-inline mb-0 justify-content-center justify-content-lg-end w-100" id="user-options"></ul>` +
      `</div>` +

      `</div>` +
      `</nav>` +
      `</header>`
    );
  }

  // ── Scroll hide / show ─────────────────────────────────────

  function initScrollBehavior(header) {
    const mobileMenu = document.getElementById("nwMenu");
    const isMenuOpen = () => !!(mobileMenu && mobileMenu.classList.contains("show"));

    let lastScrollY = window.scrollY || 0;
    let ticking = false;

    function syncHeader() {
      const y = window.scrollY || 0;
      const diff = y - lastScrollY;

      if (y <= SCROLL_TOP_EDGE) {
        header.classList.remove(HIDDEN_CLASS);
      } else if (!isMenuOpen()) {
        if (diff > SCROLL_DELTA) header.classList.add(HIDDEN_CLASS);    // scrolling down
        else if (diff < -SCROLL_DELTA) header.classList.remove(HIDDEN_CLASS); // scrolling up
      } else {
        header.classList.remove(HIDDEN_CLASS); // mobile menu open — always show
      }

      lastScrollY = y;
      ticking = false;
    }

    window.addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(syncHeader); }
    }, { passive: true });

    // Keep navbar visible when Bootstrap mobile menu opens
    if (mobileMenu) {
      ["show.bs.collapse", "shown.bs.collapse"].forEach((evt) =>
        mobileMenu.addEventListener(evt, () => header.classList.remove(HIDDEN_CLASS))
      );
    }

    requestAnimationFrame(syncHeader); // sync on page load (e.g. back-navigation mid-page)
  }

  // ── GSAP hover effects ─────────────────────────────────────

  function initGsapHovers() {
    if (typeof gsap === "undefined") return;

    // Menu links — subtle lift on hover
    document.querySelectorAll(".main-menu .menu-item").forEach((item) => {
      const link = item.querySelector(".menu-link");
      if (!link) return;
      gsap.set(link, { y: 0 });
      item.addEventListener("mouseenter", () => gsap.to(link, { y: -2, duration: 0.25, ease: "power2.out", overwrite: "auto" }));
      item.addEventListener("mouseleave", () => gsap.to(link, { y: 0, duration: 0.30, ease: "power2.out", overwrite: "auto" }));
    });

    // Hamburger lines — spread apart on hover
    const btn = document.querySelector(".hamburger-btn");
    if (!btn) return;

    const top = btn.querySelector(".ham-top");
    const bottom = btn.querySelector(".ham-bottom");
    gsap.set([top, bottom], { x: 0 });

    btn.addEventListener("mouseenter", () => {
      gsap.to(top, { x: 4, duration: 0.3, ease: "power2.out", overwrite: "auto" });
      gsap.to(bottom, { x: -4, duration: 0.3, ease: "power2.out", overwrite: "auto" });
    });
    btn.addEventListener("mouseleave", () => {
      gsap.to([top, bottom], { x: 0, duration: 0.35, ease: "power2.out", overwrite: "auto" });
    });
  }

  // ── Body padding compensation ──────────────────────────────

  function initBodyPadding(header) {
    function apply() {
      document.body.style.paddingTop = header.offsetHeight + "px";
    }
    apply();
    window.addEventListener("resize", apply);
  }

  // ── Mount ──────────────────────────────────────────────────

  function mountNavbar() {
    const slot = document.getElementById("site-header");
    if (!slot) return;

    // Read base path from data-base attribute (e.g. data-base="./" or data-base="../")
    BASE = (slot.dataset.base || "./").replace(/\/?$/, "/");

    slot.innerHTML = buildNavbar(getActiveKey());

    const header = slot.querySelector(".header");
    if (!header) return;

    initScrollBehavior(header);
    initGsapHovers();
    initBodyPadding(header);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountNavbar);
  } else {
    mountNavbar();
  }
})();
