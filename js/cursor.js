// ── Con trỏ tròn tùy biến (GSAP + rAF nội suy) ─────────────────────────────
(function () {
  var cursor = document.getElementById("nw-cursor");
  if (!cursor) return;

  // Vị trí đang hiển thị (đích nội suy)
  var posX = window.innerWidth / 2;
  var posY = window.innerHeight / 2;

  // Vị trí chuột thô
  var mouseX = posX;
  var mouseY = posY;

  // Hệ số làm mượt gốc cho 60fps (sau đó đổi sang alpha độc lập tốc độ khung hình ở dưới)
  var BASE_EASE = 0.6;
  var lastTime = performance.now();

  // Cập nhật tọa độ chuột ở mỗi lần di chuyển
  document.addEventListener(
    "mousemove",
    function (e) {
      mouseX = e.clientX;
      mouseY = e.clientY;
    },
    { passive: true }
  );

  // Vòng lặp rAF: nội suy về phía chuột rồi cập nhật vị trí con trỏ
  function tick(now) {
    // Làm mượt độc lập FPS giúp chuyển động ổn định trên nhiều tốc độ khung hình.
    var dt = Math.min(now - lastTime, 40);
    lastTime = now;
    var alpha = 1 - Math.pow(1 - BASE_EASE, dt / 16.67);

    // Nội suy tuyến tính để tạo đuôi bám mượt
    posX += (mouseX - posX) * alpha;
    posY += (mouseY - posY) * alpha;

    // Dùng GSAP set để biến đổi trên GPU, tránh rung lắc bố cục
    if (typeof gsap !== "undefined") {
      gsap.set(cursor, { x: posX, y: posY, force3D: true });
    } else {
      cursor.style.transform =
        "translate(" +
        (posX - cursor.offsetWidth / 2) +
        "px, " +
        (posY - cursor.offsetHeight / 2) +
        "px)";
    }

    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);

  // ── Phóng to khi di chuột trên phần tử tương tác ───────────────────
  var interactiveSelectors =
    "a, button, [role='button'], input, textarea, select, label, .nw-video-card";

  document.querySelectorAll(interactiveSelectors).forEach(addHoverListeners);

  // Hỗ trợ cả phần tử được thêm động bằng cơ chế ủy quyền sự kiện
  document.addEventListener("mouseover", function (e) {
    if (
      e.target.matches(interactiveSelectors) ||
      e.target.closest(interactiveSelectors)
    ) {
      cursor.classList.add("nw-cursor--hover");
    }
  });

  document.addEventListener("mouseout", function (e) {
    if (
      e.target.matches(interactiveSelectors) ||
      e.target.closest(interactiveSelectors)
    ) {
      cursor.classList.remove("nw-cursor--hover");
    }
  });

  function addHoverListeners(el) {
    el.addEventListener("mouseenter", function () {
      cursor.classList.add("nw-cursor--hover");
    });
    el.addEventListener("mouseleave", function () {
      cursor.classList.remove("nw-cursor--hover");
    });
  }

  // ── Ẩn con trỏ khi rời khỏi cửa sổ ─────────────────────────────────
  document.addEventListener("mouseleave", function () {
    if (typeof gsap !== "undefined") {
      gsap.to(cursor, { opacity: 0, duration: 0.2 });
    } else {
      cursor.style.opacity = "0";
    }
  });

  document.addEventListener("mouseenter", function () {
    if (typeof gsap !== "undefined") {
      gsap.to(cursor, { opacity: 1, duration: 0.2 });
    } else {
      cursor.style.opacity = "1";
    }
  });
})();
