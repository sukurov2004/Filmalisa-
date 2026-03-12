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

/* ───────── FAQ ACCORDION ───────── */
document.addEventListener("DOMContentLoaded", () => {
  const accordionHeaders = document.querySelectorAll(".accordion-header");

  accordionHeaders.forEach((header) => {
    header.addEventListener("click", () => {
      const isOpen = header.getAttribute("aria-expanded") === "true";

      accordionHeaders.forEach((item) => {
        item.setAttribute("aria-expanded", "false");
        item.nextElementSibling.style.maxHeight = null;
        item.nextElementSibling.style.opacity = 0;
      });

      if (!isOpen) {
        header.setAttribute("aria-expanded", "true");
        const content = header.nextElementSibling;
        content.style.maxHeight = content.scrollHeight + "px";
        content.style.opacity = 1;
      }
    });
  });

  /* ───────── HERO EMAIL REDIRECT ───────── */
  const heroForm = document.getElementById("heroForm");
  const emailInput = document.getElementById("emailInput");

  if (heroForm) {
    heroForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = emailInput.value.trim();
      if (!email) return;
      window.location.href = `https://sukurov2004.github.io/Filmalisa-/pages/client/register.html?email=${encodeURIComponent(email)}`;
    });
  }
});

/* ───────── DEFAULT AVATAR ───────── */
const DEFAULT_AVATAR = "./assets/Admin/icons/Users.svg";

/* ───────── AVATAR HELPER ───────── */
function setAvatar(img, url) {
  if (!img) return;
  img.src = url && url.trim() !== "" ? url : DEFAULT_AVATAR;
  img.style.borderRadius = "50%";
  img.style.width = "36px";
  img.style.height = "36px";
  img.style.objectFit = "cover";
  img.onerror = () => { img.src = DEFAULT_AVATAR; };
}

/* ───────── AUTH STATE ───────── */
const token = localStorage.getItem("token");

const signInBtn = document.querySelector(".sign-in-btn");
const userMenu = document.querySelector(".user-menu");
const logoutBtn = document.querySelector(".logout-btn");
const userIconImg = document.querySelector(".user-icon img");

if (token) {
  signInBtn?.classList.add("hidden");
  userMenu?.classList.remove("hidden");

  // Əvvəlcə cache-dən göstər (sürətli yüklənmə üçün)
  try {
    const cachedUser = JSON.parse(localStorage.getItem("user") || "{}");
    setAvatar(userIconImg, cachedUser.img_url);
  } catch (_) {
    setAvatar(userIconImg, null);
  }

  // Sonra API-dən təzə data çək və yenilə
  fetch("https://api.sarkhanrahimli.dev/api/filmalisa/profile", {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then((res) => res.json())
    .then((data) => {
      const img_url = data?.data?.img_url;
      setAvatar(userIconImg, img_url);

      // Cache-i yenilə
      try {
        const cached = JSON.parse(localStorage.getItem("user") || "{}");
        cached.img_url = img_url;
        localStorage.setItem("user", JSON.stringify(cached));
      } catch (_) {}
    })
    .catch(() => {
      setAvatar(userIconImg, null);
    });
} else {
  signInBtn?.classList.remove("hidden");
  userMenu?.classList.add("hidden");
}

logoutBtn?.addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.reload();
});

const userIcon = document.querySelector(".user-icon");
const dropdown = document.querySelector(".dropdown");

userIcon?.addEventListener("click", () => {
  dropdown?.classList.toggle("hidden");
});

/* ───────── CONTACT FORM ───────── */
const contactForm = document.getElementById("contactForm");

contactForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const full_name = document.getElementById("fullname").value.trim();
  const email = document.getElementById("contactEmail").value.trim();
  const reason = document.getElementById("reason").value.trim();

  if (!full_name || !email || !reason) return;

  const token = localStorage.getItem("token");
  if (!token) {
    showToast("You must be logged in to send a message.", "error");
    setTimeout(() => {
      window.location.href =
        "https://sukurov2004.github.io/Filmalisa-/pages/client/login.html";
    }, 1500);
    return;
  }

  try {
    const res = await fetch(
      "https://api.sarkhanrahimli.dev/api/filmalisa/contact",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ full_name, email, reason }),
      }
    );

    if (!res.ok) throw new Error("Failed to send");

    showToast("Message sent successfully!", "success");
    contactForm.reset();
  } catch (error) {
    console.error(error);
    showToast("Something went wrong. Please try again.", "error");
  }
});