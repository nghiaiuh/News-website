$(() => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  const section = $(".s5-section")[0];
  const natureFeed = section.querySelector(".s5-nature-feed");

  // Initial state cho Nature feed
  gsap.set(natureFeed, { yPercent: 120, opacity: 0 });

  // ScrollTrigger trigger trên toàn bộ chiều dài section (300vh)
  // KHÔNG có pin vì .s5-sticky-wrap đã xử lý bằng CSS position: sticky
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: section,
      start: "top top",       // Khi top section chạm top viewport
      end: "bottom bottom",   // Khi bottom section chạm bottom viewport (= hết 300vh)
      scrub: 1,               // Animation chạy mượt theo scroll
      invalidateOnRefresh: true,
    }
  });

  // 1. Phóng to ảnh trung tâm thành full viewport
  tl.to(".item-center", {
    width: "96vw",
    height: "94vh",
    borderRadius: "14px",
    top: "3vh",
    left: "2vw",
    xPercent: 0,
    yPercent: 0,
    x: 0,
    y: 0,
    duration: 1,
    ease: "power2.inOut"
  }, 0);

  // 2. Các ảnh phụ văng ra ngoài viewport
  tl.to(".item-tl", {
    xPercent: -200,
    yPercent: -200,
    duration: 1,
    ease: "power2.inOut"
  }, 0);

  // ── 4. item-tr: bay Phải + Lên ────────────────────────────────────────────
  tl.to(".item-tr", {
    xPercent: 200,
    yPercent: -200,
    duration: 1,
    ease: "power2.inOut"
  }, 0);

  // ── item-bl: bay Trái + Xuống ───────────────────────────────────────── (Phục hồi)
  tl.to(".item-bl", {
    xPercent: -200,
    yPercent: 200,
    duration: 1,
    ease: "power2.inOut"
  }, 0);

  // ── 5. item-br: bay Phải + Xuống ─────────────────────────────────────────
  tl.to(".item-br", {
    xPercent: 200,
    yPercent: 200,
    duration: 1,
    ease: "power2.inOut"
  }, 0);

  // ── 6. item-tr1 (mới thêm): bay Phải + Lên (mạnh hơn xíu để ra khỏi màn hình) ──
  tl.to(".item-tr1", {
    xPercent: 150,
    yPercent: -200,
    duration: 1,
    ease: "power2.inOut"
  }, 0);

  // ── 7. item-bl1 (mới thêm): bay Trái + Xuống ─────────────────────────────
  tl.to(".item-bl1", {
    xPercent: -150,
    yPercent: 200,
    duration: 1,
    ease: "power2.inOut"
  }, 0);

  // ── 8. Nature Feed trồi lên từ phía dưới (ở giữa chặng animation) ───────
  tl.to(natureFeed, {
    yPercent: 0,
    opacity: 1,
    duration: 0.5,
    ease: "power2.out"
  }, 0.5);

  // Refresh sau khi load xong ảnh
  window.addEventListener("load", () => requestAnimationFrame(() => ScrollTrigger.refresh()), { once: true });
});
