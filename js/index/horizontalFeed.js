$(() => {
  $(".feed-container").each(function() {
    const $container = $(this);
    const $track = $container.find(".feed-track");
    if (!$track.length) return;

    const $centerCard = $track.find(".center-card");
    let isDragging = false, hasDragged = false;
    let startX = 0, dragStartX = 0, currentX = 0, oldDragX = 0, velocity = 0;

    // Giới hạn trục X cuộn
    const clamp = x => Math.max(Math.min(0, $container.innerWidth() - $track[0].scrollWidth), Math.min(0, x));
    
    const moveTo = (x, duration = 0.1) => {
      currentX = clamp(x);
      gsap.to($track[0], { x: currentX, duration, ease: "power2.out", overwrite: true });
    };

    const refreshBounds = (shouldCenter = false) => {
      let startPos = currentX;
      if (shouldCenter && !hasDragged && $centerCard.length) {
         startPos = ($container.innerWidth() / 2) - ($centerCard[0].offsetLeft + $centerCard.outerWidth() / 2);
      }
      moveTo(startPos, 0);
    };

    const dragStart = x => {
      isDragging = hasDragged = true;
      startX = x; dragStartX = oldDragX = currentX; velocity = 0;
      $container.addClass("is-dragging");
      gsap.killTweensOf($track[0]);
    };

    const doDrag = x => {
      if (!isDragging) return;
      const targetX = dragStartX + (x - startX) * 1.5;
      velocity = targetX - oldDragX; 
      oldDragX = targetX;
      moveTo(targetX, 0.15);
    };

    const dragEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      $container.removeClass("is-dragging");
      moveTo(currentX + velocity * 15, 0.8); // Quán tính
    };

    // Chuột tại container & Touch (Mobile)
    $container.on({
      mousedown: e => { if (e.button === 0) { dragStart(e.pageX); e.preventDefault(); } },
      mouseleave: dragEnd,
      touchstart: e => dragStart(e.originalEvent.touches[0].pageX),
      touchmove: e => doDrag(e.originalEvent.touches[0].pageX),
      "touchend touchcancel": dragEnd
    });
    
    // Bắt sự kiện chuột di chuyển toàn màn hình (mượt hơn)
    $(window).on({
      mousemove: e => doDrag(e.pageX),
      mouseup: dragEnd,
      resize: () => refreshBounds(true)
    });

    $track.find("img").on("dragstart", e => e.preventDefault());

    // Init
    refreshBounds(true);
    $container.addClass("feed-ready");
    if (document.fonts?.ready) document.fonts.ready.then(() => refreshBounds(true));
  });
});

