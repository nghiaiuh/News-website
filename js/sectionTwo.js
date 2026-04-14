document.addEventListener("DOMContentLoaded", function () {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  let section = document.querySelector(".news-section-two");

  if (!section) return;

  let viewport = section.querySelector(".news-s2-viewport");
  let track = section.querySelector(".news-s2-track");
  let progressBar = section.querySelector(".news-s2-progress-bar");

  if (!viewport || !track) return;

  let mm = gsap.matchMedia();

  function setProgress(value) {
    if (!progressBar) return;
    let safe = Math.max(0, Math.min(1, value));
    progressBar.style.transform = "scaleX(" + safe + ")";
  }

  mm.add("(min-width: 992px)", function () {
    setProgress(0);

    let tween = gsap.to(track, {
      x: function () {
        return -Math.max(0, track.scrollWidth - viewport.clientWidth);
      },
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: function () {
          return "+=" + Math.max(0, track.scrollWidth - viewport.clientWidth);
        },
        pin: section,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
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

