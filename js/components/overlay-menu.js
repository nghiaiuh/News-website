/* overlay-menu.js — Refactored with jQuery */

// overlay-menu.js — Refactored with jQuery
// ================= Flow & Chi tiết từng dòng =================
// 1. Định nghĩa dữ liệu menu và hàm tiện ích lấy BASE path.
// 2. Xây dựng HTML overlay menu và inject vào DOM khi cần.
// 3. Định nghĩa các animation mở/đóng menu bằng GSAP.
// 4. Gắn hiệu ứng hover cho item menu và nút hamburger.
// 5. Lắng nghe sự kiện click/keydown để mở/đóng menu.
// 6. Khởi tạo khi window load.

(function ($) {
  'use strict';

  /* ── Menu data ── */

  // Lấy đường dẫn cơ sở (BASE) để build các link và src ảnh đúng theo vị trí file hiện tại
  const getBase = () => {
    const parts = window.location.pathname.replace(/\\/g, '/').split('/').filter(Boolean); // Tách path thành mảng
    const htmlIdx = parts.findIndex(p => p.toLowerCase() === 'html'); // Tìm vị trí thư mục 'html'
    const depth = htmlIdx !== -1 ? parts.length - htmlIdx - 1 : 1; // Tính số cấp cần đi lên
    return depth > 0 ? '../'.repeat(depth) : './'; // Trả về chuỗi ../ tương ứng
  };

  // Dữ liệu các mục menu (index, label, link, ảnh trái/phải)
  const ITEMS = [
    { index: '01', label: 'KINH TẾ & CT',  href: 'kinh-te-chinh-tri/kinh-te-chinh-tri-details.html', imgL: 'iranbombed.png',     imgR: 'Trump.png'           },
    { index: '02', label: 'THỂ THAO',       href: 'the-thao/the-thao-suc-khoe.html',                  imgL: 'Fomular1.png',       imgR: 'atletico_madrid.jpg' },
    { index: '03', label: 'GIẢI TRÍ',       href: 'giai-tri-doi-song/GiaiTrivsDoiSong.html',           imgL: 'Dune3.jpg',          imgR: 's3_carnival.png'     },
    { index: '04', label: 'VŨ TRỤ',         href: 'vu-tru-thien-nhien/vu-tru-va-thien-nhien.html',    imgL: 'galaxy.png',         imgR: 'earth.png'           },
  ];

  /* ── Build & inject HTML ── */
  // Xây dựng HTML overlay menu và inject vào body nếu chưa có
  function buildOverlay(BASE) {
    if ($('#om-overlay').length) return; // Đã có overlay thì không tạo nữa

    // Tạo HTML cho từng item menu
    const itemsHTML = ITEMS.map(({ index, label, href, imgL, imgR }) => `
      <li class="om-item">
        <div class="om-img om-img--left" aria-hidden="true"><img src="${BASE}images/${imgL}" loading="lazy"></div>
        <a class="om-item-link" href="${BASE}${href}">
          <span class="om-item-index" aria-hidden="true">${index}</span>
          <span class="om-item-label">${label}</span>
        </a>
        <div class="om-img om-img--right" aria-hidden="true"><img src="${BASE}images/${imgR}" loading="lazy"></div>
      </li>`).join('');

    // Inject HTML overlay vào cuối body
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
  // Biến trạng thái menu đang mở hay đóng
  let isOpen = false;

  // Hàm mở menu overlay, chạy animation GSAP
  function openMenu() {
    if (isOpen) return; // Nếu đã mở thì bỏ qua
    isOpen = true;
    $('body').addClass('om-lock'); // Khóa scroll nền
    $('#om-overlay').addClass('is-open'); // Thêm class hiển thị overlay

    // Animation mở overlay và các thành phần con
    gsap.timeline({ defaults: { ease: 'power3.out' } })
      .fromTo('#om-overlay',        { y: '100%' },          { y: '0%',   duration: 0.72, ease: 'cubic-bezier(0.77,0,0.175,1)' })
      .fromTo('#om-logo, #om-close-btn', { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4}, '-=0.3')
      .fromTo('.om-item',           { opacity: 0, y: 50 },  { opacity: 1, y: 0, duration: 0.55, stagger: 0.1, clearProps: 'transform' }, '-=0.35')
      .fromTo('#om-footer',         { opacity: 0 },         { opacity: 1, duration: 0.3 }, '-=0.25');
  }

  // Hàm đóng menu overlay, chạy animation đóng và reset trạng thái
  function closeMenu() {
    if (!isOpen) return;
    isOpen = false;

    gsap.timeline({
      onComplete() {
        $('#om-overlay').removeClass('is-open'); // Ẩn overlay
        $('body').removeClass('om-lock'); // Mở lại scroll nền
        gsap.set('.om-item', { opacity: 0, y: 50 }); // Reset trạng thái item
        gsap.set('#om-logo, #om-close-btn, #om-footer', { opacity: 0 }); // Reset trạng thái header/footer
      }
    }).to('#om-overlay', { y: '100%', duration: 0.6, ease: 'cubic-bezier(0.77,0,0.175,1)' });
  }

  /* ── Hover: menu items ── */
  // Gắn hiệu ứng hover cho từng item menu (phóng to, đổi letter-spacing, hiện ảnh...)
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


  /* ── Events ── */
  // Lắng nghe sự kiện mở/đóng menu (click hamburger, click close, nhấn ESC)
  function bindEvents() {
    /* Hamburger open — delegation vì navbar.js inject sau */
    $(document).on('click', '.hamburger-btn', function (e) {
      e.stopPropagation(); e.preventDefault();
      openMenu(); // Mở menu overlay
    });

    $(document).on('click', '#om-close-btn', closeMenu); // Đóng khi bấm nút close
    $(document).on('keydown', e => e.key === 'Escape' && isOpen && closeMenu()); // Đóng khi nhấn ESC
  }

  /* ── Init ── */

  // Hàm khởi tạo: build overlay, set trạng thái ban đầu, gắn event, log
  function init() {
    const BASE = getBase(); // Lấy base path
    buildOverlay(BASE); // Tạo overlay nếu chưa có

    /* Set trạng thái ban đầu cho các thành phần để animation mượt mà */
    gsap.set('.om-img--left',  { x: -12, scale: 0.96, opacity: 0 });
    gsap.set('.om-img--right', { x:  12, scale: 0.96, opacity: 0 });

    bindItemHover(); // Gắn hiệu ứng hover cho item
    bindEvents(); // Gắn event mở/đóng menu
  }

  // Khởi tạo khi window load (delay 50ms để chắc chắn DOM đã sẵn sàng)
  $(window).on('load', () => setTimeout(init, 50));

})(jQuery);