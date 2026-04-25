/**
 * FLOW INFINITE DRAG SCROLL
 * ─────────────────────────────────────────────────────
 * INIT   : Tìm containers → clone track ×2 (trái|gốc|phải)
 *          → tính wrapWidth → căn giữa center-card → bind events
 *
 * DRAG   : dragStart → lưu startX, kill tween
 *          doDrag    → tính delta (×1.5), cập nhật X, wrap nếu vượt biên
 *          dragEnd   → glide quán tính (velocity×15), modifier wrap liên tục
 *
 * WRAP   : Vùng an toàn = [-2×W, -W)
 *          Vượt phải (> -W)   → X -= wrapWidth   ┐ gsap.set() âm thầm,
 *          Vượt trái (< -2×W) → X += wrapWidth   ┘ không giật hình
 *
 * GUARD  : isRealDrag > 5px → block click trên <a>
 *          img dragstart disabled, resize → recalc wrapWidth
 * ─────────────────────────────────────────────────────
 */
$(() => {
  // Khởi tạo infinite drag scroll cho tất cả feed containers
  $(".s1-feed-container, .s5-nature-feed, .news-feed").each(function () {
    const $container = $(this);
    const $track = $container.find(".s1-feed-track, .s5-feed-track");
    if (!$track.length) return;

    // Ẩn overflow & bật cursor grab cho các feed dạng ngang
    if ($container.is(".s5-nature-feed, .news-feed")) {
      $container.css({ overflow: "hidden", cursor: "grab", "touch-action": "pan-y" });
      $track.removeClass("overflow-x-auto").css("width", "max-content");
    }

    // ─── Infinite Loop Setup ────────────────────────────────────────────────
    // Cấu trúc: [Clone trái] | [Original] | [Clone phải]
    // → Khi kéo ra ngoài biên, âm thầm teleport sang phần kế tiếp → vô tận
    const $children = $track.children();
    $track
      .prepend($children.clone(true).addClass("is-clone").removeAttr("id"))
      .append($children.clone(true).addClass("is-clone").removeAttr("id"));

    // Dùng 2 mốc này để tính wrapWidth = độ dài 1 vòng lặp
    const $origFirst  = $children.eq(0);
    const $cloneRight = $track.children(".is-clone").last().eq(0);

    let wrapWidth = 0;
    const calcWrap = () => {
      wrapWidth = $cloneRight[0]?.offsetLeft - $origFirst[0]?.offsetLeft || 0;
    };

    // ─── State ──────────────────────────────────────────────────────────────
    let isDragging = false;   // Đang giữ chuột/chạm
    let isRealDrag = false;   // Phân biệt drag thật vs click bình thường
    let hasDragged = false;   // Đã từng drag chưa (để giữ center card lần đầu)
    let startX = 0, currentX = 0, velocity = 0;

    // ─── Vị trí ban đầu ─────────────────────────────────────────────────────
    // Ghìm X vào "vùng an toàn" [-2*wrapWidth, -wrapWidth) để wrap hoạt động đúng
    const clampToSafeZone = (x) => {
      const mod = ((x % wrapWidth) + wrapWidth) % wrapWidth;
      return mod - wrapWidth * 2;
    };

    const refreshBounds = (shouldCenter = false) => {
      calcWrap();
      if (!wrapWidth) return;

      let x = currentX || -wrapWidth; // Mặc định: hiển thị phần Original

      // Lần đầu load: căn giữa vào .center-card nếu có
      if (shouldCenter && !hasDragged) {
        const $cc = $track.find(".center-card");
        if ($cc.length)
          x = $container.innerWidth() / 2 - ($cc[0].offsetLeft + $cc.outerWidth() / 2);
      }

      currentX = clampToSafeZone(x);
      gsap.set($track[0], { x: currentX });
    };

    // ─── Drag Handlers ──────────────────────────────────────────────────────
    const dragStart = (x) => {
      isDragging = hasDragged = true;
      isRealDrag = false;
      startX = x;
      velocity = 0;
      $container.css("cursor", "grabbing");
      gsap.killTweensOf($track[0]); // Dừng mọi animation đang chạy
    };

    const doDrag = (x) => {
      if (!isDragging) return;
      if (Math.abs(x - startX) > 5) isRealDrag = true; // Ngưỡng phân biệt drag vs click

      // Đọc X thực từ DOM (tween cũ có thể chưa settle hoàn toàn)
      let domX = parseFloat(gsap.getProperty($track[0], "x")) || currentX;
      const delta = (x - startX) * 1.5; // Hệ số nhân tốc độ lướt
      startX = x; // Consume để delta tính incremental

      let targetX = domX + delta;
      velocity = delta;

      // Teleport âm thầm khi vượt biên → không giật, không lộ đầu/cuối
      if (targetX > -wrapWidth) { targetX -= wrapWidth; domX -= wrapWidth; }
      else if (targetX < -wrapWidth * 2) { targetX += wrapWidth; domX += wrapWidth; }

      gsap.set($track[0], { x: domX }); // Cập nhật điểm xuất phát tween
      currentX = targetX;
      gsap.to($track[0], { x: currentX, duration: 0.15, ease: "power2.out", overwrite: true });
    };

    const dragEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      $container.css("cursor", "grab");

      // Glide theo quán tính sau khi thả, modifier giữ wrap liên tục
      gsap.to($track[0], {
        x: currentX + velocity * 15,
        duration: 0.8,
        ease: "power2.out",
        overwrite: true,
        modifiers: {
          x: (val) => {
            if (!wrapWidth) return val;
            return clampToSafeZone(parseFloat(val)) + "px";
          },
        },
        onUpdate() {
          currentX = parseFloat(gsap.getProperty($track[0], "x"));
        },
      });
    };

    // ─── Event Binding ──────────────────────────────────────────────────────
    $container.on({
      mousedown:            (e) => { if (e.button === 0) { dragStart(e.pageX); e.preventDefault(); } },
      mouseleave:           dragEnd,
      touchstart:           (e) => dragStart(e.originalEvent.touches[0].pageX),
      touchmove:            (e) => doDrag(e.originalEvent.touches[0].pageX),
      "touchend touchcancel": dragEnd,
    });

    $(window).on({
      mousemove: (e) => doDrag(e.pageX),
      mouseup:   dragEnd,
      resize:    () => refreshBounds(false),
    });

    // Chặn drag ảnh mặc định & block click nếu đang drag thật
    $track.find("img").on("dragstart", (e) => e.preventDefault());
    $track.find("a").on("click", (e) => { if (isRealDrag) { e.preventDefault(); e.stopImmediatePropagation(); } });

    // ─── Init ───────────────────────────────────────────────────────────────
    setTimeout(() => refreshBounds(true), 100);
    $container.addClass("feed-ready");
    document.fonts?.ready.then(() => refreshBounds(true)); // Re-center sau khi font load xong
  });
});