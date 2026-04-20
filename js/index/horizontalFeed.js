document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".feed-container").forEach(container => {
    const track = container.querySelector(".feed-track");
    if (!track) return;

    const centerCard = track.querySelector(".center-card");
    let isDragging = false, hasDragged = false;
    let startX = 0, dragStartX = 0, currentX = 0;
    let oldDragX = 0, velocity = 0;

    // Tính toán giới hạn kéo
    const clamp = (x) => Math.max(Math.min(0, container.clientWidth - track.scrollWidth), Math.min(0, x));
    
    // Hàm di chuyển chính sử dụng GSAP để xử lý độ mượt
    const moveTo = (x, duration = 0.1) => {
      currentX = clamp(x);
      gsap.to(track, { x: currentX, duration, ease: "power2.out", overwrite: true });
    };

    const refreshBounds = (shouldCenter = false, immediate = false) => {
      let startPos = currentX;
      if (shouldCenter && !hasDragged && centerCard) {
         startPos = (container.clientWidth / 2) - (centerCard.offsetLeft + centerCard.offsetWidth / 2);
      }
      moveTo(startPos, immediate ? 0 : 0.8); // Dùng 0 để nhảy ngay vị trí lập tức
    };

    const startDrag = (x) => {
      isDragging = true;
      hasDragged = true;
      startX = x;
      dragStartX = currentX;
      oldDragX = dragStartX;
      velocity = 0;
      
      container.classList.add("is-dragging");
      gsap.killTweensOf(track); // Dừng lại tức thời khi chạm tay (hoặc chuột)
    };

    const doDrag = (x) => {
      if (!isDragging) return;
      const targetX = dragStartX + (x - startX) * 1.5;
      velocity = targetX - oldDragX; // Tính vận tốc văng
      oldDragX = targetX;
      
      // Update mượt mà (bám chuột với chút độ nảy)
      moveTo(targetX, 0.15);
    };

    const endDrag = () => {
      if (!isDragging) return;
      isDragging = false;
      container.classList.remove("is-dragging");
      
      // Hiệu ứng "Trớn" (Momentum / Fling) khi thả tay ra
      moveTo(currentX + velocity * 15, 0.8); 
    };

    // Chuột
    container.addEventListener("mousedown", e => { if (e.button === 0) { startDrag(e.pageX); e.preventDefault(); } });
    window.addEventListener("mousemove", e => doDrag(e.pageX));
    window.addEventListener("mouseup", endDrag);
    container.addEventListener("mouseleave", endDrag);

    // Cảm ứng (Touch)
    container.addEventListener("touchstart", e => startDrag(e.touches[0].pageX), { passive: true });
    container.addEventListener("touchmove", e => doDrag(e.touches[0].pageX), { passive: true });
    container.addEventListener("touchend", endDrag, { passive: true });
    container.addEventListener("touchcancel", endDrag, { passive: true });

    track.querySelectorAll("img").forEach(img => img.addEventListener("dragstart", e => e.preventDefault()));
    window.addEventListener("resize", () => refreshBounds(true, true)); // Khi resize cũng nên nhảy luôn để tránh rung mượt quá mức

    const initReadyState = () => { refreshBounds(true, true); container.classList.add("feed-ready"); };

    refreshBounds(true, true); // Gọi nhảy ngay ở frame đầu tiên
    requestAnimationFrame(initReadyState);
    if (document.fonts?.ready) document.fonts.ready.then(() => refreshBounds(true, true));
  });
});
