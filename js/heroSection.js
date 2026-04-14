document.addEventListener("DOMContentLoaded", function () {
  function signalPageReady() {
    window.__nwPageReady = true;
    document.dispatchEvent(new CustomEvent("nw:page-ready"));
  }

  if (typeof ScrollTrigger === "undefined") {
    signalPageReady();
  } else {
    requestAnimationFrame(function () {
      ScrollTrigger.refresh();
      requestAnimationFrame(signalPageReady);
    });
  }

  var header = document.querySelector(".news-header");
  var mobileMenu = document.getElementById("nwMenu");

  if (header) {
    var lastScrollY = window.scrollY || window.pageYOffset || 0;
    var ticking = false;
    var hideAfter = 2;
    var delta = 1;

    function syncHeaderOnScroll() {
      var currentY = window.scrollY || window.pageYOffset || 0;
      var isMenuOpen = mobileMenu && mobileMenu.classList.contains("show");

      if (currentY <= 2) {
        header.classList.remove("news-header--hidden");
        lastScrollY = currentY;
        ticking = false;
        return;
      }

      if (!isMenuOpen) {
        var diff = currentY - lastScrollY;

        if (diff > delta && currentY > hideAfter) {
          header.classList.add("news-header--hidden");
        } else if (diff < -delta) {
          header.classList.remove("news-header--hidden");
        }
      } else {
        header.classList.remove("news-header--hidden");
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

    if (mobileMenu) {
      mobileMenu.addEventListener("show.bs.collapse", function () {
        header.classList.remove("news-header--hidden");
      });
    }
  }

  // ── GSAP Hover cho menu items (trừ logo) ──────────────────────────────
  if (typeof gsap !== "undefined") {
    const menuItems = document.querySelectorAll(
      ".news-main-menu .news-menu-item"
    );

    menuItems.forEach(function (item) {
      const link = item.querySelector(".news-menu-link");
      if (!link) return;

      // Đặt trạng thái ban đầu
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

    // ── GSAP Hover cho hamburger ──────────────────────────────────────────
    const hamburgerBtn = document.querySelector(".news-hamburger-btn");
    if (hamburgerBtn) {
      const topLine    = hamburgerBtn.querySelector(".news-ham-top");
      const bottomLine = hamburgerBtn.querySelector(".news-ham-bottom");

      gsap.set([topLine, bottomLine], { x: 0 });

      hamburgerBtn.addEventListener("mouseenter", function () {
        gsap.to(topLine, {
          x: 4,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
        gsap.to(bottomLine, {
          x: -4,
          duration: 0.3,
          ease: "power2.out",
          overwrite: "auto",
        });
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
});


