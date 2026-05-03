$(() => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  const natureFeed = $(".s5-nature-feed");

  let mm = gsap.matchMedia();

  // ── DESKTOP: ScrollTrigger pin + collage animation ──
  mm.add("(min-width: 992px)", () => {
    // Ẩn natureFeed ban đầu, sẽ được GSAP reveal
    gsap.set(natureFeed, { yPercent: 120, opacity: 0 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: ".s5-wrap",
        pin: true,
        start: "top top",
        end: "+=200%", //Khoảng thời gian thực hiện hiệu ứng
        scrub: 1,
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

    // 3. Nature Feed trồi lên từ phía dưới
    tl.to(natureFeed, {
      yPercent: 0,
      opacity: 1,
      duration: 0.5,
      ease: "power2.out"
    }, 0.5);
  });


  // Refresh sau khi load xong ảnh
  window.addEventListener("load", () => requestAnimationFrame(() => ScrollTrigger.refresh()), { once: true });
});
