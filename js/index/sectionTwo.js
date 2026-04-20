document.addEventListener("DOMContentLoaded", () => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  const section = document.querySelector(".section-two, .news-section-two");
  if (!section) return;

  const viewport = section.querySelector(".s2-viewport, .news-s2-viewport");
  const track = section.querySelector(".s2-track, .news-s2-track");
  const progressBar = section.querySelector(".s2-progress-bar, .news-s2-progress-bar");

  if (!viewport || !track) return;

  let activeHoverPanel = null, lastPointerX = null, lastPointerY = null;

  const setProgress = (value) => {
    if (progressBar) progressBar.style.transform = `scaleX(${Math.max(0, Math.min(1, value))})`;
  };

  const setActiveHoverPanel = (panel) => {
    if (activeHoverPanel === panel) return;
    if (activeHoverPanel) activeHoverPanel.classList.remove("s2-hover-active");
    if ((activeHoverPanel = panel)) activeHoverPanel.classList.add("s2-hover-active");
  };

  const syncHoverFromPointerPosition = () => {
    if (lastPointerX === null || lastPointerY === null) return setActiveHoverPanel(null);
    const target = document.elementFromPoint(lastPointerX, lastPointerY);
    const panel = target?.closest(".s2-lead-panel, .s2-data-panel");
    setActiveHoverPanel(panel && section.contains(panel) ? panel : null);
  };

  const mm = gsap.matchMedia();

  mm.add("(min-width: 992px)", () => {
    setProgress(0);

    const handlePointerInfo = (e) => {
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      syncHoverFromPointerPosition();
    };

    const handlePointerExit = (e) => {
      if (e.relatedTarget) return;
      lastPointerX = lastPointerY = null;
      setActiveHoverPanel(null);
    };

    const events = ['mousemove', 'wheel'];
    events.forEach(evt => window.addEventListener(evt, handlePointerInfo, { passive: true }));
    window.addEventListener("mouseout", handlePointerExit);

    syncHoverFromPointerPosition();

    const getScrollOffset = () => Math.max(0, track.scrollWidth - viewport.clientWidth);

    const tween = gsap.to(track, {
      x: () => -getScrollOffset(),
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: () => `+=${getScrollOffset()}`,
        pin: section,
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          setProgress(self.progress);
          syncHoverFromPointerPosition();
        },
      },
    });

    requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
      events.forEach(evt => window.removeEventListener(evt, handlePointerInfo));
      window.removeEventListener("mouseout", handlePointerExit);
      lastPointerX = lastPointerY = null;
      setActiveHoverPanel(null);
      gsap.set(track, { clearProps: "transform" });
      setProgress(0);
    };
  });

  mm.add("(max-width: 991.98px)", () => {
    setProgress(1);
    return () => setProgress(0);
  });

  window.addEventListener("load", () => requestAnimationFrame(() => ScrollTrigger.refresh()), { once: true });
});