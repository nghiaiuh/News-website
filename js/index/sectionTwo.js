document.addEventListener("DOMContentLoaded", function () {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  let section = document.querySelector(".section-two, .news-section-two");

  if (!section) return;

  let viewport = section.querySelector(".s2-viewport, .news-s2-viewport");
  let track = section.querySelector(".s2-track, .news-s2-track");
  let progressBar = section.querySelector(".s2-progress-bar, .news-s2-progress-bar");
  let hoverPanelSelector = ".s2-lead-panel, .s2-data-panel";
  let hoverActiveClass = "s2-hover-active";
  let lastPointerX = null;
  let lastPointerY = null;
  let activeHoverPanel = null;

  if (!viewport || !track) return;

  let mm = gsap.matchMedia();

  function setProgress(value) {
    if (!progressBar) return;
    let safe = Math.max(0, Math.min(1, value));
    progressBar.style.transform = "scaleX(" + safe + ")";
  }

  function setActiveHoverPanel(panel) {
    if (activeHoverPanel === panel) return;

    if (activeHoverPanel) {
      activeHoverPanel.classList.remove(hoverActiveClass);
    }

    activeHoverPanel = panel || null;

    if (activeHoverPanel) {
      activeHoverPanel.classList.add(hoverActiveClass);
    }
  }

  function syncHoverFromPointerPosition() {
    if (lastPointerX === null || lastPointerY === null) {
      setActiveHoverPanel(null);
      return;
    }

    var target = document.elementFromPoint(lastPointerX, lastPointerY);
    if (!target || !section.contains(target)) {
      setActiveHoverPanel(null);
      return;
    }

    var panel = target.closest(hoverPanelSelector);
    if (!panel || !section.contains(panel)) {
      setActiveHoverPanel(null);
      return;
    }

    setActiveHoverPanel(panel);
  }

  mm.add("(min-width: 992px)", function () {
    setProgress(0);

    function updatePointerPosition(clientX, clientY) {
      lastPointerX = clientX;
      lastPointerY = clientY;
    }

    function handleMouseMove(event) {
      updatePointerPosition(event.clientX, event.clientY);
      syncHoverFromPointerPosition();
    }

    function handleWheel(event) {
      updatePointerPosition(event.clientX, event.clientY);
      syncHoverFromPointerPosition();
    }

    function handlePointerExit(event) {
      if (event && event.relatedTarget) {
        return;
      }

      lastPointerX = null;
      lastPointerY = null;
      setActiveHoverPanel(null);
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("wheel", handleWheel, { passive: true });
    window.addEventListener("mouseout", handlePointerExit);

    syncHoverFromPointerPosition();

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
          syncHoverFromPointerPosition();
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
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("wheel", handleWheel);
      window.removeEventListener("mouseout", handlePointerExit);
      lastPointerX = null;
      lastPointerY = null;
      setActiveHoverPanel(null);
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

