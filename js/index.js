document.addEventListener("DOMContentLoaded", function () {
  if (typeof gsap === "undefined") return;

  // ── Tham chiếu phần tử ───────────────────────────────────────────────────
  var overlay = document.getElementById("nw-intro-overlay");
  var introText = document.getElementById("nw-intro-text");
  var wipeLayer = document.querySelector(".nw-it-wipe");
  var anchor = document.getElementById("nw-dt-anchor");
  var dtTitle = document.getElementById("nw-dt-title");   // tiêu đề thật của trang
  var videoCol = document.querySelector(".nw-video-col");
  var videoCardEl = document.querySelector(".nw-video-card");
  var videoYearBadge = document.querySelector(".nw-year-badge");
  var navbarEl = document.querySelector(".nw-header");

  if (!overlay || !introText || !wipeLayer || !anchor) return;

  var revealEls = Array.prototype.slice.call(
    document.querySelectorAll("[data-page-reveal]")
  );
  var anchorRevealEl = anchor.closest("[data-page-reveal]");
  var heroRevealEl = document.querySelector(".nw-hero[data-page-reveal]");
  var revealTweenEls = revealEls.filter(function (el) {
    // Loại anchor, navbar và hero khỏi nhóm reveal chung.
    // Hero cần hiển thị sớm để animation video không bị parent che mất.
    return el !== anchorRevealEl && el !== navbarEl && el !== heroRevealEl;
  });
  var revealScaleEls = revealTweenEls.filter(function (el) {
    // Không animate phần tử cha của điểm neo trong nhóm scale chung.
    return !el.contains(anchor);
  });

  // Giữ tiêu đề thật luôn sẵn sàng để tránh hiệu ứng biến mất rồi hiện lại.
  gsap.set(introText, { transformOrigin: "center center", force3D: true });

  // Đưa toàn bộ line-inner về trạng thái ẩn ban đầu.
  // y: "110%" đặt chúng nằm ngay dưới vùng cắt overflow của .nw-line-wrap.
  // Chúng chỉ hiện khi section cha được bật autoAlpha = 1 ở Giai đoạn 3.
  gsap.set(".nw-line-inner", { y: "110%" });

  // Hiệu ứng thước tách dọc: bắt đầu co ở giữa (scaleY: 0),
  // các span được đặt lệch sẵn để khi hiện sẽ tách dọc lên/xuống.
  gsap.set(".nw-ruler", { scaleY: 0, autoAlpha: 0 });
  // Span đầu đi lên vị trí chuẩn, span sau đi xuống vị trí chuẩn.
  gsap.set(".nw-ruler-inner span:first-child", { y: 16 });
  gsap.set(".nw-ruler-inner span:last-child", { y: -16 });

  // Khối video dùng timeline riêng: ẩn trước để vào sau với nhịp khác.
  if (heroRevealEl) {
    gsap.set(heroRevealEl, { autoAlpha: 1 });
  }
  if (videoCol) {
    gsap.set(videoCol, {
      transformOrigin: "top right",
      force3D: true,
    });
  }
  if (videoCardEl) {
    gsap.set(videoCardEl, {
      transformOrigin: "top right",
      force3D: true,
    });
  }

  // ════════════════════════════════════════════════════════════════════════════
  //  DÒNG THỜI GIAN CHÍNH (liền mạch, không có khung hình chết)
  //
  //  Bản đồ giai đoạn:
  //   Giai đoạn 1: vào mềm (opacity 0→1, y -80→0, thấy lớp nền xám đậm)
  //   Giai đoạn 2: giữ nhịp ngắn (tối đa 0.4s), không dừng gắt
  //   Giai đoạn 3: di chuyển + thu phóng về điểm neo, lớp quét lộ chạy song song và kết thúc sớm hơn
  // ════════════════════════════════════════════════════════════════════════════
  var master = gsap.timeline({
    delay: 0.06,
  });

  // ── GIAI ĐOẠN 1 — Vào cảnh mềm (mờ dần + trôi xuống) ─────────────────────
  master.fromTo(
    introText,
    { y: -100, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: 2,
    }
  );

  // ── GIAI ĐOẠN 3 — Di chuyển + Thu phóng + Quét lộ (chồng hoàn toàn, không nghỉ) ──
  master.add(function () {
    // Chọn đích để "bay tới": ưu tiên dtTitle, nếu không có thì dùng điểm neo.
    var targetEl = dtTitle || anchor;

    // Tọa độ/kích thước của phần tử đích trong khung nhìn.
    var tRect = targetEl.getBoundingClientRect();

    // Tọa độ/kích thước hiện tại của chữ mở đầu trong khung nhìn.
    var iRect = introText.getBoundingClientRect();

    // Căn tâm chữ mở đầu trùng tâm đích để điểm kết thúc khớp tiêu đề thật.
    var moveX = (tRect.left + tRect.width / 2) - (iRect.left + iRect.width / 2);
    var moveY = (tRect.top + tRect.height / 2) - (iRect.top + iRect.height / 2);

    // Ưu tiên tính thu phóng theo tỷ lệ cỡ chữ; thiếu dữ liệu thì dùng phương án dự phòng theo chiều rộng.
    var sourceFont = wipeLayer ? parseFloat(getComputedStyle(wipeLayer).fontSize) : 0;
    var targetFont = dtTitle ? parseFloat(getComputedStyle(dtTitle).fontSize) : 0;
    var rawScale = (sourceFont > 0 && targetFont > 0)
      ? targetFont / sourceFont
      : (tRect.width / iRect.width);

    // Kẹp hệ số thu phóng trong ngưỡng an toàn để tránh phóng/thu quá cực đoan.
    var scaleTarget = Math.min(Math.max(rawScale, 0.25), 4);

    // Dòng thời gian con dành riêng cho Giai đoạn 3.
    var tl3 = gsap.timeline();

    // Thời lượng chuyển động chính của chữ mở đầu.
    var moveDuration = 1.12;

    // Lớp quét lộ ngắn hơn chuyển động chính để giữ cảm giác tiến về phía trước.
    var wipeDuration = 0.58;

    // Nhịp 1 (trùng wipe): đi chậm hơn để chờ lớp quét lộ hoàn tất.
    var slowPhaseDuration = Math.min(wipeDuration, moveDuration);

    // Nhịp 2 (sau wipe): trở về tốc độ bình thường cho đến điểm đích.
    var normalPhaseDuration = Math.max(moveDuration - slowPhaseDuration, 0.1);

    // Tại cuối nhịp chậm, chỉ đi một phần quãng đường để cảm giác "giữ nhịp" rõ hơn.
    var slowPhaseProgress = 0.42;
    var midX = moveX * slowPhaseProgress;
    var midY = moveY * slowPhaseProgress;
    var midScale = 1 + (scaleTarget - 1) * slowPhaseProgress;

    // Tạo nhãn mốc thời gian để đồng bộ nhiều đoạn chuyển động bắt đầu cùng lúc.
    tl3.add("introMoveStart");

    // Nhịp 1: scale/move chậm trong lúc wipe đang chạy.
    tl3.to(
      introText,
      {
        x: midX,
        y: midY,
        scale: midScale,
        duration: slowPhaseDuration,
        ease: "power1.in",
        force3D: true,
      },
      "introMoveStart"
    );

    // Nhịp 2: sau khi wipe xong, về lại tốc độ bình thường và hoàn tất ở đích.
    tl3.to(
      introText,
      {
        x: moveX,
        y: moveY,
        scale: scaleTarget,
        duration: normalPhaseDuration,
        ease: "power2.out",

        // Bật kết hợp 3D để phép biến đổi mượt hơn trên GPU.
        force3D: true,
      },
      "introMoveStart+=" + slowPhaseDuration
    );

    // Lớp quét lộ chạy đồng thời với chuyển động nhưng kết thúc sớm hơn để giữ nhịp tiến.
    tl3.to(
      wipeLayer,
      {
        // Mở lớp trắng từ phải (100%) về 0% bằng biến CSS của pseudo-element ::after.
        "--nw-wipe-right": "0%",
        duration: wipeDuration,
        ease: "power3.inOut",
      },
      "introMoveStart"
    );

    // Mốc hoàn tất chữ mở đầu: các hiệu ứng lộ nội dung chính chỉ chạy sau mốc này.
    tl3.add("introTextDone", "introMoveStart+=" + moveDuration);

    // ── Lộ trang: chỉ thu phóng vào (không mờ-trồi) ──────────────────────────
    tl3.set(revealTweenEls, { autoAlpha: 1 }, "introTextDone");

    if (navbarEl) {
      tl3.fromTo(
        navbarEl,
        { y: -100, autoAlpha: 0 },
        {
          y: 0,
          autoAlpha: 1,
          duration: 1,
          ease: "power2.out",
        },
        "introTextDone+=0.5"
      );
    }

    if (revealScaleEls.length) {
      tl3.from(
        revealScaleEls,
        { y: -100, opacity: 0 },
        "introTextDone+=0.2"
      );
    }

    // ── Video block ──
    var videoEndAt = 0.5;
    var videoStartAt = "introTextDone-=" + videoEndAt;

    if (videoCol) {
      var videoTl = gsap.timeline();
      var videoScaleTarget = videoCardEl || videoCol;

      videoTl.fromTo(
        videoScaleTarget,
        {
          autoAlpha: 1,
          scale: 0,
          transformOrigin: "top right",
        },
        {
          autoAlpha: 1,
          scale: 1,
          transformOrigin: "top right",
          duration: videoEndAt,
          ease: "expo.out",
          force3D: true,
        },
        0
      );

      tl3.add(videoTl, videoStartAt);
    }

    //    Bước B: quét lộ từ dưới lên, mỗi line-inner trượt từ 110% về 0 theo nhịp lệch.
    //             Bắt đầu sau khi phần mở đầu hoàn tất để điểm bàn giao rõ ràng.
    //             Mỗi dòng lệch 0.1s để tạo hiệu ứng đổ tầng điện ảnh.
    tl3.fromTo(
      ".nw-line-inner",
      { y: "110%" },
      {
        y: "0%",
        duration: 0.65,
        ease: "power4.out",
        stagger: 0.1,
      },
      "introTextDone+=0.2"
    );

    // ── Thước tách dọc ───────────────────────────────────────────────────────
    //    Nhịp: dùng cùng mốc với phần lộ trang (introTextDone+=0.05).
    //    Hiệu ứng: .nw-ruler bung dọc từ giữa (scaleY: 0 → 1),
    //              đồng thời hai span chữ tách dọc lên/xuống về vị trí tự nhiên.
    //
    //    Bước i: hiện ruler + bung thanh theo trục dọc từ tâm.
    tl3.to(
      ".nw-ruler",
      {
        scaleY: 1,
        autoAlpha: 1,
        duration: 0.65,
        ease: "power3.out",
        clearProps: "transform",  // dọn thuộc tính biến đổi nội tuyến để không ảnh hưởng bố cục về sau
      },
      "introTextDone+=0.5"   // bắt đầu cùng thời điểm với phần lộ trang
    );

    //    Bước ii: span đầu trượt từ y:16 về 0 (cảm giác bung lên).
    tl3.to(
      ".nw-ruler-inner span:first-child",
      {
        y: 0,
        duration: 0.55,
        ease: "expo.out",
      },
      "introTextDone+=0.5"   // chạy đồng thời với lúc thanh ruler bung ra
    );

    //    Bước iii: span cuối trượt từ y:-16 về 0 (cảm giác bung xuống).
    tl3.to(
      ".nw-ruler-inner span:last-child",
      {
        y: 0,
        duration: 0.55,
        ease: "expo.out",
      },
      "introTextDone+=0.5"   // cũng bắt đầu đồng thời với phần bung thanh
    );

    // Bật cứng tiêu đề đích ngay tại mốc bàn giao để "TIN TỨC ONLINE" không bị ẩn lại.
    if (anchorRevealEl) {
      tl3.set(anchorRevealEl, { autoAlpha: 1 }, "introTextDone");
    }
    if (dtTitle) {
      tl3.set(dtTitle, { autoAlpha: 1 }, "introTextDone");
    }

    // Tránh làm introText biến mất: chỉ fade nền đen của overlay,
    // không fade toàn bộ overlay (vì introText là con của overlay).
    var overlayFadeAt = videoCol ? videoStartAt : "introTextDone";
    var overlayFadeDuration = videoCol ? videoEndAt : 0.42;

    tl3.to(
      overlay,
      {
        backgroundColor: "rgba(0,0,0,0)",
        duration: overlayFadeDuration,
        ease: "power2.out",
      },
      overlayFadeAt
    );

    // Gỡ hẳn overlay ngay tại mốc bàn giao để không chặn tương tác.
    tl3.set(
      overlay,
      {
        display: "none",
      },
      "introTextDone"
    );

    // Gắn dòng thời gian con của Giai đoạn 3 vào dòng thời gian chính.
    master.add(tl3);
  });

  // ════════════════════════════════════════════════════════════════════════════
  //  TƯƠNG TÁC SAU MỞ ĐẦU (di chuột menu + nghiêng thẻ 3D)
  // ════════════════════════════════════════════════════════════════════════════

  // Nhấc nhẹ liên kết menu khi di chuột
  document.querySelectorAll(".nw-menu-link").forEach(function (link) {
    link.addEventListener("mouseenter", function () {
      gsap.to(link, { y: -2, duration: 0.2, overwrite: true });
    });
    link.addEventListener("mouseleave", function () {
      gsap.to(link, { y: 0, duration: 0.2, overwrite: true });
    });
  });

  // Nghiêng 3D cho thẻ video
  var card = document.querySelector(".nw-video-card");
  if (card) {
    var MAX_TILT = 5;
    var MAX_LIFT = -10;
    gsap.set(card, { transformStyle: "preserve-3d" });

    card.addEventListener("mousemove", function (e) {
      var rect = card.getBoundingClientRect();
      var normX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      var normY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      gsap.to(card, {
        rotationY: normX * MAX_TILT,
        rotationX: -normY * MAX_TILT,
        z: MAX_LIFT,
        duration: 0.35,
        ease: "power2.out",
        overwrite: true,
      });
    });

    card.addEventListener("mouseleave", function () {
      gsap.to(card, {
        rotationX: 0,
        rotationY: 0,
        z: 0,
        duration: 1.1,
        ease: "elastic.out(1, 0.55)",
        overwrite: true,
      });
    });
  }

  // ── Lộ bằng mặt nạ tròn (chuyển cảnh điện ảnh theo cuộn trang) ───────────
  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    var cmSection = document.getElementById("nw-cm-transition");
    if (cmSection) {
      var cmNextLayer = cmSection.querySelector(".nw-cm-next-layer");
      var cmRing = cmSection.querySelector(".nw-cm-ring");
      var cmRevealItems = cmSection.querySelectorAll("[data-cm-reveal]");

      // Trạng thái ban đầu: ẩn nội dung và đẩy xuống để chuẩn bị lộ ra.
      gsap.set(cmRevealItems, { autoAlpha: 0, y: 40, filter: "blur(8px)" });

      var cmTl = gsap.timeline({
        scrollTrigger: {
          // Ghim khối chuyển cảnh, dòng thời gian tiến theo vị trí cuộn.
          trigger: cmSection,
          start: "top top",
          end: "+=200%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Cơ chế mở rộng vòng tròn: chỉ chạy hiệu ứng clip-path (không chạy width/height)
      // để chuyển cảnh mượt và tránh tính lại bố cục.
      cmTl.to(
        cmNextLayer,
        {
          clipPath: "circle(150% at 50% 50%)",
          duration: 1.2,
          ease: "none",
        },
        0
      );

      // Nhấn nhá thêm: ánh sáng vòng tròn mờ dần khi mặt nạ đang mở rộng.
      cmTl.to(
        cmRing,
        {
          autoAlpha: 0,
          scale: 1.35,
          duration: 0.65,
          ease: "none",
        },
        0.24
      );

      // Chồng nhịp thời gian: bắt đầu lộ nội dung TRƯỚC khi vòng tròn mở xong.
      // Cách này loại bỏ khung hình chết và giữ chuyển động liên tục.
      cmTl.to(
        cmRevealItems,
        {
          autoAlpha: 1,
          y: 0,
          filter: "blur(0px)",
          stagger: 0.12,
          duration: 0.72,
          ease: "power3.out",
        },
        0.66
      );
    }
  }
});

