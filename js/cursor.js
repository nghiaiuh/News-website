/* LERP: công thức bắt chuột mượt */

(function () {
  var cursor = document.getElementById("news-cursor");
  if (!cursor) return;

  var supportsMatchMedia = typeof window.matchMedia === "function";
  var prefersReducedMotion = supportsMatchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
    : false;
  var coarsePointer = supportsMatchMedia
    ? window.matchMedia("(hover: none) and (pointer: coarse)").matches
    : false;

  if (prefersReducedMotion || coarsePointer) return;

  // Vị trí đang hiển thị, khởi tạo giữa màn hình
  var posX = window.innerWidth / 2;
  var posY = window.innerHeight / 2;

  // Khởi tạo vị trí thật
  var mouseX = posX;
  var mouseY = posY;

  // Hệ số làm mượt (60fps)
  var BASE_EASE = 0.6;
  // Lưu thời điểm frame trước để tính delta time
  var lastTime = performance.now();

  // Lắng nghe sự kiện di chuyển chuột, lấy toạ độ của chuột thật realtime
  document.addEventListener(
    "mousemove",      //mousemove, mouseover, mouseleave, mouseenter,...
    function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    },
    { passive: true }
  );

  function tick(now) {
    if (document.hidden) {
      lastTime = now;
      requestAnimationFrame(tick);
      return;
    }

    var dt = Math.min(now - lastTime, 40);  //Tính time giữa 2 frame, đặt max là 40 (tránh lag khi time giữa 2 frame quá lớn (bị lag))
    lastTime = now; //Cập nhật lại cột mốc tgian
    //Tính hệ só di chuyển theo thời gian (tối ưu hoá BASE_EASE cho mọi fps)
    var alpha = 1 - Math.pow(1 - BASE_EASE, dt / 16.67);

    // Nội suy tuyến tính để tạo đuôi bám mượt -> đi chậm hơn
    posX += (mouseX - posX) * alpha;
    posY += (mouseY - posY) * alpha;

    // Dùng GSAP set để biến đổi trên GPU, giúp mượt hơn
    if (typeof gsap !== "undefined") {  //Kiểm tra có GSAP không?
      gsap.set(cursor, { x: posX, y: posY, force3D: true });
    }
    else { //css truyền thống
      cursor.style.transform ="translate(" +
        (posX - cursor.offsetWidth / 2) +
        "px, " +
        (posY - cursor.offsetHeight / 2) +
        "px)";
        //translate(Xpx, Ypy);
    }

    requestAnimationFrame(tick);  //callback
  }

  requestAnimationFrame(tick);






  // ──────── Phóng to khi di chuột trên phần tử tương tác ────────
  
  //Quy định những nơi được hover
  var phan_tu_duoc_chon_hover =
    "a, button, [role='button'], input, textarea, select, label, .news-feed-card";

  function addHoverListeners(el) {
    el.addEventListener("mouseenter", function () {
      cursor.classList.add("news-cursor--hover");
    });
    el.addEventListener("mouseleave", function () {
      cursor.classList.remove("news-cursor--hover");
    });
  }

  document.querySelectorAll(phan_tu_duoc_chon_hover).forEach(addHoverListeners);

  // Khi vào elements được chọn -> hover bật
  // Hỗ trợ cả phần tử được thêm động bằng cơ chế ủy quyền sự kiện
  document.addEventListener("mouseover", function (e) {
    if (
      e.target.matches(phan_tu_duoc_chon_hover) ||
      e.target.closest(phan_tu_duoc_chon_hover)
    ) {
      cursor.classList.add("news-cursor--hover");
    }
  });

  // Khi ra khỏi elements được chọn -> hover tắt
  document.addEventListener("mouseout", function (e) {
    if (
      e.target.matches(phan_tu_duoc_chon_hover) ||
      e.target.closest(phan_tu_duoc_chon_hover)
    ) {
      cursor.classList.remove("news-cursor--hover");
    }
  });

  // ──── Ẩn cursor khi rời khỏi màn hình web ────────
  document.addEventListener("mouseleave", function () {
    //Dùng gsap để tối ưu
    if (typeof gsap !== "undefined") {
      gsap.to(cursor,
        {
          opacity: 0,
          duration: 0.2
        }
      );
    }
    else { //css truyền thống
      cursor.style.opacity = "0";
    }
  });
  // Hiện cursor Khi vào màn hình web
  document.addEventListener("mouseenter", function () {
    if (typeof gsap !== "undefined") {
      gsap.to(cursor,
        {
          opacity: 1,
          duration: 0.2
        }
      );
    }
    else {  //css truyền thống
      cursor.style.opacity = "1";
    }
  });
})();


