/* overlay-menu.js — Refactored with jQuery */
(function ($) {
  'use strict';

  /* ── Menu data ── */
  const getBase = () => {
    const parts = window.location.pathname.replace(/\\/g, '/').split('/').filter(Boolean);
    const htmlIdx = parts.findIndex(p => p.toLowerCase() === 'html');
    const depth = htmlIdx !== -1 ? parts.length - htmlIdx - 1 : 1;
    return depth > 0 ? '../'.repeat(depth) : './';
  };

  const ITEMS = [
    { index: '01', label: 'KINH TẾ & CT',  href: 'kinh-te-chinh-tri/kinh-te-chinh-tri-details.html', imgL: 'iranbombed.png',     imgR: 'Trump.png'           },
    { index: '02', label: 'THỂ THAO',       href: 'the-thao/the-thao-suc-khoe.html',                  imgL: 'Fomular1.png',       imgR: 'atletico_madrid.jpg' },
    { index: '03', label: 'GIẢI TRÍ',       href: 'giai-tri-doi-song/GiaiTrivsDoiSong.html',           imgL: 'Dune3.jpg',          imgR: 's3_carnival.png'     },
    { index: '04', label: 'VŨ TRỤ',         href: 'vu-tru-thien-nhien/vu-tru-va-thien-nhien.html',    imgL: 'galaxy.png',         imgR: 'earth.png'           },
  ];

  /* ── Build & inject HTML ── */
  function buildOverlay(BASE) {
    if ($('#om-overlay').length) return;

    const itemsHTML = ITEMS.map(({ index, label, href, imgL, imgR }) => `
      <li class="om-item">
        <div class="om-img om-img--left"  aria-hidden="true"><img src="${BASE}images/${imgL}" loading="lazy"></div>
        <a class="om-item-link" href="${BASE}${href}">
          <span class="om-item-index" aria-hidden="true">${index}</span>
          <span class="om-item-label">${label}</span>
        </a>
        <div class="om-img om-img--right" aria-hidden="true"><img src="${BASE}images/${imgR}" loading="lazy"></div>
      </li>`).join('');

    $('body').append(`
      <div class="om-overlay" id="om-overlay" role="dialog" aria-modal="true">
        <header class="om-header">
          <a class="om-logo" href="${BASE}html/Index.html" id="om-logo">BÁO CHÍ <span>DESIGN</span></a>
          <button class="om-close-btn" id="om-close-btn" aria-label="Close menu" type="button">
            <span class="om-close-icon" aria-hidden="true"></span>
          </button>
        </header>
        <div class="om-body">
          <nav><ul class="om-menu-list" id="om-menu-list">${itemsHTML}</ul></nav>
        </div>
        <footer class="om-footer" id="om-footer">
          <span>© 2026 BÁO CHÍ DESIGN — Nhóm 7</span>
          <ul class="om-footer-links">
            <li><a href="#">Instagram</a></li>
            <li><a href="#">Facebook</a></li>
            <li><a href="#">YouTube</a></li>
          </ul>
        </footer>
      </div>`);
  }

  /* ── Animation ── */
  let isOpen = false;

  function openMenu() {
    if (isOpen) return;
    isOpen = true;
    $('body').addClass('om-lock');
    $('#om-overlay').addClass('is-open');

    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .fromTo('#om-overlay',        { y: '100%' },          { y: '0%',   duration: 0.72, ease: 'cubic-bezier(0.77,0,0.175,1)' })
      .fromTo('#om-logo, #om-close-btn', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, stagger: 0.08 }, '-=0.3')
      .fromTo('.om-item',           { opacity: 0, y: 50 },  { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, clearProps: 'transform' }, '-=0.35')
      .fromTo('#om-footer',         { opacity: 0 },         { opacity: 1, duration: 0.3 }, '-=0.25');
  }

  function closeMenu() {
    if (!isOpen) return;
    isOpen = false;

    gsap.timeline({
      onComplete() {
        $('#om-overlay').removeClass('is-open');
        $('body').removeClass('om-lock');
        gsap.set('.om-item', { opacity: 0, y: 50 });
        gsap.set('#om-logo, #om-close-btn, #om-footer', { opacity: 0 });
      }
    }).to('#om-overlay', { y: '100%', duration: 0.6, ease: 'cubic-bezier(0.77,0,0.175,1)' });
  }

  /* ── Hover: menu items ── */
  function bindItemHover() {
    $(document).on('mouseenter', '.om-item-link', function () {
      const $item = $(this).closest('.om-item');
      gsap.to(this,                          { scale: 1.025, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
      gsap.to($(this).find('.om-item-label'), { letterSpacing: '0.02em', duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
      gsap.to($item.find('.om-img--left'),   { opacity: 1, x: 0,   scale: 1.04, duration: 0.42, ease: 'power3.out', overwrite: 'auto' });
      gsap.to($item.find('.om-img--right'),  { opacity: 1, x: 0,   scale: 1.04, duration: 0.42, ease: 'power3.out', overwrite: 'auto' });
    });

    $(document).on('mouseleave', '.om-item-link', function () {
      const $item = $(this).closest('.om-item');
      gsap.to(this,                          { scale: 1,     duration: 0.4,  ease: 'power3.out', overwrite: 'auto' });
      gsap.to($(this).find('.om-item-label'), { letterSpacing: '-0.02em', duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
      gsap.to($item.find('.om-img--left'),   { opacity: 0, x: -12, scale: 0.96, duration: 0.38, ease: 'power2.in', overwrite: 'auto' });
      gsap.to($item.find('.om-img--right'),  { opacity: 0, x: 12,  scale: 0.96, duration: 0.38, ease: 'power2.in', overwrite: 'auto' });
    });
  }

  /* ── Hover: hamburger ── */
  function bindHamburgerHover() {
    $(document).on('mouseenter', '.hamburger-btn', function () {
      gsap.to($(this).find('.ham-top'),    { x:  5, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
      gsap.to($(this).find('.ham-bottom'), { x: -5, duration: 0.3, ease: 'power2.out', overwrite: 'auto' });
    }).on('mouseleave', '.hamburger-btn', function () {
      gsap.to($(this).find('.ham-top, .ham-bottom'), { x: 0, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
    });
  }

  /* ── Events ── */
  function bindEvents() {
    /* Hamburger open — delegation vì navbar.js inject sau */
    $(document).on('click', '.hamburger-btn', function (e) {
      e.stopPropagation(); e.preventDefault();
      $(this).removeAttr('data-bs-toggle data-bs-target');
      openMenu();
    });

    $(document).on('click', '#om-close-btn', closeMenu);
    $(document).on('keydown', e => e.key === 'Escape' && isOpen && closeMenu());
  }

  /* ── Init ── */
  function init() {
    const BASE = getBase();
    buildOverlay(BASE);

    /* Set initial states cho GSAP */
    gsap.set('.om-img--left',  { x: -12, scale: 0.96, opacity: 0 });
    gsap.set('.om-img--right', { x:  12, scale: 0.96, opacity: 0 });

    bindItemHover();
    bindHamburgerHover();
    bindEvents();

    console.log('[overlay-menu] ✓ Initialized');
  }

  $(window).on('load', () => setTimeout(init, 50));

})(jQuery);