/* =============================================================
   footer.js — Shared Footer Component
   <div id="site-footer"></div>
   ============================================================= */
$(() => {
  const $slot = $("#site-footer");
  if (!$slot.length) return;

  const BASE = ($slot.data("base") || "./").replace(/\/?$/, "/");
  const r = (h) => BASE + h.replace(/^\.?\//, "");

  $slot.html(`
    <footer class="site-footer">
      <div class="container-fluid px-4 px-xl-5 pb-0 pt-5">
        
        <!-- Top Section -->
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-4">
          
          <!-- Logo & Socials -->
          <div class="d-flex flex-column align-items-start gap-4">
            <span class="footer-logo">Báo Chí Design</span>
            <div class="d-flex gap-3">
              <!-- youtube -->
              <a href="https://www.youtube.com/@nghia_game_dev" class="social-circle">
                <img src="${r('images/footer/ytb.png')}" alt="YouTube" width="22" height="22">
              </a>
              <!-- github -->
              <a href="https://github.com/nghiaiuh/News-website" class="social-circle">
                <img src="${r('images/footer/github.png')}" alt="GitHub" width="22" height="22">
              </a>
              <!-- linkedin -->
              <a href="https://www.linkedin.com/in/ngh%C4%A9a-phan-np061010/" class="social-circle">
                <img src="${r('images/footer/lki.png')}" alt="LinkedIn" width="22" height="22">
              </a>
            </div>
          </div>

          <!-- Login CTA -->
          <div class="d-flex flex-column align-items-md-end gap-3 w-100 newsletter-wrapper ms-md-auto">
            <span class="fs-6">Đăng nhập để trở thành người đóng góp</span>
            <a href="${r('html/dang-nhap.html')}" class="newsletter-input w-100 d-flex justify-content-between align-items-center text-decoration-none">
              <span class="text-white-50">Đăng nhập / Đăng ký...</span>
              <img src="${r('images/footer/paper-plane.png')}" alt="paper-plane" class="send-icon" width="20" height="20">
            </a>
          </div>

        </div>

        <div class="footer-divider mb-5"></div>

        <!-- Middle Section: Grid Links -->
        <div class="row g-4 mb-5">
          <!-- Col 1 -->
          <div class="col-6 col-md-4 col-lg-2">
            <h5 class="footer-col-title mb-4 fs-6">Space and Universe</h5>
            <ul class="list-unstyled d-flex flex-column gap-3 mb-0">
              <li><a href="#" class="footer-link">NASA Missions</a></li>
              <li><a href="#" class="footer-link">Extraterrestrials</a></li>
              <li><a href="#" class="footer-link">New Planet Discovery</a></li>
              <li><a href="#" class="footer-link">Neighborhood Planets</a></li>
              <li><a href="#" class="footer-link">Satellite News</a></li>
              <li><a href="#" class="footer-link">Astronaut Insights</a></li>
            </ul>
          </div>
          <!-- Col 2 -->
          <div class="col-6 col-md-4 col-lg-2">
            <h5 class="footer-col-title mb-4 fs-6">Our Planet</h5>
            <ul class="list-unstyled d-flex flex-column gap-3 mb-0">
              <li><a href="#" class="footer-link">Earth</a></li>
              <li><a href="#" class="footer-link">Discover Animals</a></li>
              <li><a href="#" class="footer-link">Plants and the Life</a></li>
              <li><a href="#" class="footer-link">Human &amp; Civilization</a></li>
              <li><a href="#" class="footer-link">History &amp; Future</a></li>
              <li><a href="#" class="footer-link">Predict the Future</a></li>
            </ul>
          </div>
          <!-- Col 3 -->
          <div class="col-6 col-md-4 col-lg-2">
            <h5 class="footer-col-title mb-4 fs-6">Health and Science</h5>
            <ul class="list-unstyled d-flex flex-column gap-3 mb-0">
              <li><a href="#" class="footer-link">Newest Science</a></li>
              <li><a href="#" class="footer-link">Science Projects</a></li>
              <li><a href="#" class="footer-link">Science for Humanity</a></li>
              <li><a href="#" class="footer-link">The Reality of Science</a></li>
              <li><a href="#" class="footer-link">Human Health</a></li>
              <li><a href="#" class="footer-link">Animals &amp; Plants Health</a></li>
            </ul>
          </div>
          <!-- Col 4 -->
          <div class="col-6 col-md-4 col-lg-2">
            <h5 class="footer-col-title mb-4 fs-6">Technology</h5>
            <ul class="list-unstyled d-flex flex-column gap-3 mb-0">
              <li><a href="#" class="footer-link">Newest Technology</a></li>
              <li><a href="#" class="footer-link">Technology for Humanity</a></li>
              <li><a href="#" class="footer-link">Technology for Animals</a></li>
              <li><a href="#" class="footer-link">Technology for Plants</a></li>
              <li><a href="#" class="footer-link">Technology for the Planet</a></li>
              <li><a href="#" class="footer-link">Technology for the Future</a></li>
            </ul>
          </div>
          <!-- Col 5 -->
          <div class="col-6 col-md-4 col-lg-2">
            <h5 class="footer-col-title mb-4 fs-6">Our Community</h5>
            <ul class="list-unstyled d-flex flex-column gap-3 mb-0">
              <li><a href="#" class="footer-link">About Us</a></li>
              <li><a href="#" class="footer-link">Advertise</a></li>
              <li><a href="#" class="footer-link">Events</a></li>
              <li><a href="#" class="footer-link">People Insights</a></li>
              <li><a href="#" class="footer-link">Satellite News</a></li>
              <li><a href="#" class="footer-link">Astronaut Insights</a></li>
            </ul>
          </div>
          <!-- Col 6 -->
          <div class="col-6 col-md-4 col-lg-2">
            <h5 class="footer-col-title mb-4 fs-6">Our Podcasts</h5>
            <ul class="list-unstyled d-flex flex-column gap-3 mb-0">
              <li><a href="#" class="footer-link">It's All About Earth!</a></li>
              <li><a href="#" class="footer-link">Become an Astronauts</a></li>
              <li><a href="#" class="footer-link">Discover Other Life?</a></li>
              <li><a href="#" class="footer-link">Our Neighborhoods</a></li>
              <li><a href="#" class="footer-link">Earth From Space</a></li>
              <li><a href="#" class="footer-link">The Future of Human</a></li>
            </ul>
          </div>
        </div>

        <div class="footer-divider mb-3"></div>

        <!-- Bottom Section -->
        <div class="text-center pb-4 pt-2">
          <p class="copyright-text mb-0 px-3">
            © 2026 Báo Chí Design, LLC. All Rights Reserved. Use of this site constitutes acceptance of our Terms of Service, Privacy Policy and Do Not Sell or Share My Personal Information. Báo Chí Design may receive compensation for some links to products and services on this website. Offers may be subject to change without notice.
          </p>
        </div>

      </div>
    </footer>
  `);
});
