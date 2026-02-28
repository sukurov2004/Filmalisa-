document.addEventListener("DOMContentLoaded", () => {

  /* ───────── FAQ ACCORDION ───────── */
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

      window.location.href =
        `https://sukurov2004.github.io/Filmalisa-/pages/client/register.html?email=${encodeURIComponent(email)}`;
    });
  }

});


const token = localStorage.getItem("token");

const signInBtn = document.querySelector(".sign-in-btn");
const userMenu = document.querySelector(".user-menu");
const logoutBtn = document.querySelector(".logout-btn");

if (token) {
  signInBtn?.classList.add("hidden");
  userMenu?.classList.remove("hidden");
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