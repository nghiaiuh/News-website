document.addEventListener("DOMContentLoaded", function () {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  var section = document.querySelector(".news-section-two");
  var titleWrap = document.querySelector(".news-title-wrap");
  var navbar = document.querySelector(".news-header");

  if (!section || !titleWrap) return;

  var viewport = section.querySelector(".news-s2-viewport");
  var track = section.querySelector(".news-s2-track");
  var progressBar = section.querySelector(".news-s2-progress-bar");

  if (!viewport || !track) return;

  var mm = gsap.matchMedia();
  var supportsMatchMedia = typeof window.matchMedia === "function";
  var prefersReducedMotion = supportsMatchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;

  function setProgress(value) {
    if (!progressBar) return;
    var safe = Math.max(0, Math.min(1, value));
    progressBar.style.transform = "scaleX(" + safe + ")";
  }

  if (prefersReducedMotion) {
    setProgress(1);
    return;
  }

  mm.add("(min-width: 992px)", function () {
    setProgress(0);

    var tween = gsap.to(track, {
      x: function () {
        return -Math.max(0, track.scrollWidth - viewport.clientWidth);
      },
      ease: "none",
      scrollTrigger: {
        trigger: titleWrap,
        start: function () {
          var navH = navbar ? navbar.offsetHeight : 0;
          return "bottom top+=" + navH;
        },
        end: function () {
          return "+=" + Math.max(0, track.scrollWidth - viewport.clientWidth);
        },
        pin: section,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        fastScrollEnd: true,
        onUpdate: function (self) {
          setProgress(self.progress);
        },
      },
    });

    requestAnimationFrame(function () {
      ScrollTrigger.refresh();
    });

    return function () {
      if (tween.scrollTrigger) {
        tween.scrollTrigger.kill();
      }
      tween.kill();
      gsap.set(track, { clearProps: "transform" });
      setProgress(0);
    };
  });

  mm.add("(max-width: 991.98px)", function () {
    setProgress(1);

    return function () {
      setProgress(0);
    };
  });

  window.addEventListener(
    "load",
    function () {
      requestAnimationFrame(function () {
        ScrollTrigger.refresh();
      });
    },
    { once: true }
  );
});

