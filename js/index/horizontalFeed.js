document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".feed-container").forEach(container => {
    const track = container.querySelector(".feed-track");
    if (!track) return;

    const centerCard = track.querySelector(".center-card");
    let isDragging = false, hasDragged = false, startX = 0, dragStartTranslateX = 0, currentTranslateX = 0;

    const clamp = (x) => Math.max(Math.min(0, container.clientWidth - track.scrollWidth), Math.min(0, x));
    
    const applyTranslate = (x) => {
      currentTranslateX = clamp(x);
      track.style.transform = `translate3d(${currentTranslateX}px, 0, 0)`;
    };

    const refreshBounds = (shouldCenter = false) => {
      applyTranslate(shouldCenter && !hasDragged && centerCard 
        ? (container.clientWidth / 2) - (centerCard.offsetLeft + centerCard.offsetWidth / 2) 
        : currentTranslateX);
    };

    const startDrag = (x) => {
      isDragging = true;
      hasDragged = true;
      startX = x;
      dragStartTranslateX = currentTranslateX;
      container.classList.add("is-dragging");
    };

    const endDrag = () => {
      isDragging = false;
      container.classList.remove("is-dragging");
    };

    container.addEventListener("mousedown", e => { if (e.button === 0) { startDrag(e.pageX); e.preventDefault(); } });
    window.addEventListener("mousemove", e => isDragging && applyTranslate(dragStartTranslateX + (e.pageX - startX) * 1.2));
    window.addEventListener("mouseup", endDrag);
    container.addEventListener("mouseleave", endDrag);

    container.addEventListener("touchstart", e => e.touches.length && startDrag(e.touches[0].pageX), { passive: true });
    container.addEventListener("touchmove", e => isDragging && e.touches.length && applyTranslate(dragStartTranslateX + (e.touches[0].pageX - startX) * 1.2), { passive: true });
    container.addEventListener("touchend", endDrag, { passive: true });
    container.addEventListener("touchcancel", endDrag, { passive: true });

    track.querySelectorAll("img").forEach(img => img.addEventListener("dragstart", e => e.preventDefault()));
    window.addEventListener("resize", () => refreshBounds(true));

    const initReadyState = () => { refreshBounds(true); container.classList.add("feed-ready"); };

    refreshBounds(true);
    requestAnimationFrame(initReadyState);
    if (document.fonts?.ready) document.fonts.ready.then(() => refreshBounds(true));
    
    if (document.readyState === "complete") container.classList.add("feed-ready");
    else window.addEventListener("load", initReadyState, { once: true });
  });
});
