<a id="readme-top"></a>

<!-- PROJECT SHIELDS -->

[![HTML5][HTML5-shield]][HTML5-url]
[![CSS3][CSS3-shield]][CSS3-url]
[![JavaScript][JS-shield]][JS-url]
[![Bootstrap][Bootstrap-shield]][Bootstrap-url]
[![GSAP][GSAP-shield]][GSAP-url]
[![jQuery][jQuery-shield]][jQuery-url]

[HTML5-shield]: https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white
[HTML5-url]: https://developer.mozilla.org/en-US/docs/Web/HTML
[CSS3-shield]: https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white
[CSS3-url]: https://developer.mozilla.org/en-US/docs/Web/CSS
[JS-shield]: https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black
[JS-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript
[Bootstrap-shield]: https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com/
[GSAP-shield]: https://img.shields.io/badge/GSAP-ScrollTrigger-88CE02?style=for-the-badge&logo=greensock&logoColor=white
[GSAP-url]: https://gsap.com/
[jQuery-shield]: https://img.shields.io/badge/jQuery-4.0-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[jQuery-url]: https://jquery.com/

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <h1 align="center">📰 BÁO CHÍ DESIGN</h1>
  <p align="center">
    Website tin tức hiện đại — Multi-section layout, GSAP animations, horizontal scrolling & modular CSS architecture
    <br />
    <em>Bài tập lớn môn Hệ Thống và Công nghệ Web — Nhóm 8</em>
  </p>
</div>

---

<!-- TABLE OF CONTENTS -->
<details>
  <summary>📋 Mục lục</summary>
  <ol>
    <li><a href="#giới-thiệu-dự-án">Giới thiệu dự án</a></li>
    <li><a href="#công-nghệ-sử-dụng">Công nghệ sử dụng</a></li>
    <li><a href="#cấu-trúc-dự-án">Cấu trúc dự án</a></li>
    <li><a href="#kiến-trúc-css">Kiến trúc CSS</a></li>
    <li><a href="#kiến-trúc-javascript">Kiến trúc JavaScript</a></li>
    <li><a href="#các-trang-html">Các trang HTML</a></li>
    <li><a href="#design-tokens">Design Tokens (root.css)</a></li>
    <li><a href="#quy-ước-đặt-tên">Quy ước đặt tên</a></li>
    <li><a href="#bắt-đầu">Bắt đầu</a></li>
    <li><a href="#lưu-ý-kỹ-thuật">Lưu ý kỹ thuật</a></li>
    <li><a href="#thành-viên">Thành viên thực hiện</a></li>
  </ol>
</details>

---

## Giới thiệu dự án

**BÁO CHÍ DESIGN** là một website tin tức tĩnh (static) được xây dựng thuần bằng **HTML · CSS · Vanilla JS**, không dùng framework frontend. Trọng tâm là UI/UX cao cấp thông qua:

- **Horizontal Scrolling Feed** (Section 1 & Section 2) — kéo ngang để duyệt tin
- **GSAP ScrollTrigger** — pinning panel và parallax khi cuộn
- **Sports Preview Gallery** — hover button thể thao để chuyển ảnh gallery động
- **Modular CSS** — mỗi section có file CSS riêng, dùng chung design token từ `root.css`
- **Navbar component** — render bằng JS, dùng lại trên mọi trang

**Chuyên mục:**
| Chuyên mục | Mô tả |
|---|---|
| Trang chủ | Horizontal feed tổng hợp, S2 Kinh tế & Chính trị, S3 Thể thao, S4 Tin nhanh |
| Thể thao | Bóng đá · Bóng rổ · F1 · Tennis · Bóng bầu dục · Cầu lông |
| Giải trí & Đời sống | Tin văn hoá và lối sống |
| Vũ trụ & Thiên nhiên | Tin khoa học tự nhiên |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Công nghệ sử dụng

| Lớp        | Công nghệ                        | Ghi chú                                                                               |
| ---------- | -------------------------------- | ------------------------------------------------------------------------------------- |
| Markup     | HTML5                            | Semantic elements, ARIA attributes                                                    |
| Styling    | Vanilla CSS3 + Custom Properties | Modular, không dùng preprocessor                                                      |
| Layout     | Bootstrap 5 (utility-first)      | Grid, Flexbox, spacing utilities                                                      |
| Animation  | GSAP 3 + ScrollTrigger           | Horizontal scroll pin, parallax                                                       |
| Scripting  | JavaScript ES6+ (Vanilla)        | Module-per-section pattern                                                            |
| DOM helper | jQuery 4.0.0                     | Dùng trong form validation (login/register)                                           |
| Fonts      | Local Fonts (self-hosted)        | Inter, Oswald, Merriweather, Playfair Display, Dancing Script, Space Mono, Newsreader |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Cấu trúc dự án

```
News_website/
│
├── html/                              # Tất cả trang HTML
│   ├── index.html                     # Trang chủ chính ← entry point
│   ├── dang-nhap.html                 # Trang đăng nhập
│   ├── dang-ky.html                   # Trang đăng ký
│   ├── giaitri-doisong.html           # Hub Giải trí & Đời sống
│   ├── kinhte-chinhtri.html           # Hub Kinh tế & Chính trị
│   ├── thethao-suckhoe.html           # Hub Thể thao & Sức khỏe
│   │
│   ├── the-thao/                      # Chi tiết chuyên mục Thể thao
│   │   ├── the-thao-suc-khoe.html     
│   │   ├── the-thao-bong-chuyen.html
│   │   ├── the-thao-messi-vo-dich.html
│   │   ├── the-thao-f1-detail.html
│   │   ├── the-thao-football-detail.html
│   │   ├── the-thao-nba-detail.html
│   │   ├── the-thao-tennis-detail.html
│   │   ├── the-thao-kobe.html
│   │   ├── the-thao-max.html
│   │   ├── the-thao-nadal.html
│   │   ├── suc-khoe-cardio-detail.html
│   │   ├── suc-khoe-tamly-detail.html
│   │   └── suc-khoe-yoga-detail.html
│   │
│   ├── giai-tri-doi-song/             # Chi tiết chuyên mục Giải trí & Đời sống
│   │   ├── an_uong.html
│   │   ├── chuong-chinh-the-thao.html
│   │   ├── Coachella-2026.html
│   │   ├── concern_chayVE.html
│   │   ├── Dune_PartTwo.html
│   │   ├── le-hoi-he.html
│   │   ├── loi-song.html
│   │   ├── loiich-thethao.html
│   │   ├── nghesi_tre.html
│   │   ├── phong-cach-song.html
│   │   ├── phuquoc.html
│   │   ├── setup-phong.html
│   │   ├── song-toi-gian.html
│   │   ├── top_phim.html
│   │   ├── typhu.html
│   │   └── worldcup.html
│   │
│   ├── kinh-te-chinh-tri/             # Chi tiết chuyên mục Kinh tế & Chính trị
│   │   ├── kinh-te-chinh-tri-details.html
│   │   ├── bo-cong-thuong-khuyen-nghi-doanh-nghiep-giam-rui-ro-trung-dong.html
│   │   ├── chu-tich-quoc-hoi-toa-dam-viet-nam-tho-nhi-ky.html
│   │   ├── israel-iran-an-mieng-tra-mieng-thuong-vong-tang.html
│   │   ├── my-cong-bo-300-nguoi-noi-tieng-trong-ho-so-epstein.html
│   │   ├── my-tuyen-bo-thang-loi-iran-oman-thu-phi-hormuz.html
│   │   ├── quoc-hoi-rut-ngan-nhiem-ky-khoa-xv.html
│   │   ├── to-lam-du-le-ky-niem-120-nam-ha-huy-tap.html
│   │   ├── to-lam-nang-tam-ket-noi-viet-trung.html
│   │   ├── tong-thong-han-quoc-lee-jae-myung-tham-viet-nam.html
│   │   ├── tuong-lai-bat-dinh-cua-tau-hang-iran-bi-my-bat.html
│   │   ├── uav-iran-danh-trung-co-so-cia-arab-saudi.html
│   │   └── viet-nam-binh-on-thi-truong-nang-luong-truoc-bien-dong-gia-dau.html
│   │
│   └── vu-tru-thien-nhien/            # Chi tiết chuyên mục Vũ Trụ & Thiên Nhiên
│       ├── vu-tru-thien-nhien.html
│       ├── artemisII.html
│       ├── Chonkers.html
│       ├── Storie.html
│       └── X-59.html
│
├── css/
│   ├── components/                    # Global/shared styles
│   │   ├── root.css                   # ★ Design tokens (variables)
│   │   ├── navbar.css                 # Navigation bar
│   │   ├── footer.css                 # Footer
│   │   ├── overlay-menu.css           # Overlay menu
│   │   └── account-overlay.css        # Account overlay
│   │
│   ├── index/                         # Styles riêng cho từng Section của trang chủ
│   │   ├── section1.css ... section6.css
│   │   ├── horizontal-feed.css
│   │   └── responsive.css
│   │
│   ├── chitiettintuc/                 # CSS cho bài viết chi tiết theo nhóm
│   │   ├── article-GTvDS.css
│   │   ├── article-KTvCT.css
│   │   ├── article-TTvSK.css
│   │   └── article-VTvTN.css
│   │
│   ├── chudetintuc/                   # CSS cho trang hub chuyên mục
│   │   ├── chude_VTvTN.css
│   │   └── artemisII.css
│   │
│   ├── local-fonts.css                # Font-face declarations
│   ├── login.css                      # Auth pages styling
│   ├── article-detail.css             # Generic article layout
│   ├── bootstrap.min.css              # Vendor: Bootstrap 5
│   └── ...
│
├── js/
│   ├── components/                    # Core UI components logic
│   │   ├── navbar.js
│   │   ├── footer.js
│   │   ├── overlay-menu.js
│   │   └── account-overlay.js
│   │
│   ├── index/                         # Scripts cho trang chủ
│   │   ├── horizontalFeed.js
│   │   ├── sectionTwo.js ... section6.js
│   │   └── sectionFive.js
│   │
│   ├── auth.js                        # User session logic
│   ├── login.js                       # Login form handling
│   ├── dang-ky.js                     # Register form handling
│   │
│   └── lib/                           # Vendor libraries
│       ├── gsap/                      # GSAP & ScrollTrigger
│       ├── jquery/                    # jQuery 4.0.0
│       └── bootstrap/                 # Bootstrap JS
│
├── fonts/                             # Local font files
└── images/                            # Assets theo chuyên mục
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Kiến trúc CSS

### Nguyên tắc

- **Single source of truth**: mọi màu, font, spacing, radius, shadow đều là CSS variable trong `css/components/root.css`.
- **Module-per-section**: mỗi section của trang chủ có một file CSS riêng (`section2.css`, `section3.css`...).
- **Bootstrap utilities** được dùng cho spacing/flex/display, **không** cho layout phức tạp.
- **Không hardcode giá trị** — luôn dùng CSS variable hoặc `clamp()` để responsive.

### Thứ tự load CSS (trong `<head>`)

```html
local-fonts.css → @font-face bootstrap.min.css → reset + utilities root.css →
design tokens (:root variables) navbar.css → component section1–4.css →
page-level sections horizontal-feed.css
```

### Prefix conventions

| Prefix           | Scope                                                        |
| ---------------- | ------------------------------------------------------------ |
| `--nw-*`         | CSS variables hiện tại (canonical)                           |
| `--news-*`       | Alias cũ → trỏ về `--nw-*` (backward compat, không thêm mới) |
| `.s2-*`          | Section 2 classes                                            |
| `.s3-*`          | Section 3 classes                                            |
| `.s4-*`          | Section 4 classes                                            |
| `.sports-feed-*` | Carousel tin thể thao trong S3                               |

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Kiến trúc JavaScript

### Pattern chính: Module-per-section + DOMContentLoaded

Mỗi file JS được `defer` load và khởi tạo bằng `DOMContentLoaded`. Không có global state chung giữa các section JS.

```
navbar.js          → inject HTML navbar vào #site-header
auth.js            → đọc/ghi localStorage ("nw_user"), cập nhật UI navbar
horizontalFeed.js  → drag scroll cho .feed-track (Section 1)
sectionTwo.js      → GSAP horizontal pin scroll cho .s2-track
sectionThree.js    → hover .s3-btn → swap .s3-card-gallery img sources
login.js           → form validation, fake auth → lưu localStorage
dang-ky.js         → form validation & đăng ký
```

### sectionThree.js — Sports Preview Logic

```
Selector targets (phải khớp đúng HTML):
  container : #s3-sports-category
  buttons   : .s3-btn (bên trong container)
  gallery   : .s3-card-gallery (ngoài container, trong .s3-pic-gallery)

Event flow:
  mouseenter | focus | click trên .s3-btn
    → remove .is-visible từ tất cả .s3-card-gallery
    → setTimeout(110ms) → đổi img[src] = button.dataset.preview1/2/3
    → requestAnimationFrame → add .is-visible (fade-in via CSS transition)
```

### sectionTwo.js — GSAP Horizontal Scroll

```
GSAP ScrollTrigger pin .s2-wrapper
Scroll dọc → translate .s2-track theo trục X
scrollRestoration = "manual" + scrollBehavior = "auto"
  → bắt buộc để ScrollTrigger.refresh() tính đúng vị trí
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Các trang HTML

| File                                                     | Mô tả                         | JS được load                                                                                                       |
| -------------------------------------------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `html/index.html`                                        | Trang chủ (nhiều section)     | navbar.js, sectionTwo.js, sectionThree.js, sectionFour.js, sectionFive.js, section6.js, horizontalFeed.js, auth.js |
| `html/dang-nhap.html`                                    | Trang đăng nhập               | navbar.js, login.js, auth.js                                                                                       |
| `html/dang-ky.html`                                      | Trang đăng ký                 | navbar.js, dang-ky.js, auth.js                                                                                     |
| `html/the-thao/the-thao-suc-khoe.html`                   | Hub Thể thao & Sức khỏe       | navbar.js, auth.js                                                                                                 |
| `html/the-thao/bong-chuyen.html`                         | Bóng chuyền                   | navbar.js, auth.js                                                                                                 |
| `html/the-thao/messi-vo-dich.html`                       | Messi vô địch                 | navbar.js, auth.js                                                                                                 |
| `html/the-thao/xe-dua-f1.html`                           | Đua xe F1                     | navbar.js, auth.js                                                                                                 |
| `html/the-thao/*-detail.html`                            | Chi tiết bài viết thể thao    | navbar.js, auth.js                                                                                                 |
| `html/giai-tri-doi-song/an_uong.html`                    | Ăn uống                       | navbar.js, auth.js                                                                                                 |
| `html/giai-tri-doi-song/chuong-chinh-the-thao.html`      | Chương trình thể thao         | navbar.js, auth.js                                                                                                 |
| `html/giai-tri-doi-song/concern_chayVE.html`             | Chạy vì sức khoẻ              | navbar.js, auth.js                                                                                                 |
| `html/giai-tri-doi-song/Dune_PartTwo.html`               | Dune Part Two                 | navbar.js, auth.js                                                                                                 |
| `html/giai-tri-doi-song/GiaiTrivsDoiSong.html`           | Giải trí vs Đời sống          | navbar.js, auth.js                                                                                                 |
| `html/giai-tri-doi-song/le-hoi-he.html`                  | Lễ hội hè                     | navbar.js, auth.js                                                                                                 |
| `html/giai-tri-doi-song/loi-song.html`                   | Lối sống                      | navbar.js, auth.js                                                                                                 |
| `html/giai-tri-doi-song/loiich-thethao.html`             | Lợi ích thể thao              | navbar.js, auth.js                                                                                                 |
| `html/giai-tri-doi-song/nghesi_tre.html`                 | Nghệ sĩ trẻ                   | navbar.js, auth.js                                                                                                 |
| `html/giai-tri-doi-song/phong-cach-song.html`            | Phong cách sống               | navbar.js, auth.js                                                                                                 |
| `html/giai-tri-doi-song/phuquoc.html`                    | Phú Quốc                      | navbar.js, auth.js                                                                                                 |
| `html/giai-tri-doi-song/setup-phong.html`                | Setup phòng                   | navbar.js, auth.js                                                                                                 |
| `html/giai-tri-doi-song/song-toi-gian.html`              | Sống tối giản                 | navbar.js, auth.js                                                                                                 |
| `html/giai-tri-doi-song/top_phim.html`                   | Top phim                      | navbar.js, auth.js                                                                                                 |
| `html/giai-tri-doi-song/typhu.html`                      | Tỷ phú                        | navbar.js, auth.js                                                                                                 |
| `html/giai-tri-doi-song/worldcup.html`                   | World Cup                     | navbar.js, auth.js                                                                                                 |
| `html/vu-tru-thien-nhien/vu-tru-thien-nhien-detail.html` | Chi tiết Vũ trụ & Thiên nhiên | navbar.js, auth.js                                                                                                 |
| `html/vu-tru-thien-nhien/vu-tru-thien-nhien.html`     | Vũ trụ & Thiên nhiên          | navbar.js, auth.js                                                                                                 |
| `html/vu-tru-thien-nhien/*`                              | Các trang khác                | navbar.js, auth.js                                                                                                 |

> **Mọi trang phải có** `<div id="site-header"></div>` để navbar.js inject vào.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Design Tokens

Tất cả token được định nghĩa trong **`css/components/root.css`**. AI-agent nên đọc file này trước khi chỉnh sửa bất kỳ style nào.

```css
/* ── Colors ──────────────── */
--nw-text:
  #1c1c1a /* body text */ --nw-bg: #ffffff --nw-accent: #ffdd00
    /* yellow highlight */ --nw-accent-red: #c30000 /* NEW badge, danger */
    /* ── Typography ──────────── */ --nw-font-sans: "Inter",
  sans-serif --nw-font-heading: "Oswald",
  sans-serif --nw-font-display: "Playfair Display",
  serif --nw-font-serif: "Merriweather",
  serif --nw-font-script: "Dancing Script",
  cursive --nw-font-mono: "Space Mono", monospace --nw-font-news: "Newsreader",
  sans-serif /* ── Radius ───────────────── */ --nw-radius-sm: 4px │ -md: 8px
    │ -lg: 12px │ -xl: 16px │ -pill: 999px /* ── Shadows ─────────────── */
    --nw-shadow-sm/-md/-lg/-xl /* ── Transitions ─────────── */
    --nw-transition-fast: 0.2s ease --nw-transition-base: 0.3s ease
    --nw-transition-slow: 0.4s ease;
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Quy ước đặt tên

### CSS Classes

- **BEM-lite**: `.block-element` (gạch nối đơn), không dùng `__` hay `--` modifier thuần BEM
- **Prefix by section**: `.s2-*`, `.s3-*`, `.s4-*`
- **State classes**: `.is-active`, `.is-visible`, `.is-hidden`
- **Bootstrap utilities** được mix trực tiếp trong HTML: `d-flex`, `gap-2`, `mb-0`, `px-3`...

### HTML IDs (quan trọng — dùng cho JS querySelector)

| ID                    | Dùng ở đâu                              |
| --------------------- | --------------------------------------- |
| `#site-header`        | Mọi trang — navbar.js inject vào đây    |
| `#s3-sports-category` | index.html — container buttons thể thao |
| `#s4-section`         | index.html — section 4 anchor           |

### JS File convention

- Mỗi file JS export **không có gì** (IIFE-like qua DOMContentLoaded)
- Function names: `init<FeatureName>()` pattern — ví dụ `initSportsPreview()`, `initSportsFeedNavigation()`
- Event delegation **không dùng** — bind trực tiếp từng element

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Bắt đầu

### Yêu cầu

- Trình duyệt hiện đại (Chrome 90+, Firefox 88+, Edge 90+)
- VS Code + extension **Live Server** (khuyến nghị)

### Chạy dự án

**Cách 1 — Live Server (khuyến nghị):**

1. Mở thư mục `News_website/` bằng VS Code
2. Right-click vào `html/index.html` → **Open with Live Server**
3. Truy cập `http://127.0.0.1:5500/html/index.html`

**Cách 2 — Mở trực tiếp:**

```
Mở file html/index.html bằng trình duyệt
Lưu ý: một số font self-hosted có thể không load nếu dùng file:// protocol
```

### Navigation Flow

```
index.html (trang chủ)
  ├── Header navbar → liên kết chuyên mục
  ├── Section 1: Hero feed (kéo ngang)
  ├── Section 2: Kinh tế & Chính trị (scroll ngang GSAP)
  ├── Section 3: Thể thao (hover buttons + gallery)
  └── Section 4: Tin nhanh + lead story sticky
        └── → the-thao/the-thao-suc-khoe.html
              └── → the-thao/*-detail.html
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Lưu ý kỹ thuật

> **GSAP & scroll-behavior conflict**
>
> Dự án ghi đè `scrollRestoration = "manual"` và `document.documentElement.style.scrollBehavior = "auto"` ngay trong `<head>` (inline script, không defer). Lý do: khi `ScrollTrigger.refresh()` cần scroll về 0 để đo positions, `scroll-behavior: smooth` làm scroll bất đồng bộ → ST đọc vị trí sai → animation bị lệch.
> **Không xoá hoặc defer script này.**

> **Path assets tương đối**
>
> Tất cả `src` và `href` dùng path tương đối từ vị trí file HTML:
>
> - `../images/...` — trang trong subfolder (`the-thao/`, `giai-tri-doi-song/`)
> - `../css/...`, `../js/...` — tương tự
> - `../../images/...` — CSS variable `--sport-icon: url(...)` trong HTML inline style (vì tính từ vị trí CSS)

> **Self-hosted fonts**
>
> Font được khai báo trong `css/local-fonts.css` và trỏ về `fonts/google/`. Không dùng Google Fonts CDN để tránh CORS và tối ưu tốc độ.

> **Auth (localStorage only)**
>
> Không có backend. `auth.js` lưu user object vào `localStorage` key `"nw_user"`. `navbar.js` đọc key này để hiển thị/ẩn nút Login/Logout.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

## Thành viên

**Nhóm 8 — Môn Hệ Thống và Công nghệ Web**

| STT | Họ tên                 | Vai trò     |
| --- | ---------------------- | ----------- |
| 1   | Phan Hồ Sơn Nghĩa      | Nhóm trưởng |
| 2   | Dương Công Khoa        | Thành viên  |
| 3   | Đào Tấn Tuyên          | Thành viên  |
| 4   | Phạm Nguyễn Phúc Khang | Thành viên  |
| 5   | Huỳnh Vĩnh Lợi         | Thành viên  |
| 6   | Huỳnh Bảo Duy          | Thành viên  |
| 7   | Đào Văn Hào            | Thành viên  |

<p align="right">(<a href="#readme-top">back to top</a>)</p>
