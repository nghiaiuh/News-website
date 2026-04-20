$(() => {
  if (typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);

    gsap.set(".s4-list .s4-item", { opacity: 0, y: 30 });

    ScrollTrigger.batch(".s4-list .s4-item", {
      start: "top 85%",
      onEnter: (batch) => {
        gsap.to(batch, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: "power2.out",
          onComplete: () => {
            gsap.set(batch, { clearProps: "transform" });
            $(batch).addClass("hover-ready");
          },
        });
      },
      once: true
    });
  }
});
