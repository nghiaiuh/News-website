$(function () {
	const FEEDBACK_TIMEOUT = 5000;
	const storageKeys = {
		users: "users",
	};

	const messageEl = $("#registerMessage");
	const submitBtn = $(".news-auth-submit");
	const passwordStrengthBar = $("#passwordStrengthBar");
	const passwordStrengthText = $("#passwordStrengthText");
	let feedbackTimer;

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

	function setInputState(input, isValid) {
		input.removeClass("is-invalid is-valid");
		if (isValid === true) {
			input.addClass("is-valid");
			return;
		}
		if (isValid === false) {
			input.addClass("is-invalid");
		}
	}

	function normalizeText(value) {
		return value.trim();
	}

	function scorePassword(password) {
		let score = 0;
		if (password.length >= 8) score += 1;
		if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
		if (/\d/.test(password)) score += 1;
		if (/[^A-Za-z\d]/.test(password)) score += 1;
		return score;
	}

	function updatePasswordStrength(password) {
		if (!passwordStrengthBar.length || !passwordStrengthText.length) {
			return;
		}

		const score = scorePassword(password);
		const width = [0, 25, 50, 75, 100][score];
		const labels = [
			"Mật khẩu nên có chữ hoa, chữ thường, số và ký tự đặc biệt.",
			"Độ mạnh: Rất yếu",
			"Độ mạnh: Trung bình",
			"Độ mạnh: Khá",
			"Độ mạnh: Mạnh",
		];
		const colors = ["#b8b8b0", "#c0392b", "#d68910", "#1f8f4d", "#0f6b2b"];

		passwordStrengthBar.css({
			width: width + "%",
			backgroundColor: colors[score],
		});
		passwordStrengthText.text(labels[score]);
	}

	function setMessage(text, type, autoHide = true) {
		messageEl
			.text(text)
			.removeClass("is-error is-success is-warning is-info is-visible");
		if (type) {
			messageEl.addClass(type);
		}
		if (text) {
			messageEl.addClass("is-visible");
		}
		if (feedbackTimer) {
			clearTimeout(feedbackTimer);
		}
		if (autoHide && text) {
			feedbackTimer = setTimeout(function () {
				messageEl
					.removeClass("is-visible is-error is-success is-warning is-info")
					.text("");
			}, FEEDBACK_TIMEOUT);
		}
	}

	function validateUsername() {
		const unameInput = $("#uname");
		const errorUname = $("#txt_uname");
		const value = normalizeText(unameInput.val());
		const usernameRegex = /^[A-Za-z0-9_]{4,20}$/;

		if (!value) {
			setFieldMessage(errorUname, "Tên người dùng không được bỏ trống.");
			setInputState(unameInput, false);
			return false;
		}

		if (!usernameRegex.test(value)) {
			setFieldMessage(
				errorUname,
				"Tên đăng nhập 4-20 ký tự, chỉ gồm chữ, số hoặc dấu gạch dưới."
			);
			setInputState(unameInput, false);
			return false;
		}

		unameInput.val(value);
		setFieldMessage(errorUname, "");
		setInputState(unameInput, true);
		return true;
	}

	function validatePassword() {
		const passwordInput = $("#password");
		const errorPassword = $("#txt_password");
		const passwordValue = String(passwordInput.val());
		const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,32}$/;

		updatePasswordStrength(passwordValue);

		if (!passwordValue) {
			setFieldMessage(errorPassword, "Vui lòng nhập mật khẩu.");
			setInputState(passwordInput, false);
			return false;
		}

		if (!passwordRegex.test(passwordValue)) {
			setFieldMessage(
				errorPassword,
				"Mật khẩu 8-32 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
			);
			setInputState(passwordInput, false);
			return false;
		}

		setFieldMessage(errorPassword, "");
		setInputState(passwordInput, true);
		return true;
	}

	function validatePasswordAuth() {
		const passwordInput = $("#password");
		const passAuthInput = $("#passauth");
		const errorPassauth = $("#txt_passauth");
		const passAuthValue = String(passAuthInput.val());
		const passwordValue = String(passwordInput.val());

		if (!passAuthValue) {
			setFieldMessage(errorPassauth, "Vui lòng nhập lại mật khẩu.");
			setInputState(passAuthInput, false);
			return false;
		}

		if (passAuthValue !== passwordValue) {
			setFieldMessage(errorPassauth, "Mật khẩu nhập lại phải khớp.");
			setInputState(passAuthInput, false);
			return false;
		}

		setFieldMessage(errorPassauth, "");
		setInputState(passAuthInput, true);
		return true;
	}

	function validateEmail() {
		const emailInput = $("#email");
		const errorEmail = $("#txt_email");
		const emailValue = normalizeText(emailInput.val()).toLowerCase();
		const regex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

		if (!emailValue) {
			setFieldMessage(errorEmail, "Vui lòng nhập email.");
			setInputState(emailInput, false);
			return false;
		}

		if (!regex.test(emailValue)) {
			setFieldMessage(errorEmail, "Email chưa đúng định dạng.");
			setInputState(emailInput, false);
			return false;
		}

		emailInput.val(emailValue);
		setFieldMessage(errorEmail, "");
		setInputState(emailInput, true);
		return true;
	}

	function validatePhone() {
		const phoneInput = $("#phone");
		const errorPhone = $("#txt_phone");
		const phoneValue = normalizeText(phoneInput.val()).replace(/\D/g, "");
		const phoneRegex = /^0\d{9,10}$/;

		if (!phoneValue) {
			setFieldMessage(errorPhone, "Vui lòng nhập số điện thoại.");
			setInputState(phoneInput, false);
			return false;
		}

		if (!phoneRegex.test(phoneValue)) {
			setFieldMessage(
				errorPhone,
				"Số điện thoại phải bắt đầu bằng 0 và có 10-11 chữ số."
			);
			setInputState(phoneInput, false);
			return false;
		}

		phoneInput.val(phoneValue);
		setFieldMessage(errorPhone, "");
		setInputState(phoneInput, true);
		return true;
	}

	$("#uname").on("blur", validateUsername);
	$("#password").on("blur", function () {
		validatePassword();
		validatePasswordAuth();
	});
	$("#password").on("input", function () {
		updatePasswordStrength(String($(this).val()));
	});
	$("#passauth").on("blur", validatePasswordAuth);
	$("#email").on("blur", validateEmail);
	$("#phone").on("blur", validatePhone);
	$("#phone").on("input", function () {
		const numericValue = String($(this).val()).replace(/\D/g, "");
		$(this).val(numericValue);
	});

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
			setMessage("Vui lòng kiểm tra lại thông tin.", "is-warning");
			submitBtn.removeClass("is-loading").attr("disabled", false);
			return;
		}

		const users = getUsers();
		const username = normalizeText($("#uname").val());
		const email = normalizeText($("#email").val()).toLowerCase();
		const phone = normalizeText($("#phone").val()).replace(/\D/g, "");

		const usernameExists = users.some(
			(user) => String(user.username).toLowerCase() === username.toLowerCase()
		);
		if (usernameExists) {
			setMessage("Tên đăng nhập đã tồn tại. Hãy chọn tên khác.", "is-error");
			setInputState($("#uname"), false);
			submitBtn.removeClass("is-loading").attr("disabled", false);
			return;
		}

		const emailExists = users.some(
			(user) => String(user.email).toLowerCase() === email.toLowerCase()
		);
		if (emailExists) {
			setMessage("Email đã tồn tại. Hãy dùng email khác.", "is-error");
			setInputState($("#email"), false);
			submitBtn.removeClass("is-loading").attr("disabled", false);
			return;
		}

		const user = {
			username: username,
			password: String($("#password").val()),
			email: email,
			phone: phone,
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
