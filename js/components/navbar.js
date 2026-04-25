/* =============================================================
   navbar.js — Shared Navbar Component
   <div id="site-header"></div>
   ============================================================= */
$(() => {
  const LOGO = [{ c: "D", hex: "#c30000" },
                { c: "E", hex: "#1c9a3f" },
                { c: "S", hex: "#f2c200" },
                { c: "I", hex: "#7a3bd6" },
                { c: "G", hex: "#ff8a00" },
                { c: "N", hex: "#1262ff" }];
  const L_NAV = [{ h: "kinh-te-chinh-tri/kinh-te-chinh-tri-details.html", l: "Kinh tế &amp; Chính trị", k: "home" }, { h: "the-thao/the-thao-suc-khoe.html", l: "Thể thao &amp; Sức khoẻ", k: "sports" }];
  const R_NAV = [{ h: "giai-tri-doi-song/GiaiTrivsDoiSong.html", l: "Giải trí &amp; Đời sống", k: "lifestyle" }, { h: "vu-tru-thien-nhien/vu-tru-va-thien-nhien.html", l: "Vũ trụ &amp; Thiên nhiên", k: "cosmos" }];

  const $slot = $("#site-header");
  if (!$slot.length) return;

  // Dynamic path resolution
  const pathParts = window.location.pathname.split('/');
  const htmlIndex = pathParts.lastIndexOf('html');
  
  let depthFromHtml = 0;
  if (htmlIndex !== -1) {
    depthFromHtml = pathParts.length - htmlIndex - 2; 
  } else {
    // Fallback if 'html' folder isn't in URL, use data-base or default
    const fallbackBase = ($slot.data("base") || "./").replace(/\/?$/, "/");
    depthFromHtml = fallbackBase.split('../').length - 1;
    if (fallbackBase === "./") depthFromHtml = 0;
  }

  let htmlBase = depthFromHtml <= 0 ? "./" : "../".repeat(depthFromHtml);
  let rootBase = htmlBase + "../";

  const rHtml = (h) => htmlBase + h.replace(/^\.?\//, "");
  const rRoot = (h) => rootBase + h.replace(/^\.?\//, "");

  const file = pathParts[pathParts.length - 1] || "index.html";
  const activeKey = file === "index.html" ? "home" :
                    file.match(/the-thao|suc-khoe/) ? "sports" :
                    file.match(/vu-tru/) ? "cosmos" :
                    file.match(/giai-tri|homeGTDS/) ? "lifestyle" : "";

  const buildNav = (links, cls) => `<ul class="navbar-nav mb-0 main-menu ${cls}">${links.map(({ h, l, k }) => 
    `<li class="nav-item menu-item${k === activeKey ? " active" : ""}"><a class="nav-link menu-link" href="${rHtml(h)}" ${k === activeKey ? 'aria-current="page"' : ''}>${l}</a></li>`
  ).join("")}</ul>`;

  $slot.html(`
    <header class="header">
      <nav class="navbar navbar-dark py-0">
        <div class="container-fluid px-3 px-xl-4">
          <div class="navbar-shell w-100">
            <button class="navbar-toggler border-0 shadow-none hamburger-btn" type="button">
              <span class="hamburger" aria-hidden="true"><span class="ham-line ham-top"></span><span class="ham-line ham-bottom"></span></span>
            </button>
            ${buildNav(L_NAV, "main-menu-left")}
            <a class="logo py-3 mb-0" href="${rHtml("index.html")}"><span>BÁO CHÍ <span aria-label="DESIGN">${LOGO.map(x => `<span style="color:${x.hex}">${x.c}</span>`).join("")}</span></span></a>
            ${buildNav(R_NAV, "main-menu-right")}
            <button class="account-btn" type="button" aria-label="Tài khoản" id="account-btn">
              <img src="${rRoot("images/account.svg")}" alt="account" width="20px">
              <span>Tài khoản</span>
            </button>
          </div>
          <div class="collapse navbar-collapse justify-content-end" id="nwMenu">
            <ul class="navbar-nav list-inline mb-0 justify-content-center justify-content-lg-end w-100" id="user-options"></ul>
          </div>
        </div>
      </nav>
    </header>
  `);

  const $header   = $slot.find(".header");
  const $mobileMenu = $slot.find("#nwMenu");

  // --- 1. Scroll Hide/Show ---
  let lastY = window.scrollY || 0;
  $(window).on("scroll", () => {
    const y = window.scrollY || 0;
    if (y <= 2 || ($mobileMenu.length && $mobileMenu.hasClass("show"))) {
      $header.removeClass("header--hidden");
    } else if (Math.abs(y - lastY) > 1) {
      $header.toggleClass("header--hidden", y > lastY);
    }
    lastY = y;
  });

  if ($mobileMenu.length) {
    $mobileMenu.on("show.bs.collapse shown.bs.collapse", () => $header.removeClass("header--hidden"));
  }

  // --- 2. GSAP Hovers ---
  if (typeof gsap !== "undefined") {
    $slot.find(".menu-item").hover(
      function() { gsap.to($(this).find(".menu-link"), { y: -3, duration: 0.25, ease: "power2.out", overwrite: "auto" }); },
      function() { gsap.to($(this).find(".menu-link"), { y: 0, duration: 0.3, ease: "power2.out", overwrite: "auto" }); }
    );
    const $top = $slot.find(".ham-top"), $bot = $slot.find(".ham-bottom");
    $slot.find(".hamburger-btn").hover(
      () => { gsap.to($top, { x: 4, duration: 0.3, overwrite: "auto" }); gsap.to($bot, { x: -4, duration: 0.3, overwrite: "auto" }); },
      () => { gsap.to([$top, $bot], { x: 0, duration: 0.35, overwrite: "auto" }); }
    );
  }

  // --- 3. Body Padding Setup ---
  const syncPadding = () => $("body").css("paddingTop", $header.outerHeight());
  $(window).on("resize", syncPadding);
  syncPadding();
});