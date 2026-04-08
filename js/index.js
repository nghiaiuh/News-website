(function () {
  // -------------BUGS-------------
  if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }

  const navEntries = performance.getEntriesByType("navigation");

  if (navEntries.length && navEntries[0].type === "reload") {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }
})();

document.addEventListener("DOMContentLoaded", function () {
  if (typeof gsap === "undefined") return;

  // ────────── DOM ELEMENTS ──────────
  let overlay    = document.getElementById("nw-intro-overlay");
  let introText  = document.getElementById("nw-intro-text");
  let wipeLayer  = document.querySelector(".nw-it-wipe");
  let anchor     = document.getElementById("nw-dt-anchor");
  let dtTitle    = document.getElementById("nw-dt-title");
  let videoCol   = document.querySelector(".nw-video-col");
  let navbarEl   = document.querySelector(".nw-header");

  if (!overlay || !introText || !wipeLayer || !anchor) return;

  // ────────── REVEAL ELEMENT GROUPS ──────────
  // Tách riêng 3 nhóm: tween chung, scale chung, và hero (hiện sớm để video không bị che).
  let revealEls      = [].slice.call(document.querySelectorAll("[data-page-reveal]"));
  let anchorRevealEl = anchor.closest("[data-page-reveal]");
  let heroRevealEl   = document.querySelector(".nw-hero[data-page-reveal]");
  
  let revealTweenEls = revealEls.filter(function (el) {
    return el !== anchorRevealEl && el !== navbarEl && el !== heroRevealEl;
  });
  
  let revealScaleEls = revealTweenEls.filter(function (el) {
    return !el.contains(anchor);
  });

  // ────────── SET TIMING ──────────
  let C = {
    masterDelay: 0.06, introInDuration: 2, moveDuration: 1.12,
    wipeDuration: 0.58, revealOffset: 0.2,
    navbarOffset: 0.5, videoDuration: 0.5, lineDuration: 0.65,
    lineStagger: 0.1, rulerOffset: 0.5, rulerDuration: 0.65,
    overlayFadeNoVideo: 0.42,
  };

  const initialScrollY = window.pageYOffset || document.documentElement.scrollTop || 0;
  const shouldSkipIntro = initialScrollY > 8;

  // ────────── INITIAL STATES ──────────
  gsap.set(introText, { transformOrigin: "center center", force3D: true });
  gsap.set(".nw-line-inner", { y: "110%" });
  gsap.set(".nw-ruler", { scaleY: 0, autoAlpha: 0 });
  if (heroRevealEl) gsap.set(heroRevealEl, { autoAlpha: 1 });

  let videoTarget = videoCol;
  if (videoTarget) {
    gsap.set(videoTarget, { transformOrigin: "top right", force3D: true });
  }


  //-------------BUGS--------------
  function refreshScrollTriggers() {
    if (typeof ScrollTrigger === "undefined") return;
    requestAnimationFrame(function () {
      ScrollTrigger.refresh();
    });
  }

  function Apply_Final_Intro_State() {
    gsap.set(wipeLayer, { "--nw-wipe-right": "0%" });
    gsap.set(revealTweenEls, { autoAlpha: 1, y: 0, opacity: 1 });
    if (anchorRevealEl) gsap.set(anchorRevealEl, { autoAlpha: 1, y: 0, opacity: 1 });
    if (dtTitle) gsap.set(dtTitle, { autoAlpha: 1 });
    if (navbarEl) gsap.set(navbarEl, { autoAlpha: 1, y: 0 });
    if (revealScaleEls.length) gsap.set(revealScaleEls, { y: 0, opacity: 1 });
    if (videoTarget) {
      gsap.set(videoTarget, {
        autoAlpha: 1,
        scale: 1,
        transformOrigin: "top right",
        force3D: true,
      });
    }
    gsap.set(".nw-line-inner", { y: "0%" });
    gsap.set(".nw-ruler", { scaleY: 1, autoAlpha: 1, clearProps: "transform" });
    gsap.set(overlay, {
      autoAlpha: 0,
      backgroundColor: "rgba(0,0,0,0)",
      display: "none",
    });
  }

  // ────────── MASTER TIMELINE ──────────
  if (shouldSkipIntro) {
    Apply_Final_Intro_State();
    refreshScrollTriggers();
  } else {
    let master = gsap.timeline({
      delay: C.masterDelay,
      onComplete: refreshScrollTriggers,
    });

    // ────────── Phase 1 ──────────
    master.fromTo(introText,
      { y: -100, opacity: 0 },
      { y: 0, opacity: 1, duration: C.introInDuration }
    );

    // ────────── Phase 2 ──────────
    master.add(function () { master.add(Phase_two()); });
  }

  // Tính khoảng cách (x, y) và tỉ lệ scale cần move từ vị trí intro
  // dùng width ratio + clamp của GSAP để tính scale.
  function Distance_Scale() {
    let targetDimension     = dtTitle.getBoundingClientRect();  //lấy vị trí target tính theo viewport
    let introDimension      = introText.getBoundingClientRect();
    let moveX      = (targetDimension.left + targetDimension.width / 2)  - (introDimension.left + introDimension.width / 2);
    let moveY      = (targetDimension.top  + targetDimension.height / 2) - (introDimension.top  + introDimension.height / 2);
    
    let rawScale   = targetDimension.width / introDimension.width;
    let scale      = gsap.utils.clamp(0.25, 4, rawScale);
    return { moveX: moveX, moveY: moveY, scaleTarget: scale };
  }

  // ────────── HANDOFF TIMELINE ──────────
  // Intro text di chuyển + phóng to về vị trí tiêu đề thật,
  // Đợi introTextDone sau đó mới reveal các elements khác.

  function Phase_two() {
    let m = Distance_Scale();
    let videoAt = "introTextDone-=" + C.videoDuration;
    
    let tl = gsap.timeline();
    tl.add("introMoveStart");
    
    // Zoom
    tl.to(introText, { x: m.moveX, y: m.moveY, scale: m.scaleTarget,
      duration: C.moveDuration, ease: "power2.inOut", force3D: true }, "introMoveStart");
    
    // Wipe
    tl.to(wipeLayer, { "--nw-wipe-right": "0%",
      duration: C.wipeDuration, ease: "power3.inOut" }, "introMoveStart");

    tl.add("introTextDone", "introMoveStart+=" + C.moveDuration);
    
    //Reveal
    tl.set(revealTweenEls, { autoAlpha: 1 }, "introTextDone");
    if (anchorRevealEl) tl.set(anchorRevealEl, { autoAlpha: 1 }, "introTextDone");
    if (dtTitle)        tl.set(dtTitle,        { autoAlpha: 1 }, "introTextDone");

    if (navbarEl) {
      tl.fromTo(navbarEl, { y: -100, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 1, ease: "power2.out" },
        "introTextDone+=" + C.navbarOffset);
    }

    if (revealScaleEls.length) {
      tl.from(revealScaleEls, { y: -100, opacity: 0 },
        "introTextDone+=" + C.revealOffset);
    }

    if (videoCol) {
      tl.fromTo(videoTarget,
        { autoAlpha: 1, scale: 0, transformOrigin: "top right" },
        { autoAlpha: 1, scale: 1, transformOrigin: "top right",
          duration: C.videoDuration, ease: "expo.out", force3D: true },
        videoAt);
    }

    tl.fromTo(".nw-line-inner", { y: "110%" },
      { y: "0%", duration: C.lineDuration, ease: "Power4.in", stagger: C.lineStagger },
      "introTextDone+=" + C.revealOffset);

    tl.to(".nw-ruler",
      { scaleY: 1, autoAlpha: 1, duration: C.rulerDuration, ease: "power3.out", clearProps: "transform" },
      "introTextDone+=" + C.rulerOffset);

    tl.to(overlay,
      { backgroundColor: "rgba(0,0,0,0)", duration: C.videoDuration, ease: "power2.out" },
      videoAt);

    tl.set(overlay, { display: "none" }, "introTextDone");

    return tl;
  }


  // ────────── INTERACTION ──────────
  // Menu link hover
  document.querySelectorAll(".nw-menu-link").forEach(function (link) {
    link.addEventListener("mouseenter", function () { gsap.to(link, 
      { y: -2, duration: 0.2, overwrite: true}
    ); });
    link.addEventListener("mouseleave", function () { gsap.to(link,
      { y:  0, duration: 0.2, overwrite: true }); });
  });

  // 3D card
  let card = document.querySelector(".nw-video-card");
  if (card) {
    gsap.set(card, { transformStyle: "preserve-3d" });
    card.addEventListener("mousemove", function (e) {
      let r = card.getBoundingClientRect();
      let nx = ((e.clientX - r.left) / r.width  - 0.5) * 2;
      let ny = ((e.clientY - r.top)  / r.height - 0.5) * 2;
      gsap.to(card, { rotationY: nx * 5, rotationX: -ny * 5, z: -10,
        duration: 0.35, ease: "power2.out", overwrite: true });
    });
    card.addEventListener("mouseleave", function () {
      gsap.to(card, { rotationX: 0, rotationY: 0, z: 0,
        duration: 1.1, ease: "elastic.out(1, 0.55)", overwrite: true });
    });
  }

});