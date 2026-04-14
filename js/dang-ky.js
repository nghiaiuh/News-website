$(function () {
  const storageKeys = {
    users: "users",
  };

  const messageEl = $("#registerMessage");
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

  function saveUsers(users) {
    localStorage.setItem(storageKeys.users, JSON.stringify(users));
  }

  function setFieldMessage(target, text) {
    target.text("").removeClass("is-error");
    if (text) {
      target.text(text).addClass("is-error");
    }
  }

  function setMessage(text, type) {
    messageEl.text(text).removeClass("is-error is-success");
    if (type) {
      messageEl.addClass(type);
    }
  }

  function validateUsername() {
    const unameInput = $("#uname");
    const errorUname = $("#txt_uname");
    const value = unameInput.val().trim();

    if (!value) {
      setFieldMessage(errorUname, "Tên người dùng không được bỏ trống.");
      return false;
    }

    setFieldMessage(errorUname, "");
    return true;
  }

  function validatePassword() {
    const passwordInput = $("#password");
    const errorPassword = $("#txt_password");
    const passwordValue = passwordInput.val().trim();
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{6,20}$/;

    if (!passwordValue) {
      setFieldMessage(errorPassword, "Vui lòng nhập mật khẩu.");
      return false;
    }

    if (!passwordRegex.test(passwordValue)) {
      setFieldMessage(
        errorPassword,
        "Mật khẩu 6-20 ký tự, có chữ hoa, chữ thường và số."
      );
      return false;
    }

    setFieldMessage(errorPassword, "");
    return true;
  }

  function validatePasswordAuth() {
    const passwordInput = $("#password");
    const passAuthInput = $("#passauth");
    const errorPassauth = $("#txt_passauth");

    if (!passAuthInput.val().trim()) {
      setFieldMessage(errorPassauth, "Vui lòng nhập lại mật khẩu.");
      return false;
    }

    if (passAuthInput.val().trim() !== passwordInput.val().trim()) {
      setFieldMessage(errorPassauth, "Mật khẩu nhập lại phải khớp.");
      return false;
    }

    setFieldMessage(errorPassauth, "");
    return true;
  }

  function validateEmail() {
    const emailInput = $("#email");
    const errorEmail = $("#txt_email");
    const emailValue = emailInput.val().trim();
    const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!regex.test(emailValue)) {
      setFieldMessage(errorEmail, "Email chưa đúng định dạng.");
      return false;
    }

    setFieldMessage(errorEmail, "");
    return true;
  }

  function validatePhone() {
    const phoneInput = $("#phone");
    const errorPhone = $("#txt_phone");
    const phoneValue = phoneInput.val().trim();
    const phoneRegex = /^0\d{9,10}$/;

    if (!phoneRegex.test(phoneValue)) {
      setFieldMessage(
        errorPhone,
        "Số điện thoại phải bắt đầu bằng 0 và có 10-11 chữ số."
      );
      return false;
    }

    setFieldMessage(errorPhone, "");
    return true;
  }

  $("#uname").on("blur", validateUsername);
  $("#password").on("blur", function () {
    validatePassword();
    validatePasswordAuth();
  });
  $("#passauth").on("blur", validatePasswordAuth);
  $("#email").on("blur", validateEmail);
  $("#phone").on("blur", validatePhone);

  $("#registerForm").on("submit", function (event) {
    event.preventDefault();
    setMessage("", null);
    submitBtn.addClass("is-loading").attr("disabled", true);

    const validUsername = validateUsername();
    const validPassword = validatePassword();
    const validPassauth = validatePasswordAuth();
    const validEmail = validateEmail();
    const validPhone = validatePhone();

    if (!
      (validUsername && validPassword && validPassauth && validEmail && validPhone)
    ) {
      setMessage("Vui lòng kiểm tra lại thông tin.", "is-error");
      submitBtn.removeClass("is-loading").attr("disabled", false);
      return;
    }

    const users = getUsers();
    const username = $("#uname").val().trim();
    const email = $("#email").val().trim();

    const usernameExists = users.some((user) => user.username === username);
    if (usernameExists) {
      setMessage("Tên đăng nhập đã tồn tại. Hãy chọn tên khác.", "is-error");
      submitBtn.removeClass("is-loading").attr("disabled", false);
      return;
    }

    const emailExists = users.some((user) => user.email === email);
    if (emailExists) {
      setMessage("Email đã tồn tại. Hãy dùng email khác.", "is-error");
      submitBtn.removeClass("is-loading").attr("disabled", false);
      return;
    }

    const user = {
      username: username,
      password: $("#password").val().trim(),
      email: email,
      phone: $("#phone").val().trim(),
      createdAt: new Date().toISOString(),
    };

    users.push(user);
    saveUsers(users);

    setMessage("Đăng ký thành công! Đang chuyển tới đăng nhập...", "is-success");

    setTimeout(function () {
      window.location.href = "dang-nhap.html";
    }, 700);
  });
});
