document.addEventListener("DOMContentLoaded", () => {
	initSportsPreview();
	initSportsFeedNavigation();
});

const initSportsPreview = () => {
	const sportsLine = document.getElementById("s3-sports-category");
	const previewCards = document.querySelectorAll(".s3-card-gallery");

	if (!sportsLine || !previewCards.length) return;

	const sportButtons = sportsLine.querySelectorAll(".s3-btn");
	if (!sportButtons.length) return;

	let activeButton = sportsLine.querySelector(".s3-btn.is-active") || sportButtons[0];

	const updatePreview = (button, animate = true) => {
		if (!button || (animate && button === activeButton)) return;
		activeButton = button;
		sportButtons.forEach(btn => btn.classList.toggle("is-active", btn === button));

		const applySources = () => {
			previewCards.forEach((card, index) => {
				const img = card.querySelector("img");
				const src = button.dataset[`preview${index + 1}`];
				if (!img || !src) {
					card.classList.remove("is-visible");
					card.hidden = true;
					return;
				}
				card.hidden = false;
				img.src = src;
				const sportText = button.querySelector("span:first-child")?.textContent.trim() || "Ảnh thể thao";
				img.alt = `${sportText} ${index + 1}`;
			});

			requestAnimationFrame(() => {
				previewCards.forEach(card => !card.hidden && card.classList.add("is-visible"));
			});
		};

		if (animate) {
			previewCards.forEach(card => card.classList.remove("is-visible"));
			setTimeout(applySources, 110);
		} else {
			applySources();
		}
	};

	sportButtons.forEach(btn => {
		["mouseenter", "focus", "click"].forEach(event =>
			btn.addEventListener(event, () => updatePreview(btn))
		);
	});

	updatePreview(activeButton, false);
};

const initSportsFeedNavigation = () => {
	const viewport = document.querySelector(".sports-feed-viewport");
	const prevButton = document.querySelector(".sports-feed-nav--prev");
	const nextButton = document.querySelector(".sports-feed-nav--next");

	if (!viewport || !prevButton || !nextButton) return;

	const updateNavState = () => {
		prevButton.disabled = viewport.scrollLeft <= 4;
		nextButton.disabled = viewport.scrollLeft >= viewport.scrollWidth - viewport.clientWidth - 4;
	};

	const scrollFeed = (dir) => {
		viewport.scrollBy({ left: dir * Math.max(viewport.clientWidth * 0.75, 260), behavior: "smooth" });
	};

	prevButton.addEventListener("click", () => scrollFeed(-1));
	nextButton.addEventListener("click", () => scrollFeed(1));

	viewport.addEventListener("scroll", updateNavState);
	window.addEventListener("resize", updateNavState);
	updateNavState();
};

