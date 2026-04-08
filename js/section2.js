document.addEventListener("DOMContentLoaded", function () {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  // Section 2: cinematic circle wipe reveal
  gsap.registerPlugin(ScrollTrigger);

  let cm = document.getElementById("nw-cm-transition");
  if (!cm) return;

  let cmNext = cm.querySelector(".nw-cm-next-layer");
  let cmRing = cm.querySelector(".nw-cm-ring");
  let cmItems = cm.querySelectorAll("[data-cm-reveal]");

  gsap.set(cmItems, { autoAlpha: 0, y: 40, filter: "blur(8px)" });

  let cmTl = gsap.timeline({
    scrollTrigger: {
      trigger: cm,
      start: "top top",
      end: "+=200%",
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  cmTl.to(
    cmNext,
    { clipPath: "circle(150% at 50% 50%)", duration: 1.2, ease: "none" },
    0
  );
  cmTl.to(
    cmRing,
    { autoAlpha: 0, scale: 1.35, duration: 0.65, ease: "none" },
    0.24
  );
  cmTl.to(
    cmItems,
    {
      autoAlpha: 1,
      y: 0,
      filter: "blur(0px)",
      stagger: 0.12,
      duration: 0.72,
      ease: "power1.in",
    },
    0.66
  );
});
