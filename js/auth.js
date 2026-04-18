document.addEventListener("DOMContentLoaded", function () {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  const username = localStorage.getItem("username");

  if (isLoggedIn === "true" && username) {
    displayUserOptions(username);
  }

  // Xử lý đăng nhập
  $("#loginForm").submit(function (event) {
    event.preventDefault();
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const messageEl = $("#loginMessage");
    const submitBtn = $(".news-auth-submit");

    submitBtn.addClass("is-loading").attr("disabled", true);
    messageEl.text("").removeClass("is-error is-success");

    if (!storedUser) {
      messageEl
        .text("Không tìm thấy người dùng. Hãy đăng ký tài khoản.")
        .addClass("is-error");
      submitBtn.removeClass("is-loading").attr("disabled", false);
      return;
    }

    const enteredUsername = $("#uname").val().trim();
    const enteredPassword = $("#password").val().trim();

    if (!enteredUsername || !enteredPassword) {
      messageEl
        .text("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.")
        .addClass("is-error");
      submitBtn.removeClass("is-loading").attr("disabled", false);
      return;
    }

    if (
      storedUser.username === enteredUsername &&
      storedUser.password === enteredPassword
    ) {
      messageEl.text("Đăng nhập thành công!").addClass("is-success");
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("username", enteredUsername);
      displayUserOptions(enteredUsername);
      setTimeout(function () {
        window.location.href = "Home.html";
      }, 500);
    } else {
      messageEl
        .text("Thông tin đăng nhập không đúng.")
        .addClass("is-error");
      submitBtn.removeClass("is-loading").attr("disabled", false);
    }
  });

  // Hàm hiển thị tên người dùng và tùy chọn Đăng xuất
  function displayUserOptions(username) {
    $("#register-link").hide();
    $("#login-link").hide();
    $("#user-options").html(`
      <li class="list-inline-item mx-2">
        <span><i class="fa fa-user"></i> ${username}</span>
      </li>
      <li class="list-inline-item mx-2" style="padding-right: 15px;">
        <a href="#" id="logout">Đăng xuất</a>
      </li>
    `);
  }

  // Xử lý đăng xuất
  $(document).on("click", "#logout", function () {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("username");
    window.location.href = "dang-nhap.html";
  });
});