$(() => {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  const $section = $(".section-two, .news-section-two");
  const $viewport = $section.find(".s2-viewport, .news-s2-viewport");
  const $track = $section.find(".s2-track, .news-s2-track");
  const $progressBar = $section.find(".s2-progress-bar, .news-s2-progress-bar");

  if (!$section.length || !$track.length) return;

  const getScrollOffset = () => Math.max(0, $track[0].scrollWidth - $viewport.innerWidth());

  gsap.to($track[0], {
    x: () => -getScrollOffset(),
    ease: "none",
    scrollTrigger: {
      trigger: $section[0],
      start: "top top",
      end: () => `+=${getScrollOffset()}`,
      pin: true,
      scrub: 1,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        if ($progressBar.length) {
          $progressBar.css("transform", `scaleX(${self.progress})`);
        }
      }
    }
  });

  // Tái kích hoạt Hover thông qua jQuery cơ bản thay vì theo dõi tọa độ
  $(".s2-lead-panel, .s2-data-panel").hover(
    function() { $(this).addClass("s2-hover-active"); },
    function() { $(this).removeClass("s2-hover-active"); }
  );

  $(window).one("load", () => requestAnimationFrame(() => ScrollTrigger.refresh()));
});