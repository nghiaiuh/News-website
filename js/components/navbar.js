/* =============================================================
   navbar.js — Shared Navbar Component
   Usage: add <div id="site-header"></div> to your page, then
   include this script. The component auto-detects the active
   link by matching the current filename to the nav links.
   ============================================================= */

(function () {
  "use strict";

  /* ── Navbar behaviours (scroll hide/show + hovers) ───────── */
  function initNavbarBehaviours() {
    var header = document.querySelector(".header, .news-header");
    if (!header) return;

    var mobileMenu = document.getElementById("nwMenu");

    var lastScrollY = window.scrollY || window.pageYOffset || 0;
    var ticking = false;
    var hideAfter = 2;
    var delta = 1;

    function isMenuOpen() {
      return !!(mobileMenu && mobileMenu.classList.contains("show"));
    }

    function syncHeaderOnScroll() {
      var currentY = window.scrollY || window.pageYOffset || 0;

      if (currentY <= 2) {
        header.classList.remove("header--hidden", "news-header--hidden");
        lastScrollY = currentY;
        ticking = false;
        return;
      }

      if (!isMenuOpen()) {
        var diff = currentY - lastScrollY;

        if (diff > delta && currentY > hideAfter) {
          header.classList.add("header--hidden");
          header.classList.remove("news-header--hidden");
        } else if (diff < -delta) {
          header.classList.remove("header--hidden", "news-header--hidden");
        }
      } else {
        header.classList.remove("header--hidden", "news-header--hidden");
      }

      lastScrollY = currentY;
      ticking = false;
    }

    window.addEventListener(
      "scroll",
      function () {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(syncHeaderOnScroll);
        }
      },
      { passive: true }
    );

    // Ensure correct state if page loads mid-scroll
    requestAnimationFrame(syncHeaderOnScroll);

    if (mobileMenu) {
      mobileMenu.addEventListener("show.bs.collapse", function () {
        header.classList.remove("header--hidden", "news-header--hidden");
      });
      mobileMenu.addEventListener("shown.bs.collapse", function () {
        header.classList.remove("header--hidden", "news-header--hidden");
      });
    }

    // ── GSAP hover effects (menu items + hamburger) ──────────
    if (typeof gsap !== "undefined") {
      var menuItems = document.querySelectorAll(".main-menu .menu-item, .news-main-menu .news-menu-item");
      menuItems.forEach(function (item) {
        var link = item.querySelector(".menu-link, .news-menu-link");
        if (!link) return;

        gsap.set(link, { y: 0 });

        item.addEventListener("mouseenter", function () {
          gsap.to(link, {
            y: -2,
            duration: 0.25,
            ease: "power2.out",
            overwrite: "auto",
          });
        });

        item.addEventListener("mouseleave", function () {
          gsap.to(link, {
            y: 0,
            duration: 0.3,
            ease: "power2.out",
            overwrite: "auto",
          });
        });
      });

      var hamburgerBtn = document.querySelector(".hamburger-btn, .news-hamburger-btn");
      if (hamburgerBtn) {
        var topLine = hamburgerBtn.querySelector(".ham-top, .news-ham-top");
        var bottomLine = hamburgerBtn.querySelector(".ham-bottom, .news-ham-bottom");

        gsap.set([topLine, bottomLine], { x: 0 });

        hamburgerBtn.addEventListener("mouseenter", function () {
          if (topLine) {
            gsap.to(topLine, {
              x: 4,
              duration: 0.3,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
          if (bottomLine) {
            gsap.to(bottomLine, {
              x: -4,
              duration: 0.3,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        });

        hamburgerBtn.addEventListener("mouseleave", function () {
          gsap.to([topLine, bottomLine], {
            x: 0,
            duration: 0.35,
            ease: "power2.out",
            overwrite: "auto",
          });
        });
      }
    }
  }

  /* ── Active-link detection ──────────────────────────────── */
  function getActiveKey() {
    var path = window.location.pathname;
    var file = path.split("/").pop() || "Home.html";
    if (file === "" || file === "Home.html") return "home";
    if (file.startsWith("the-thao")) return "sports";
    if (file.startsWith("suc-khoe") || file.startsWith("vu-tru")) return "sports";
    if (file.startsWith("giai-tri") || file.startsWith("homeGTDS")) return "lifestyle";
    return "";
  }

  /* ── Logo HTML (shared, colour letters are intentional inline styles) */
  var LOGO_HTML =
    '<a class="logo py-3 mb-0" href="./Index.html">' +
      "<span>" +
        "BÁO CHÍ " +
        '<span aria-label="DESIGN">' +
          '<span style="color:#c30000">D</span>' +
          '<span style="color:#1c9a3f">E</span>' +
          '<span style="color:#f2c200">S</span>' +
          '<span style="color:#7a3bd6">I</span>' +
          '<span style="color:#ff8a00">G</span>' +
          '<span style="color:#1262ff">N</span>' +
        "</span>" +
      "</span>" +
    "</a>";

  /* ── Nav link helper ───────────────────────────────────── */
  function navLink(href, label, key, activeKey) {
    var isCurrent = key === activeKey;
    return (
      '<li class="nav-item menu-item' + (isCurrent ? " active" : "") + '">' +
        '<a class="nav-link menu-link" href="' + href + '"' +
          (isCurrent ? ' aria-current="page"' : "") +
        ">" + label + "</a>" +
      "</li>"
    );
  }

  /* ── Template ───────────────────────────────────────────── */
  function buildNavbar(activeKey) {
    return (
      '<header class="header sticky-top">' +
        '<nav class="navbar navbar-dark py-0">' +
          '<div class="container-fluid px-3 px-xl-4">' +

            /* Desktop shell */
            '<div class="navbar-shell w-100">' +
              '<span class="team-tag">Nhóm 7</span>' +

              "<ul class=\"navbar-nav mb-0 main-menu main-menu-left\">" +
                navLink("./Home.html",           "Kinh tế &amp; Chính trị", "home",      activeKey) +
                navLink("./the-thao-suc-khoe.html", "Thể thao &amp; Sức khoẻ", "sports", activeKey) +
              "</ul>" +

              LOGO_HTML +

              "<ul class=\"navbar-nav mb-0 main-menu main-menu-right\">" +
                navLink("./giai-tri-doi-song/homeGTDS.html", "Giải trí &amp; Đời sống",   "lifestyle", activeKey) +
                navLink("./Home.html",     "Vũ trụ &amp; Thiên nhiên",  "cosmos",    activeKey) +
              "</ul>" +

              /* Hamburger */
              '<button class="navbar-toggler border-0 shadow-none hamburger-btn"' +
                ' type="button"' +
                ' data-bs-toggle="collapse"' +
                ' data-bs-target="#nwMenu"' +
                ' aria-controls="nwMenu"' +
                ' aria-expanded="false"' +
                ' aria-label="Toggle navigation">' +
                '<span class="hamburger" aria-hidden="true">' +
                  '<span class="ham-line ham-top"></span>' +
                  '<span class="ham-line ham-bottom"></span>' +
                "</span>" +
              "</button>" +
            "</div>" + /* end navbar-shell */

            /* Mobile collapse */
            '<div class="collapse navbar-collapse justify-content-end" id="nwMenu">' +
              '<div class="d-flex justify-content-center justify-content-lg-end w-100 mb-2 menu-actions">' +
                '<a class="btn login-btn rounded-0 px-4 py-4"' +
                  ' id="login-link"' +
                  ' href="./dang-nhap.html">Đăng nhập</a>' +
              "</div>" +
              '<ul class="navbar-nav list-inline mb-0 justify-content-center justify-content-lg-end w-100"' +
                ' id="user-options"></ul>' +
            "</div>" + /* end collapse */

          "</div>" + /* end container-fluid */
        "</nav>" +
      "</header>"
    );
  }

  /* ── Mount ──────────────────────────────────────────────── */
  function mountNavbar() {
    var slot = document.getElementById("site-header");
    if (!slot) return; /* page didn't opt-in */

    var activeKey = getActiveKey();
    slot.innerHTML = buildNavbar(activeKey);

    // Behaviours rely on the injected DOM existing.
    initNavbarBehaviours();
  }

  /* Run as early as possible; if DOM already ready, run now */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", mountNavbar);
  } else {
    mountNavbar();
  }
})();
