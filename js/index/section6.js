$(() => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;
  gsap.registerPlugin(ScrollTrigger);
  const cards = gsap.utils.toArray(".s6-member-card");
  cards.forEach((card) => {
    const speed = parseFloat(card.dataset.speed) || 150; 
    gsap.to(card, {
      y: -speed, 
      ease: "none",
      scrollTrigger: {
        trigger: ".s6-section",
        start: "top bottom", 
        end: "bottom top",
        scrub: 1.5
      }
    });
  });
});
