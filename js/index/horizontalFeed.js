$(() => {
  $(".feed-container, .s5-nature-feed, .news-feed").each(function() {
    const $container = $(this);
    const $track = $container.find(".feed-track, .s5-feed-track");
    if (!$track.length) return;
    if ($container.hasClass("s5-nature-feed")) {
      $container.css({ overflow: "hidden", cursor: "grab", "touch-action": "pan-y" });
      $track.removeClass("overflow-x-auto").css("width", "max-content");
    }
    // vu-tru-va-thien-nhien
    if ($container.hasClass("news-feed")) {
      $container.css({ overflow: "hidden", cursor: "grab", "touch-action": "pan-y" });
      $track.removeClass("overflow-x-auto").css("width", "max-content");
    }

    const $centerCard = $track.find(".center-card");
    const $children = $track.children();
    
    // --- Thiết lập Vòng lặp Vô Tận (Infinite Loop) ---
    // Nhân bản nội dung thành 3 phần: [Left Clone] - [Original] - [Right Clone]
    const $cloneLeft = $children.clone(true).addClass("is-clone").removeAttr("id");
    const $cloneRight = $children.clone(true).addClass("is-clone").removeAttr("id");
    $track.prepend($cloneLeft).append($cloneRight);
    
    const $origFirst = $children.eq(0); 
    const $cloneRightFirst = $cloneRight.eq(0);
    
    let wrapWidth = 0;
    const calculateWrap = () => {
       if (!$cloneRightFirst.length || !$origFirst.length) return;
       // wrapWidth = khoảng cách chính xác từ mảng gốc tới mảng bên phải
       wrapWidth = $cloneRightFirst[0].offsetLeft - $origFirst[0].offsetLeft;
    };

    let isDragging = false, hasDragged = false, isRealDrag = false;
    let startX = 0, currentX = 0, velocity = 0;

    const refreshBounds = (shouldCenter = false) => {
      calculateWrap();
      if (!wrapWidth) return; 

      let startPos = currentX || -wrapWidth; // Mặc định ở phần Original
      
      if (shouldCenter && !hasDragged && $centerCard.length) {
         startPos = ($container.innerWidth() / 2) - ($centerCard[0].offsetLeft + $centerCard.outerWidth() / 2);
      }
      
      // Ghìm vị trí bắt buộc vào "vùng an toàn" hiển thị mượt mà [-2*wrapWidth, -wrapWidth)
      let temp = ((startPos % wrapWidth) + wrapWidth) % wrapWidth;
      currentX = temp - wrapWidth * 2;
      
      gsap.set($track[0], { x: currentX });
    };

    const dragStart = x => {
      isDragging = hasDragged = true;
      isRealDrag = false;
      startX = x;
      velocity = 0;
      $container.addClass("is-dragging").css("cursor", "grabbing");
      gsap.killTweensOf($track[0]);
    };

    const doDrag = x => {
      if (!isDragging) return;
      if (Math.abs(x - startX) > 5) isRealDrag = true; // Chống lỡ click khi kéo
      
      // Lấy X hiện tại của DOM (phòng khi tween cũ chưa dừng hẳn do click nhanh)
      let domX = parseFloat(gsap.getProperty($track[0], "x")) || currentX;
      const deltaX = (x - startX) * 1.5; // Hệ số nhân lướt
      startX = x; // Consume X
      
      let targetX = domX + deltaX;
      velocity = deltaX; 
      
      // Wrap tức thời, âm thầm bẻ lái DOM mà không gây giật
      if (targetX > -wrapWidth) {
         targetX -= wrapWidth;
         domX -= wrapWidth;
         gsap.set($track[0], { x: domX }); 
      } else if (targetX < -wrapWidth * 2) {
         targetX += wrapWidth;
         domX += wrapWidth;
         gsap.set($track[0], { x: domX });
      }
      
      currentX = targetX;
      gsap.to($track[0], { x: currentX, duration: 0.15, ease: "power2.out", overwrite: true });
    };

    const dragEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      $container.removeClass("is-dragging").css("cursor", "grab");
      
      let finalX = currentX + velocity * 15;
      
      // Vung tay theo quán tính, dùng Modifiers để wrap mượt chạy liên tục không điểm viền
      gsap.to($track[0], { 
        x: finalX, 
        duration: 0.8, 
        ease: "power2.out", 
        overwrite: true,
        modifiers: {
          x: function(x_val) {
             if (!wrapWidth) return x_val;
             let val = parseFloat(x_val);
             let temp = ((val % wrapWidth) + wrapWidth) % wrapWidth;
             return (temp - wrapWidth * 2) + "px";
          }
        },
        onUpdate: function() {
           currentX = parseFloat(gsap.getProperty($track[0], "x"));
        }
      });
    };

    // Chuột tại container & Touch (Mobile)
    $container.on({
      mousedown: e => { if (e.button === 0) { dragStart(e.pageX); e.preventDefault(); } },
      mouseleave: dragEnd,
      touchstart: e => dragStart(e.originalEvent.touches[0].pageX),
      touchmove: e => doDrag(e.originalEvent.touches[0].pageX),
      "touchend touchcancel": dragEnd
    });
    
    // Bắt sự kiện chuột di chuyển toàn màn hình
    $(window).on({
      mousemove: e => doDrag(e.pageX),
      mouseup: dragEnd,
      resize: () => refreshBounds(false) 
    });

    // Vô hiệu mặc định trình duyệt để UX sạch sẽ
    $track.find("img").on("dragstart", e => e.preventDefault());
    $track.find("a").on("click", e => { if (isRealDrag) { e.preventDefault(); e.stopImmediatePropagation(); } });

    // Init khởi động
    setTimeout(() => refreshBounds(true), 100);
    $container.addClass("feed-ready");
    if (document.fonts?.ready) document.fonts.ready.then(() => refreshBounds(true));
  });
});

