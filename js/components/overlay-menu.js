/* overlay-menu.js — jQuery + GSAP */
(function ($) {
  'use strict';

  const ITEMS = [
    { label: 'KINH TẾ CHÍNH TRỊ',  href: 'kinhte-chinhtri.html' },
    { label: 'THỂ THAO SỨC KHOẺ',  href: 'thethao-suckhoe.html' },
    { label: 'GIẢI TRÍ ĐỜI SỐNG',  href: 'giaitri-doisong.html' },
    { label: 'VŨ TRỤ THIÊN NHIÊN', href: 'vu-tru-thien-nhien/vu-tru-thien-nhien.html' },
  ];

  let BASE = './', isOpen = false;

  /* ── Giải quyết đường dẫn tương đối dựa trên URL thực tế ── */
  function resolveBase() {
    const pathParts = window.location.pathname.split('/');
    const htmlIndex = pathParts.lastIndexOf('html');

    let depthFromHtml = 0;
    if (htmlIndex !== -1) {
      // Số cấp thư mục kể từ sau thư mục html/ đến file hiện tại
      // pathParts.length - 1 = index của file, htmlIndex = index của 'html'
      // depth = (pathParts.length - 1) - htmlIndex - 1 = pathParts.length - htmlIndex - 2
      depthFromHtml = pathParts.length - htmlIndex - 2;
    } else {
      // Fallback: đọc data-base trên body
      const fallbackBase = ($('body').data('base') || './').replace(/\/?$/, '/');
      depthFromHtml = fallbackBase.split('../').length - 1;
      if (fallbackBase === './') depthFromHtml = 0;
    }

    return depthFromHtml <= 0 ? './' : '../'.repeat(depthFromHtml);
  }

  /* Chuyển href tương đối (từ gốc html/) thành đường dẫn đúng từ vị trí hiện tại */
  const r = h => BASE + h.replace(/^\.?\//, '');

  /* ── Build HTML ── */
  function buildOverlay() {
    if ($('#om-overlay').length) return;

    const itemsHTML = ITEMS.map(({ label, href }) => `
      <li class="om-item">
        <a class="om-item-link" href="${r(href)}">
          <span class="om-item-label">${label}</span>
        </a>
      </li>`).join('');

    $('body').append(`
      <div class="om-overlay" id="om-overlay" role="dialog" aria-modal="true">
        <header class="om-header">
          <a class="om-logo" href="${r('Index.html')}" id="om-logo">BÁO CHÍ <span>DESIGN</span></a>
          <div class="om-header-actions">
            <button class="om-close-btn" id="om-close-btn" aria-label="Close menu" type="button">
              <span class="om-close-icon" aria-hidden="true"></span>
            </button>
          </div>
        </header>
        <div class="om-body">
          <nav><ul class="om-menu-list" id="om-menu-list">${itemsHTML}</ul></nav>
        </div>
        <footer class="om-footer" id="om-footer">
          <span>© 2026 BÁO CHÍ DESIGN — Nhóm 8</span>
          <ul class="om-footer-links">
            <li><a href="https://www.youtube.com/@nghia_game_dev">Youtube</a></li>
            <li><a href="https://github.com/nghiaiuh/News-website">Github</a></li>
            <li><a href="https://www.linkedin.com/in/ngh%C4%A9a-phan-np061010/">LinkedIn</a></li>
          </ul>
        </footer>
      </div>`);
  }

  function getScrollbarWidth() {
    return window.innerWidth - document.documentElement.clientWidth;
  }

  /* ── Animations ── */
  function openMenu() {
    if (isOpen) return;
    isOpen = true;
    const scrollBarWidth = getScrollbarWidth();
    $('body').addClass('om-lock').css('padding-right', scrollBarWidth + 'px');
    $('.navbar').css('padding-right', scrollBarWidth + 'px');
    $('#om-overlay').addClass('is-open');

    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .fromTo('#om-overlay',             { y: '100%' },       { y: '0%',   duration: 0.72, ease: 'cubic-bezier(0.77,0,0.175,1)' })
      .fromTo('#om-logo, #om-close-btn', { opacity: 0, y: 8 },{ opacity: 1, y: 0, duration: 0.4 }, '-=0.3')
      .fromTo('.om-item',                { opacity: 0, y: 50 },{ opacity: 1, y: 0, duration: 0.55, stagger: 0.1 }, '-=0.35')
      .fromTo('#om-footer',              { opacity: 0 },      { opacity: 1, duration: 0.3 }, '-=0.25');
  }

  function closeMenu() {
    if (!isOpen) return;
    isOpen = false;

    gsap.timeline({ onComplete() {
      $('#om-overlay').removeClass('is-open');
      $('body').removeClass('om-lock').css('padding-right', '');
      $('.navbar').css('padding-right', '');
      gsap.set('.om-item', { opacity: 0, y: 50 });
      gsap.set('#om-logo, #om-close-btn, #om-footer', { opacity: 0 });
    }}).to('#om-overlay', { y: '100%', duration: 0.6, ease: 'cubic-bezier(0.77,0,0.175,1)' });
  }

  /* ── Hover ── */
  function bindItemHover() {
    $(document)
      .on('mouseenter', '.om-item-link', function () {
        gsap.to(this, { scale: 1.025, duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
        gsap.to($(this).find('.om-item-label'), { letterSpacing: '0.02em', duration: 0.35, ease: 'power2.out', overwrite: 'auto' });
      })
      .on('mouseleave', '.om-item-link', function () {
        gsap.to(this, { scale: 1, duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
        gsap.to($(this).find('.om-item-label'), { letterSpacing: '-0.02em', duration: 0.4, ease: 'power3.out', overwrite: 'auto' });
      });
  }

  /* ── Events & Init ── */
  function bindEvents() {
    $(document)
      .on('click', '.hamburger-btn', e => { e.stopPropagation(); e.preventDefault(); openMenu(); })
      .on('click', '#om-close-btn', closeMenu)
      .on('keydown', e => e.key === 'Escape' && isOpen && closeMenu());
  }

  function init() {
    BASE = resolveBase(); // URL path detection thay vì data-base
    buildOverlay();
    bindItemHover();
    bindEvents();
  }

  $(window).on('load', () => setTimeout(init, 50));

})(jQuery);