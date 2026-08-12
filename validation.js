// ── Regex Rules ──────────────────────────────────────────────
const RULES = {
  name: {
    pattern: /^[A-Za-z\u0600-\u06FF]{2,}$/,
    message: "Should contain letters only (at least 2 characters)"
  },
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Should be a valid email — e.g. name@mail.com"
  },
  password: {
    pattern: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
    message: "Should be 8+ characters, include an uppercase letter, a number, and a special character (e.g. @, #, !)"
  },
  phone: {
    pattern: /^[0-9]{11}$/,
    message: "Should be exactly 11 digits — e.g. 05012345678"
  }
};


function showError(inputEl, message) {
  clearError(inputEl);

  inputEl.style.borderColor = "#e53e3e";

  const errorEl = document.createElement("p");
  errorEl.className = "field-error-msg";
  errorEl.textContent = message;
  errorEl.style.cssText = `
    color: #e53e3e;
    font-size: 12px;
    margin: 5px 0 0 4px;
    display: flex;
    align-items: center;
    gap: 4px;
  `;
  errorEl.innerHTML = `<i class="bi bi-exclamation-circle-fill"></i> ${message}`;

  const parent = inputEl.closest(".input-wrap") || inputEl.parentElement;
  parent.insertAdjacentElement("afterend", errorEl);
}


function clearError(inputEl) {
  inputEl.style.borderColor = "";

  const parent = inputEl.closest(".input-wrap") || inputEl.parentElement;
  const nextEl = parent.nextElementSibling;
  if (nextEl && nextEl.classList.contains("field-error-msg")) {
    nextEl.remove();
  }
}


function validateField(inputEl, ruleName) {
  const rule = RULES[ruleName];
  const value = inputEl.value.trim();

  if (!rule.pattern.test(value)) {
    showError(inputEl, rule.message);
    return false;
  } else {
    clearError(inputEl);
    inputEl.style.borderColor = "#38a169";
    return true;
  }
}


// ══════════════════════════════════════════════════════════════
//  SIGN UP
// ══════════════════════════════════════════════════════════════

function initSignUp() {
  const form = document.getElementById("signupForm");
  if (!form) return;

  const firstNameInput  = document.getElementById("inputFirstN");
  const lastNameInput   = document.getElementById("inputLastN");
  const emailInput      = document.getElementById("inputEmail4");
  const phoneInput      = document.getElementById("inputPhone");
  const passwordInput   = document.getElementById("passwordInput");
  const confirmPassInput= document.getElementById("ConfirmedPass");
  const dobInput        = document.getElementById("inputDOB");
  const genderSelect    = document.getElementById("inputGender");
  const roleSelect      = document.getElementById("inputRole");

  firstNameInput.addEventListener("blur",  () => validateField(firstNameInput,  "name"));
  lastNameInput.addEventListener("blur",   () => validateField(lastNameInput,   "name"));
  emailInput.addEventListener("blur",      () => validateField(emailInput,      "email"));
  phoneInput.addEventListener("blur",      () => validateField(phoneInput,      "phone"));
  passwordInput.addEventListener("blur",   () => validateField(passwordInput,   "password"));

  confirmPassInput.addEventListener("blur", () => {
    if (confirmPassInput.value !== passwordInput.value) {
      showError(confirmPassInput, "Passwords do not match");
      return false;
    } else {
      clearError(confirmPassInput);
      confirmPassInput.style.borderColor = "#38a169";
      return true;
    }
  });

  [firstNameInput, lastNameInput].forEach(function(input) {
    input.addEventListener("keypress", function(e) {
      const allowed = /^[A-Za-z\u0600-\u06FF]$/;
      if (!allowed.test(e.key) && e.key !== "Backspace" && e.key !== "Delete") {
        e.preventDefault();
      }
    });
  });

  phoneInput.addEventListener("keypress", function(e) {
    if (!/[0-9]/.test(e.key)) {
      e.preventDefault();
    }
  });

  emailInput.addEventListener("keypress", function(e) {
    if (e.key === " ") {
      e.preventDefault();
    }
  });

  form.addEventListener("submit", function(e) {
    e.preventDefault();

    let isValid = true;

    if (!validateField(firstNameInput,  "name"))     isValid = false;
    if (!validateField(lastNameInput,   "name"))     isValid = false;
    if (!validateField(emailInput,      "email"))    isValid = false;
    if (!validateField(phoneInput,      "phone"))    isValid = false;
    if (!validateField(passwordInput,   "password")) isValid = false;

    if (confirmPassInput.value !== passwordInput.value) {
      showError(confirmPassInput, "Passwords do not match");
      isValid = false;
    } else {
      clearError(confirmPassInput);
      confirmPassInput.style.borderColor = "#38a169";
    }

    if (!dobInput.value.trim()) {
      showError(dobInput, "Please enter your date of birth");
      isValid = false;
    } else {
      clearError(dobInput);
    }

    if (!genderSelect.value) {
      showError(genderSelect, "Please select your gender");
      isValid = false;
    } else {
      clearError(genderSelect);
    }

    if (!roleSelect.value) {
      showError(roleSelect, "Please select your role");
      isValid = false;
    } else {
      clearError(roleSelect);
    }

    if (!isValid) return;

    const existingUsers = JSON.parse(localStorage.getItem("alfagih_users") || "[]");
    const emailAlreadyUsed = existingUsers.some(function(user) {
      return user.email === emailInput.value.trim().toLowerCase();
    });

    if (emailAlreadyUsed) {
      showError(emailInput, "This email is already registered. Please log in.");
      return;
    }

    const newUser = {
      firstName : firstNameInput.value.trim(),
      lastName  : lastNameInput.value.trim(),
      email     : emailInput.value.trim().toLowerCase(),
      phone     : phoneInput.value.trim(),
      dob       : dobInput.value.trim(),
      gender    : genderSelect.value,
      role      : roleSelect.value,
      password  : passwordInput.value
    };

    existingUsers.push(newUser);
    localStorage.setItem("alfagih_users", JSON.stringify(existingUsers));

    showSuccessToast("Account created successfully! Redirecting to login...", function() {
      window.location.href = "login.html";
    });
  });
}


// ══════════════════════════════════════════════════════════════
//  LOGIN
// ══════════════════════════════════════════════════════════════

function initLogin() {
  const signinBtn = document.querySelector(".btn-signin");
  if (!signinBtn) return;

  const loginInput    = document.getElementById("loginIdentifier");
  const passwordInput = document.getElementById("passwordInput");

  signinBtn.addEventListener("click", function() {

    let isValid = true;

    if (!loginInput.value.trim()) {
      showError(loginInput, "Please enter your email or username");
      isValid = false;
    } else {
      clearError(loginInput);
      loginInput.style.borderColor = "#38a169";
    }

    if (!passwordInput.value.trim()) {
      showError(passwordInput, "Please enter your password");
      isValid = false;
    } else {
      clearError(passwordInput);
    }

    if (!isValid) return;

    const savedUsers = JSON.parse(localStorage.getItem("alfagih_users") || "[]");
    const identifier = loginInput.value.trim().toLowerCase();

    const matchedUser = savedUsers.find(function(user) {
      return (
        user.email === identifier ||
        (user.firstName + " " + user.lastName).toLowerCase() === identifier
      ) && user.password === passwordInput.value;
    });

    if (!matchedUser) {
      showError(loginInput, "Email / username or password is incorrect");
      passwordInput.style.borderColor = "#e53e3e";
      return;
    }

    localStorage.setItem("alfagih_current_user", JSON.stringify(matchedUser));

    showSuccessToast("Welcome back, " + matchedUser.firstName + "! Redirecting...", function() {
      window.location.href = "index.html";
    });
  });
}


// ══════════════════════════════════════════════════════════════
//  SUCCESS TOAST
// ══════════════════════════════════════════════════════════════

function showSuccessToast(message, callback) {
  const oldToast = document.getElementById("alfagih-success-toast");
  if (oldToast) oldToast.remove();

  const toast = document.createElement("div");
  toast.id = "alfagih-success-toast";
  toast.innerHTML = `<i class="bi bi-check-circle-fill"></i> ${message}`;
  toast.style.cssText = `
    position: fixed;
    top: 24px;
    left: 50%;
    transform: translateX(-50%);
    background: #38a169;
    color: #ffffff;
    padding: 14px 28px;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    box-shadow: 0 8px 30px rgba(56,161,105,0.35);
    display: flex;
    align-items: center;
    gap: 10px;
    z-index: 9999;
    animation: slideDown 0.4s ease;
  `;

  if (!document.getElementById("toast-style")) {
    const style = document.createElement("style");
    style.id = "toast-style";
    style.textContent = `
      @keyframes slideDown {
        from { opacity: 0; top: 0; }
        to   { opacity: 1; top: 24px; }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);

  setTimeout(function() {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s";
    setTimeout(callback, 350);
  }, 2000);
}


document.addEventListener("DOMContentLoaded", function() {
  initSignUp();
  initLogin();
  initForgotPassword();
  initOTP();
});


// ══════════════════════════════════════════════════════════════
//  FORGOT PASSWORD
// ══════════════════════════════════════════════════════════════

function initForgotPassword() {
  var sendBtn = document.getElementById("sendCodeBtn");
  if (!sendBtn) return;

  var identifierInput = document.getElementById("forgotIdentifier");
  var errorSlot = identifierInput.parentElement.querySelector(".field-error-slot");

  function showFieldError(msg) {
    identifierInput.style.borderColor = "#e53e3e";
    if (errorSlot) errorSlot.innerHTML = '<i class="bi bi-exclamation-circle-fill"></i> ' + msg;
  }

  function clearFieldError() {
    identifierInput.style.borderColor = "";
    if (errorSlot) errorSlot.innerHTML = "";
  }

  sendBtn.addEventListener("click", function() {
    var value = identifierInput.value.trim();

    if (!value) {
      showFieldError("Please enter your email or phone number");
      return;
    }

    var savedUsers = JSON.parse(localStorage.getItem("alfagih_users") || "[]");
    var matchedUser = savedUsers.find(function(user) {
      return user.email === value.toLowerCase() || user.phone === value;
    });

    if (!matchedUser) {
      showFieldError("No account found with this email or phone number");
      return;
    }

    clearFieldError();

    var otp = Math.floor(1000 + Math.random() * 9000).toString();
    sessionStorage.setItem("alfagih_otp", otp);
    sessionStorage.setItem("alfagih_otp_user", matchedUser.email);
    sessionStorage.setItem("alfagih_otp_expires", Date.now() + 10 * 60 * 1000);

    showSuccessToast("Your code is: " + otp + " (demo — would be sent to your email)", function() {
      window.location.href = "otp.html";
    });
  });
}


// ══════════════════════════════════════════════════════════════
//  OTP VERIFICATION
// ══════════════════════════════════════════════════════════════

function initOTP() {
  var verifyBtn = document.getElementById("verifyBtn");
  if (!verifyBtn) return;

  var inputs = [
    document.getElementById("otp1"),
    document.getElementById("otp2"),
    document.getElementById("otp3"),
    document.getElementById("otp4")
  ];

  var otpError    = document.getElementById("otpError");
  var otpErrorTxt = document.getElementById("otpErrorText");
  var resendTimer = document.getElementById("resendTimer");
  var resendLink  = document.getElementById("resendLink");
  var timerCount  = document.getElementById("timerCount");

  inputs.forEach(function(input, i) {
    input.addEventListener("input", function() {
      input.value = input.value.replace(/[^0-9]/g, "");

      if (input.value.length === 1) {
        input.classList.add("otp-filled");
        input.classList.remove("otp-error");
        if (i < 3) inputs[i + 1].focus();
      } else {
        input.classList.remove("otp-filled");
      }
    });

    input.addEventListener("keydown", function(e) {
      if (e.key === "Backspace" && input.value === "" && i > 0) {
        inputs[i - 1].focus();
        inputs[i - 1].value = "";
        inputs[i - 1].classList.remove("otp-filled");
      }
    });
  });

  inputs[0].focus();

  var seconds = 45;

  function updateTimer() {
    var m = Math.floor(seconds / 60);
    var s = seconds % 60;
    timerCount.textContent = (m < 10 ? "0" + m : m) + ":" + (s < 10 ? "0" + s : s);
  }

  updateTimer();

  var timerInterval = setInterval(function() {
    seconds--;
    updateTimer();

    if (seconds <= 0) {
      clearInterval(timerInterval);
      resendTimer.style.display = "none";
      resendLink.style.display  = "inline";
    }
  }, 1000);

  resendLink.addEventListener("click", function(e) {
    e.preventDefault();

    var otp = Math.floor(1000 + Math.random() * 9000).toString();
    sessionStorage.setItem("alfagih_otp", otp);
    sessionStorage.setItem("alfagih_otp_expires", Date.now() + 10 * 60 * 1000);

    inputs.forEach(function(inp) {
      inp.value = "";
      inp.classList.remove("otp-filled", "otp-error");
    });
    inputs[0].focus();

    otpError.style.display = "none";

    resendLink.style.display  = "none";
    resendTimer.style.display = "inline";
    seconds = 45;
    updateTimer();
    timerInterval = setInterval(function() {
      seconds--;
      updateTimer();
      if (seconds <= 0) {
        clearInterval(timerInterval);
        resendTimer.style.display = "none";
        resendLink.style.display  = "inline";
      }
    }, 1000);

    showSuccessToast("New code is: " + otp + " (demo)", function() {});
  });

  verifyBtn.addEventListener("click", function() {
    var enteredCode = inputs.map(function(inp) { return inp.value; }).join("");

    if (enteredCode.length < 4) {
      inputs.forEach(function(inp) {
        if (!inp.value) inp.classList.add("otp-error");
      });
      otpErrorTxt.textContent = "Please enter all 4 digits";
      otpError.style.display = "flex";
      return;
    }

    var savedOtp     = sessionStorage.getItem("alfagih_otp");
    var otpExpires   = parseInt(sessionStorage.getItem("alfagih_otp_expires") || "0");
    var otpUserEmail = sessionStorage.getItem("alfagih_otp_user");

    if (Date.now() > otpExpires) {
      inputs.forEach(function(inp) { inp.classList.add("otp-error"); });
      otpErrorTxt.textContent = "Code expired. Please request a new one.";
      otpError.style.display = "flex";
      return;
    }

    if (enteredCode !== savedOtp) {
      inputs.forEach(function(inp) { inp.classList.add("otp-error"); inp.classList.remove("otp-filled"); });
      otpErrorTxt.textContent = "Incorrect code. Please try again.";
      otpError.style.display = "flex";
      return;
    }

    var savedUsers = JSON.parse(localStorage.getItem("alfagih_users") || "[]");
    var user = savedUsers.find(function(u) { return u.email === otpUserEmail; });

    if (user) {
      localStorage.setItem("alfagih_current_user", JSON.stringify(user));
    }

    sessionStorage.removeItem("alfagih_otp");
    sessionStorage.removeItem("alfagih_otp_user");
    sessionStorage.removeItem("alfagih_otp_expires");

    showSuccessToast("Identity verified! Welcome back " + (user ? user.firstName : "") + "!", function() {
      window.location.href = "index.html";
    });
  });
}