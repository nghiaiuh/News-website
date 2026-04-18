# Bài tập lớn môn Hệ Thống và Công nghệ Web
BÁO CHÍ DESIGN - News Website Project
Một dự án website tin tức hiện đại với giao diện đột phá, tập trung vào trải nghiệm người dùng thông qua các hiệu ứng chuyển động mượt mà (GSAP) và bố cục linh hoạt (Grid & Flexbox).

 Tính năng nổi bật
Thiết kế Modern UI/UX: Sử dụng phong cách typography lớn, khoảng trắng cân đối và màu sắc tương phản mạnh.

Horizontal Scrolling: Trải nghiệm đọc tin tức theo chiều ngang (Horizontal Feed) độc đáo tại trang chủ và các chuyên mục.

Hiệu ứng GSAP: Tích hợp ScrollTrigger và GSAP để tạo các chuyển động parallax, mượt mà khi người dùng cuộn trang.

Hệ thống Auth: Giao diện Đăng ký/Đăng nhập chuyên nghiệp với validation và hiệu ứng chuyển cảnh intro.

Custom Cursor: Con trỏ chuột tùy chỉnh (#news-cursor) tăng tính thẩm mỹ và tương tác cho website.

Responsive: Hiển thị hoàn hảo trên mọi thiết bị từ Mobile đến Desktop nhờ hệ thống lưới của Bootstrap 5.

Cấu trúc thư mục chính
.
├── html/                           # Thư mục chứa giao diện người dùng
│   ├── Home.html                   # Trang chủ (Horizontal Feed & GSAP)
│   ├── the-thao-suc-khoe.html      # Trang chuyên mục Thể thao & Sức khỏe
│   ├── dang-nhap.html              # Trang đăng nhập
│   ├── dang-ky.html                # Trang đăng ký tài khoản
│   ├── the-thao-football-detail.html # Chi tiết tin Bóng đá
│   ├── the-thao-f1-detail.html       # Chi tiết tin F1
│   ├── the-thao-nba-detail.html      # Chi tiết tin Bóng rổ
│   ├── suc-khoe-mental-detail.html   # Chi tiết tin Sức khỏe tinh thần
│   ├── suc-khoe-nutrition-detail.html # Chi tiết tin Dinh dưỡng
│   └── suc-khoe-yoga-detail.html      # Chi tiết tin Yoga
│
├── css/                            # Hệ thống định dạng (Module hóa)
│   ├── root.css                    # Định nghĩa Variables (Màu sắc, Font)
│   ├── index.css                   # Styles chung (Navbar, Footer, Cursor)
│   ├── local-fonts.css             # Cấu hình nhúng Font nội bộ
│   ├── horizontal-feed.css         # Layout cuộn ngang Hero Section
│   ├── section2.css                # Styles chuyên mục Kinh tế & Chính trị
│   ├── section3.css                # Styles Collage & Gallery Thể thao
│   ├── section4.css                # Layout Grid tin tức tổng hợp
│   ├── article-detail.css          # Styles giao diện đọc bài viết chi tiết
│   ├── login.css                   # Styles trang Auth & hiệu ứng Shapes
│   └── bootstrap.min.css           # Framework Bootstrap 5
│
├── js/                             # Kịch bản xử lý & Animation
│   ├── auth.js                     # Quản lý xác thực & Trạng thái người dùng
│   ├── login.js                    # Logic xử lý Form đăng nhập
│   ├── dang-ky.js                  # Logic xử lý Form đăng ký
│   ├── heroSection.js              # Hiệu ứng cho Section đầu trang
│   ├── sectionTwo.js               # Điều khiển cuộn ngang GSAP (S2)
│   ├── sectionThree.js             # Logic chuyển đổi Tab Thể thao (S3)
│   ├── cursor.js                   # Xử lý Custom Cursor (Con trỏ chuột)
│   └── gsap/                       # Thư viện Animation chuyên sâu
│       ├── gsap.min.js             # Core engine
│       └── ScrollTrigger.min.js    # Plugin hỗ trợ hiệu ứng khi cuộn
│
├── fonts/                          # Tài nguyên Font chữ nội bộ
│   └── google/                     # Các bộ font (Inter, Oswald, Dancing Script...)
│
├── images/                         # Tài nguyên hình ảnh minh họa bài viết
│
└── README.md                       # Tài liệu hướng dẫn dự án                   
🛠️ Công nghệ sử dụng
Frontend: HTML5, CSS3 (Custom Properties), Bootstrap 5.

Animations: GSAP (GreenSock Animation Platform) & ScrollTrigger.

Scripting: JavaScript (ES6+), jQuery 3.7.1.

Fonts: Tích hợp bộ font nội bộ (Local fonts) tối ưu tốc độ tải.

🚀 Hướng dẫn sử dụng
Clone dự án:

Bash
git clone https://github.com/your-username/news-website.git
Mở trình duyệt: Chạy tệp html/Home.html bằng Live Server trên VS Code hoặc mở trực tiếp để trải nghiệm.

Tương tác: * Kéo ngang ở các Section "Tin tức online" hoặc "Thể thao".

Nhấp vào các thẻ bài viết để xem nội dung chi tiết.

👥 Thành viên thực hiện
Nhóm: Nhóm 8
Phan Hồ Sơn Nghĩa(nhóm trưởng)
Dương Công Khoa
Đào Tấn Tuyên
Phạm Nguyễn Phúc Khang
Huỳnh Vĩnh Lợi
Huỳnh Bảo Duy
Đào Văn Hào

Dự án: Bài tập môn Thiết kế Web / Đồ án học phần.

📝 Lưu ý kỹ thuật
Dự án sử dụng scrollRestoration = "manual" và ghi đè scroll-behavior: auto để tránh xung đột giữa tính năng cuộn mượt tự nhiên của trình duyệt và các hiệu ứng ScrollTrigger của GSAP, đảm bảo vị trí tính toán của các thẻ tin tức luôn chính xác.