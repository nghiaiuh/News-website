$(function () {
  const storageKeys = {
    users: "users",
    isLoggedIn: "isLoggedIn",
    username: "username",
  };

  const messageEl = $("#loginMessage");
  const submitBtn = $(".news-auth-submit");

  function getUsers() {
    const rawUsers = localStorage.getItem(storageKeys.users);
    if (rawUsers) {
      try {
        const parsed = JSON.parse(rawUsers);
        return Array.isArray(parsed) ? parsed : [];
      } catch (error) {
        return [];
      }
    }

    const legacyUser = localStorage.getItem("user");
    if (legacyUser) {
      try {
        const parsed = JSON.parse(legacyUser);
        if (parsed && parsed.username) {
          const migrated = [parsed];
          localStorage.setItem(storageKeys.users, JSON.stringify(migrated));
          return migrated;
        }
      } catch (error) {
        return [];
      }
    }

    return [];
  }

  function setMessage(text, type) {
    messageEl.text(text).removeClass("is-error is-success");
    if (type) {
      messageEl.addClass(type);
    }
  }

  function displayUserOptions(username) {
    $("#register-link").hide();
    $("#login-link").hide();
    $("#user-options").html(
      `
      <li class="list-inline-item mx-2"><span>${username}</span></li>
      <li class="list-inline-item mx-2" style="padding-right:15px;">
        <a href="#" id="logout">Đăng xuất</a>
      </li>
    `
    );
  }

  const isLoggedIn = localStorage.getItem(storageKeys.isLoggedIn);
  const username = localStorage.getItem(storageKeys.username);
  if (isLoggedIn === "true" && username) {
    displayUserOptions(username);
  }

  $("#loginForm").on("submit", function (event) {
    event.preventDefault();
    submitBtn.addClass("is-loading").attr("disabled", true);
    setMessage("", null);

    const enteredUsername = $("#uname").val().trim();
    const enteredPassword = $("#password").val().trim();

    if (!enteredUsername || !enteredPassword) {
      setMessage("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.", "is-error");
      submitBtn.removeClass("is-loading").attr("disabled", false);
      return;
    }

    const users = getUsers();
    if (users.length === 0) {
      setMessage("Không tìm thấy người dùng. Hãy đăng ký tài khoản.", "is-error");
      submitBtn.removeClass("is-loading").attr("disabled", false);
      return;
    }

    const foundUser = users.find((user) => user.username === enteredUsername);
    if (!foundUser || foundUser.password !== enteredPassword) {
      setMessage("Thông tin đăng nhập không đúng.", "is-error");
      submitBtn.removeClass("is-loading").attr("disabled", false);
      return;
    }

    setMessage("Đăng nhập thành công!", "is-success");
    localStorage.setItem(storageKeys.isLoggedIn, "true");
    localStorage.setItem(storageKeys.username, enteredUsername);
    displayUserOptions(enteredUsername);

    setTimeout(function () {
      window.location.href = "Home.html";
    }, 500);
  });

  $(document).on("click", "#logout", function (event) {
    event.preventDefault();
    localStorage.removeItem(storageKeys.isLoggedIn);
    localStorage.removeItem(storageKeys.username);
    window.location.href = "dang-nhap.html";
  });
});
