document.addEventListener("DOMContentLoaded", function () {
  if (!window.gsap) {
    return;
  }

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reduceMotion) {
    const intro = document.getElementById("nw-auth-intro");
    if (intro) {
      intro.style.display = "none";
    }
    return;
  }

  const intro = document.getElementById("nw-auth-intro");

  gsap.set(".nw-auth-copy, .nw-auth-card, .nw-navbar", { autoAlpha: 0 });
  gsap.set(".nw-auth-card .mb-3, .nw-auth-submit, .nw-auth-help", {
    autoAlpha: 0,
  });

  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

  if (intro) {
    tl.fromTo(
      ".nw-auth-intro-line",
      { y: 28, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.7, stagger: 0.12 }
    )
      .to(
        ".nw-auth-intro-line",
        { y: -18, autoAlpha: 0, duration: 0.45, stagger: 0.08 },
        "+=0.15"
      )
      .to(
        "#nw-auth-intro",
        { autoAlpha: 0, duration: 0.4 },
        "-=0.1"
      )
      .set("#nw-auth-intro", { display: "none" });
  }

  tl.to(".nw-navbar", { autoAlpha: 1, y: 0, duration: 0.6 })
    .fromTo(
      ".nw-auth-copy",
      { y: 30, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.8 },
      "-=0.1"
    )
    .fromTo(
      ".nw-auth-card",
      { y: 40, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.8 },
      "-=0.5"
    )
    .fromTo(
      ".nw-auth-card .mb-3, .nw-auth-submit, .nw-auth-help",
      { y: 16, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.45, stagger: 0.08 },
      "-=0.3"
    );

  gsap.to(".nw-auth-shape--one", {
    x: 30,
    y: 20,
    duration: 8,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
  gsap.to(".nw-auth-shape--two", {
    x: -28,
    y: -18,
    duration: 9,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
  gsap.to(".nw-auth-shape--three", {
    x: 18,
    y: -24,
    duration: 7,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut",
  });
});
