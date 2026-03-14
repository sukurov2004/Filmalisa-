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
        position: fixed;
        top: 24px;
        right: 24px;
        z-index: 99999;
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 14px 18px;
        border-radius: 10px;
        font-family: inherit;
        font-size: 14px;
        font-weight: 500;
        color: #fff;
        min-width: 260px;
        max-width: 360px;
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

/* ===== AUTH GUARD ===== */
(function () {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.replace(
      "https://sukurov2004.github.io/Filmalisa-/pages/client/login.html"
    );
  }
})();

document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const url = "https://api.sarkhanrahimli.dev/api/filmalisa/profile";

  const profilImg = document.querySelector(".avatar-gradient img");
  const imgUrlInput = document.querySelector("input[name='profileImage']");
  const fullNameInput = document.querySelector("input[name='fullName']");
  const emailInput = document.querySelector("input[name='email']");
  const passwordInput = document.querySelector("input[name='password']");
  const form = document.querySelector(".account-form");
  const eyeIcon = document.querySelector(".input-icon.right");

  // Göz ikonu
  eyeIcon.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    eyeIcon.src = isHidden
      ? "../../assets/client/İconsİmages/eyeOff.svg"
      : "../../assets/client/İconsİmages/eye.svg";
  });

  // GET
  async function getProfile() {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Məlumat yüklənmədi");
      const data = await response.json();
      const user = data.data;

      fullNameInput.value = user.full_name || "";
      emailInput.value = user.email || "";
      imgUrlInput.value = user.img_url || "";
      if (user.img_url) {
        profilImg.src = user.img_url;
      }
    } catch (error) {
      console.error("Xəta:", error);
      showToast("Failed to load profile data.", "error");
    }
  }
  getProfile();

  imgUrlInput.addEventListener("input", () => {
    if (imgUrlInput.value) {
      profilImg.src = imgUrlInput.value;
    }
  });

  // PUT
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      const body = {
        full_name: fullNameInput.value,
        email: emailInput.value,
        img_url: imgUrlInput.value,
        password: passwordInput.value,
      };


      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) throw new Error("Yenilənmədi");

      showToast("Profile updated successfully!", "success");
      // passwordInput.value = "";
      getProfile();
    } catch (error) {
      console.error("Xəta:", error);
      showToast("Failed to update profile. Please try again.", "error");
    }
  });
});