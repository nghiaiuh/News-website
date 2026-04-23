$(() => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  const section = $(".s5-section")[0];
  const natureFeed = section.querySelector(".s5-nature-feed");

  // Initial state cho Nature feed
  gsap.set(natureFeed, { yPercent: 120, opacity: 0 });

  let mm = gsap.matchMedia();

  mm.add("(min-width: 992px)", () => {
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
      left: "1.5vw",
      xPercent: 0,
      yPercent: 0,
      x: 0,
      y: 0,
      duration: 1,
      ease: "power2.inOut"
    }, 0);

    // 2. Các ảnh phụ văng ra ngoài viewport
    tl.to(".item-tl", { xPercent: -200, yPercent: -200, duration: 1, ease: "power2.inOut" }, 0);
    tl.to(".item-tr", { xPercent: 200, yPercent: -200, duration: 1, ease: "power2.inOut" }, 0);
    tl.to(".item-bl", { xPercent: -200, yPercent: 200, duration: 1, ease: "power2.inOut" }, 0);
    tl.to(".item-br", { xPercent: 200, yPercent: 200, duration: 1, ease: "power2.inOut" }, 0);
    tl.to(".item-tr1", { xPercent: 200, yPercent: -300, duration: 1, ease: "power2.inOut" }, 0);
    tl.to(".item-bl1", { xPercent: -150, yPercent: 200, duration: 1, ease: "power2.inOut" }, 0);

    // 8. Nature Feed trồi lên từ phía dưới (ở giữa chặng animation)
    tl.to(natureFeed, {
      yPercent: 0,
      opacity: 1,
      duration: 0.5,
      ease: "power2.out"
    }, 0.5);
  });

  mm.add("(max-width: 991px)", () => {
    // Trên mobile, chỉ scroll nhẹ để hiện Nature Feed
    gsap.to(natureFeed, {
      yPercent: 0,
      opacity: 1,
      scrollTrigger: {
        trigger: section,
        start: "top center",
        end: "bottom bottom",
        scrub: 1,
      }
    });
  });

  // Refresh sau khi load xong ảnh
  window.addEventListener("load", () => requestAnimationFrame(() => ScrollTrigger.refresh()), { once: true });
});
