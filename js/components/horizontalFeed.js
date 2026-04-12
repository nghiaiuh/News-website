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
    var targetTranslateX = 0;
    var rafId = 0;

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

    function scheduleTranslate() {
      if (rafId) return;
      rafId = requestAnimationFrame(function () {
        rafId = 0;
        currentTranslateX = targetTranslateX;
        applyTranslate(currentTranslateX);
      });
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
      targetTranslateX = currentTranslateX;
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
      targetTranslateX = clampTranslateX(dragStartTranslateX + delta);
      scheduleTranslate();
    }

    function endDrag() {
      if (!isDragging) return;
      isDragging = false;
      container.classList.remove("is-dragging");
      currentTranslateX = targetTranslateX;
    }

    container.addEventListener("pointerdown", function (event) {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      startDrag(event.clientX);
      container.setPointerCapture(event.pointerId);
      if (event.pointerType === "mouse") {
        event.preventDefault();
      }
    });

    container.addEventListener("pointermove", function (event) {
      moveDrag(event.clientX);
    });

    container.addEventListener("pointerup", endDrag);
    container.addEventListener("pointercancel", endDrag);
    container.addEventListener("lostpointercapture", endDrag);

    [].slice.call(track.querySelectorAll("img")).forEach(function (img) {
      img.addEventListener("dragstart", function (event) {
        event.preventDefault();
      });
    });

    window.addEventListener("resize", function () {
      requestAnimationFrame(function () {
        refreshBounds(true);
      });
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
