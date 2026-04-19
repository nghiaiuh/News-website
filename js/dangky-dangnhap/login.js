$(function () {
  const FEEDBACK_TIMEOUT = 5000;
  const QUOTE_ROTATE_MS = 5000;
  const storageKeys = {
    users: "users",
    isLoggedIn: "isLoggedIn",
    username: "username",
    rememberedUsername: "rememberedUsername",
  };

  const loginForm = $("#loginForm");
  const messageEl = $("#loginMessage");
  const submitBtn = loginForm.find(".news-auth-submit");
  const usernameInput = $("#uname");
  const passwordInput = $("#password");
  const rememberCheckbox = $("#rememberAccount");
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

  function setMessage(text, type, autoHide = true) {
    if (!messageEl.length) {
      return;
    }

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

  function setupQuoteRotator() {
    $(".news-auth-quote").each(function () {
      const quoteEl = $(this);
      const rawQuotes = quoteEl.data("quotes");
      if (!rawQuotes) {
        return;
      }

      const quotes = String(rawQuotes)
        .split("|")
        .map((item) => item.trim())
        .filter(Boolean);

      if (quotes.length < 2) {
        return;
      }

      const textEl = quoteEl.find(".news-auth-quote-text");
      const authorEl = quoteEl.find(".news-auth-quote-author");
      let index = 0;

      function renderQuote(value) {
        const parts = value.split("—");
        const text = parts[0] ? parts[0].trim() : "";
        const author = parts.slice(1).join("—").trim();

        if (textEl.length) {
          textEl.text(`“${text}”`);
        }
        if (authorEl.length) {
          authorEl.text(author ? `— ${author}` : "");
        }
      }

      renderQuote(quotes[index]);

      setInterval(function () {
        quoteEl.addClass("is-fading");
        setTimeout(function () {
          index = (index + 1) % quotes.length;
          renderQuote(quotes[index]);
          quoteEl.removeClass("is-fading");
        }, 220);
      }, QUOTE_ROTATE_MS);
    });
  }

  function buildTypedTitleStructure(titleEl, text, accentText) {
    const accentStart = accentText ? text.lastIndexOf(accentText) : -1;
    const accentEnd = accentStart >= 0 ? accentStart + accentText.length : -1;
    const fragment = document.createDocumentFragment();
    const letterNodes = [];
    const revealOrder = [];

    for (let index = 0; index < text.length; index += 1) {
      if (text[index] === "\n") {
        fragment.appendChild(document.createElement("br"));
        continue;
      }

      const letterEl = document.createElement("span");
      letterEl.className = "news-auth-letter";
      if (accentStart >= 0 && index >= accentStart && index < accentEnd) {
        letterEl.classList.add("is-accent");
      }
      letterEl.textContent = text[index];
      fragment.appendChild(letterEl);
      letterNodes.push(letterEl);
      revealOrder.push(index);
    }

    titleEl.empty().append(fragment);

    return {
      letterNodes,
      revealOrder,
    };
  }

  function setTypedVisibleCount(letterNodes, visibleCount) {
    letterNodes.forEach(function (node, index) {
      node.classList.toggle("is-visible", index < visibleCount);
    });
  }

  function getTypingDelayForChar(character) {
    if (!character) {
      return 78;
    }
    if (character === " " || character === "\u00a0") {
      return 48;
    }
    if (/[,.!?;:]/.test(character)) {
      return 132;
    }
    return 76;
  }

  function setupTitleTyping() {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    $(".news-auth-title-typing").each(function () {
      const titleEl = $(this);
      const fullText = String(titleEl.data("typed-text") || "")
        .replace(/\|/g, "\n")
        .trim();
      const accentText = String(titleEl.data("typed-accent") || "").trim();

      if (!fullText) {
        return;
      }

      const titleStructure = buildTypedTitleStructure(titleEl, fullText, accentText);
      const letterNodes = titleStructure.letterNodes;

      if (!letterNodes.length) {
        return;
      }

      if (prefersReducedMotion) {
        titleEl.addClass("is-typing");
        setTypedVisibleCount(letterNodes, letterNodes.length);
        return;
      }

      let currentLength = 0;
      let phase = "typing";

      titleEl.addClass("is-typing");

      function tick() {
        if (phase === "typing") {
          currentLength += 1;
          setTypedVisibleCount(letterNodes, currentLength);

          if (currentLength >= letterNodes.length) {
            phase = "holding";
            titleEl.addClass("is-paused");
            setTimeout(tick, 900);
            return;
          }

          const currentChar = letterNodes[currentLength - 1].textContent;
          setTimeout(tick, getTypingDelayForChar(currentChar));
          return;
        }

        if (phase === "holding") {
          phase = "deleting";
          titleEl.removeClass("is-paused");
          setTimeout(tick, 260);
          return;
        }

        currentLength -= 1;
        setTypedVisibleCount(letterNodes, currentLength);

        if (currentLength <= 0) {
          phase = "typing";
          setTimeout(tick, 340);
          return;
        }

        setTimeout(tick, 34);
      }

      setTypedVisibleCount(letterNodes, 0);
      setTimeout(tick, 220);
    });
  }

  function applyRememberedUsername() {
    if (!usernameInput.length || !rememberCheckbox.length) {
      return;
    }

    const rememberedUsername = localStorage.getItem(storageKeys.rememberedUsername);
    if (rememberedUsername) {
      usernameInput.val(rememberedUsername);
      rememberCheckbox.prop("checked", true);
      setInputState(usernameInput, true);
    }
  }

  function saveRememberedUsername(username) {
    if (!rememberCheckbox.length) {
      return;
    }

    if (rememberCheckbox.is(":checked")) {
      localStorage.setItem(storageKeys.rememberedUsername, username);
      return;
    }

    localStorage.removeItem(storageKeys.rememberedUsername);
  }

  function validateLoginFields() {
    const enteredUsername = usernameInput.val().trim();
    const enteredPassword = passwordInput.val().trim();
    const hasUsername = enteredUsername.length >= 4 && !/\s/.test(enteredUsername);
    const hasPassword = enteredPassword.length > 0;

    setInputState(usernameInput, hasUsername);
    setInputState(passwordInput, hasPassword);

    return {
      valid: hasUsername && hasPassword,
      enteredUsername,
      enteredPassword,
    };
  }

  const isLoggedIn = localStorage.getItem(storageKeys.isLoggedIn);
  const username = localStorage.getItem(storageKeys.username);
  if (isLoggedIn === "true" && username) {
    displayUserOptions(username);
    if (loginForm.length) {
      setMessage(
        "Bạn đã đăng nhập. Có thể quay về trang chủ để tiếp tục.",
        "is-info"
      );
    }
  }

  setupQuoteRotator();
  setupTitleTyping();
  applyRememberedUsername();

  $(document).on("click", ".news-auth-toggle", function () {
    const toggleBtn = $(this);
    const targetId = toggleBtn.data("toggle-password");
    const targetInput = $("#" + targetId);

    if (!targetInput.length) {
      return;
    }

    const isPasswordType = targetInput.attr("type") === "password";
    targetInput.attr("type", isPasswordType ? "text" : "password");
    toggleBtn.text(isPasswordType ? "Ẩn" : "Hiện");
    toggleBtn.attr("aria-pressed", isPasswordType ? "true" : "false");
  });

  usernameInput.on("blur", function () {
    const value = $(this).val().trim();
    setInputState($(this), value.length >= 4 && !/\s/.test(value));
  });

  passwordInput.on("blur", function () {
    const value = $(this).val().trim();
    setInputState($(this), value.length > 0);
  });

  loginForm.on("submit", function (event) {
    event.preventDefault();
    submitBtn.addClass("is-loading").attr("disabled", true);
    setMessage("", null);

    const validation = validateLoginFields();
    const enteredUsername = validation.enteredUsername;
    const enteredPassword = validation.enteredPassword;

    if (!validation.valid) {
      setMessage(
        "Vui lòng nhập tên đăng nhập hợp lệ và mật khẩu.",
        "is-warning"
      );
      submitBtn.removeClass("is-loading").attr("disabled", false);
      return;
    }

    const users = getUsers();
    if (users.length === 0) {
      setMessage("Không tìm thấy người dùng. Hãy đăng ký tài khoản.", "is-info");
      submitBtn.removeClass("is-loading").attr("disabled", false);
      return;
    }

    const foundUser = users.find(
      (user) => String(user.username).toLowerCase() === enteredUsername.toLowerCase()
    );
    if (!foundUser || foundUser.password !== enteredPassword) {
      setMessage("Thông tin đăng nhập không đúng.", "is-error");
      setInputState(passwordInput, false);
      submitBtn.removeClass("is-loading").attr("disabled", false);
      return;
    }

    setMessage("Đăng nhập thành công!", "is-success");
    setInputState(usernameInput, true);
    setInputState(passwordInput, true);
    localStorage.setItem(storageKeys.isLoggedIn, "true");
    localStorage.setItem(storageKeys.username, enteredUsername);
    saveRememberedUsername(enteredUsername);
    displayUserOptions(enteredUsername);

    setTimeout(function () {
      window.location.href = "Index.html";
    }, 500);
  });

  $(document).on("click", "#logout", function (event) {
    event.preventDefault();
    localStorage.removeItem(storageKeys.isLoggedIn);
    localStorage.removeItem(storageKeys.username);
    window.location.href = "dang-nhap.html";
  });
});

