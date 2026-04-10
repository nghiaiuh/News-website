document.addEventListener("DOMContentLoaded", function () {
    const messageEl = $("#registerMessage");
    const submitBtn = $(".nw-auth-submit");

    function setFieldMessage(target, text) {
        if (!text) {
            target.text("").removeClass("is-error");
            return;
        }

        target.text(text).addClass("is-error");
    }

    function validateUsername() {
        const unameInput = $("#uname");
        const errorUname = $("#txt_uname");
        if (unameInput.val().trim() === "") {
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
        const regx = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

        if (!regx.test(emailValue)) {
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

    $("#uname").focusout(validateUsername);
    $("#password").focusout(validatePassword);
    $("#passauth").focusout(validatePasswordAuth);
    $("#email").focusout(validateEmail);
    $("#phone").focusout(validatePhone);

    $("#registerForm").on("submit", function (event) {
        event.preventDefault();
        messageEl.text("").removeClass("is-error is-success");
        submitBtn.addClass("is-loading").attr("disabled", true);

        const validUsername = validateUsername();
        const validPassword = validatePassword();
        const validPassauth = validatePasswordAuth();
        const validEmail = validateEmail();
        const validPhone = validatePhone();

        if (!(validUsername && validPassword && validPassauth && validEmail && validPhone)) {
            messageEl.text("Vui lòng kiểm tra lại thông tin.").addClass("is-error");
            submitBtn.removeClass("is-loading").attr("disabled", false);
            return;
        }

        const storedUser = JSON.parse(localStorage.getItem("user"));
        const username = $("#uname").val().trim();

        if (storedUser && storedUser.username === username) {
            messageEl
                .text("Tên đăng nhập đã tồn tại. Hãy chọn tên khác.")
                .addClass("is-error");
            submitBtn.removeClass("is-loading").attr("disabled", false);
            return;
        }

        const user = {
            username: username,
            password: $("#password").val().trim(),
            email: $("#email").val().trim(),
            phone: $("#phone").val().trim(),
        };

        localStorage.setItem("user", JSON.stringify(user));
        messageEl
            .text("Đăng ký thành công! Đang chuyển tới đăng nhập...")
            .addClass("is-success");

        setTimeout(function () {
            window.location.href = "dang-nhap.html";
        }, 700);
    });
});

