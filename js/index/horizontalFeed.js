document.addEventListener("DOMContentLoaded", function () {
  var containers = [].slice.call(document.querySelectorAll(".feed-container"));
  if (!containers.length) return;

  containers.forEach(function (container) {
    var track = container.querySelector(".feed-track");
    if (!track) return;

    var centerCard = track.querySelector(".center-card");

    var isDragging = false;
    var hasDragged = false;
    var isReady = false;
    var startX = 0;
    var dragStartTranslateX = 0;
    var currentTranslateX = 0;

    function markReady() {
      if (isReady) return;
      isReady = true;
      container.classList.add("feed-ready");
    }

    function getMinTranslateX() {
      return Math.min(0, container.clientWidth - track.scrollWidth);
    }

    function clampTranslateX(nextX) {
      var minX = getMinTranslateX();
      if (nextX < minX) return minX;
      if (nextX > 0) return 0;
      return nextX;
    }

    function applyTranslate(x) {
      track.style.transform = "translate3d(" + x + "px, 0, 0)";
    }

    function getCenterCardTranslateX() {
      if (!centerCard) return 0;

      var containerCenterX = container.clientWidth / 2;
      var cardCenterX = centerCard.offsetLeft + centerCard.offsetWidth / 2;
      return containerCenterX - cardCenterX;
    }

    function refreshBounds(shouldCenter) {
      if (shouldCenter && !hasDragged) {
        currentTranslateX = getCenterCardTranslateX();
      }

      currentTranslateX = clampTranslateX(currentTranslateX);
      applyTranslate(currentTranslateX);
    }

    function startDrag(pointerX) {
      isDragging = true;
      hasDragged = true;
      startX = pointerX;
      dragStartTranslateX = currentTranslateX;
      container.classList.add("is-dragging");
    }

    function moveDrag(pointerX) {
      if (!isDragging) return;

      var delta = (pointerX - startX) * 1.2;
      currentTranslateX = clampTranslateX(dragStartTranslateX + delta);
      applyTranslate(currentTranslateX);
    }

    function endDrag() {
      if (!isDragging) return;
      isDragging = false;
      container.classList.remove("is-dragging");
    }

    container.addEventListener("mousedown", function (event) {
      if (event.button !== 0) return;
      startDrag(event.pageX);
      event.preventDefault();
    });

    window.addEventListener("mousemove", function (event) {
      moveDrag(event.pageX);
    });

    window.addEventListener("mouseup", endDrag);
    container.addEventListener("mouseleave", endDrag);

    container.addEventListener(
      "touchstart",
      function (event) {
        if (!event.touches.length) return;
        startDrag(event.touches[0].pageX);
      },
      { passive: true }
    );

    container.addEventListener(
      "touchmove",
      function (event) {
        if (!event.touches.length) return;
        moveDrag(event.touches[0].pageX);
      },
      { passive: true }
    );

    container.addEventListener("touchend", endDrag, { passive: true });
    container.addEventListener("touchcancel", endDrag, { passive: true });

    [].slice.call(track.querySelectorAll("img")).forEach(function (img) {
      img.addEventListener("dragstart", function (event) {
        event.preventDefault();
      });
    });

    window.addEventListener("resize", function () {
      refreshBounds(true);
    });

    // Compute centered anchor before reveal to avoid first-paint jump from x=0.
    refreshBounds(true);

    requestAnimationFrame(function () {
      refreshBounds(true);
      markReady();
    });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () {
        refreshBounds(true);
      });
    }

    if (document.readyState === "complete") {
      markReady();
    } else {
      window.addEventListener(
        "load",
        function () {
          refreshBounds(true);
          markReady();
        },
        { once: true }
      );
    }
  });
});
