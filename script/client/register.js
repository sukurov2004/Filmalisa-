/* ─── TOAST NOTIFICATION ─── */
function showToast(message, type = "success") {
  const existing = document.querySelector(".toast-notification");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = `toast-notification toast-${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${type === "success" ? "✓" : "✕"}</span>
    <span class="toast-message">${message}</span>
    <button class="toast-close" aria-label="Close">×</button>
  `;

  if (!document.getElementById("toast-styles")) {
    const style = document.createElement("style");
    style.id = "toast-styles";
    style.textContent = `
      .toast-notification {
        position: fixed; top: 24px; right: 24px; z-index: 99999;
        display: flex; align-items: center; gap: 10px;
        padding: 14px 18px; border-radius: 10px;
        font-family: inherit; font-size: 14px; font-weight: 500;
        color: #fff; min-width: 260px; max-width: 360px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.25);
        animation: toastSlideIn 0.35s cubic-bezier(0.21, 1.02, 0.73, 1) forwards;
        cursor: default;
      }
      .toast-success { background: linear-gradient(135deg, #1db954, #17a34a); }
      .toast-error   { background: linear-gradient(135deg, #e53935, #c62828); }
      .toast-icon  { font-size: 16px; font-weight: 700; flex-shrink: 0; }
      .toast-message { flex: 1; line-height: 1.4; }
      .toast-close {
        background: none; border: none; color: rgba(255,255,255,0.75);
        font-size: 18px; line-height: 1; cursor: pointer;
        padding: 0 2px; flex-shrink: 0; transition: color 0.2s;
      }
      .toast-close:hover { color: #fff; }
      .toast-hide { animation: toastSlideOut 0.3s ease forwards; }
      @keyframes toastSlideIn {
        from { opacity: 0; transform: translateX(110%); }
        to   { opacity: 1; transform: translateX(0); }
      }
      @keyframes toastSlideOut {
        from { opacity: 1; transform: translateX(0); }
        to   { opacity: 0; transform: translateX(110%); }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(toast);

  const dismiss = () => {
    toast.classList.add("toast-hide");
    toast.addEventListener("animationend", () => toast.remove(), { once: true });
  };

  toast.querySelector(".toast-close").addEventListener("click", dismiss);
  setTimeout(dismiss, 4000);
}

/* ─── DOMContentLoaded ─── */
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (token) {
    window.location.replace("https://sukurov2004.github.io/Filmalisa-/pages/client/home.html");
  }

  const params = new URLSearchParams(window.location.search);
  const email = params.get("email");

  if (email) {
    const emailInput = document.querySelector(".registerEmail");
    if (emailInput) emailInput.value = email;
  }
});

/* ─── Eye toggle ─── */
const eye = document.getElementById("registerEye");
const passwordInput = document.getElementById("registerPassword");

eye.addEventListener("click", () => {
  const isHidden = passwordInput.type === "password";
  passwordInput.type = isHidden ? "text" : "password";

  const eyeImg = eye.querySelector("img");
  if (eyeImg) {
    eyeImg.src = isHidden
      ? "../../assets/client/İconsİmages/eye.svg"
      : "../../assets/client/İconsİmages/eyeOff.svg";
  }

  eye.setAttribute("aria-label", isHidden ? "Hide password" : "Show password");
});

/* ─── Register form submit ─── */
const form = document.getElementById("registerForm");
const submitBtn = document.getElementById("submitBtn");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const full_name = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = passwordInput.value;

  if (!full_name || !email || !password) {
    showToast("Please fill in all fields.", "error");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "loading...";

  try {
    const response = await fetch(
      "https://api.sarkhanrahimli.dev/api/filmalisa/auth/signup",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, full_name, email }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      showToast("Registration successful! Redirecting...", "success");
      setTimeout(() => {
        window.location.href = "https://sukurov2004.github.io/Filmalisa-/pages/client/login.html";
      }, 1500);
    } else {
      const errorMsg = data?.message || data?.error || "Registration failed. Please try again.";
      showToast(errorMsg, "error");
    }
  } catch (err) {
    showToast("Network error. Please check your connection.", "error");
    console.error("Register error:", err);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "register";
  }
});