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

      window.location.href = `https://sukurov2004.github.io/Filmalisa-/pages/client/register.html?email=${encodeURIComponent(email)}`;
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



const contactForm = document.getElementById("contactForm");

contactForm?.addEventListener("submit", async (e) => {
  e.preventDefault();

const full_name = document.getElementById("fullname").value.trim();
const email = document.getElementById("contactEmail").value.trim();
const reason = document.getElementById("reason").value.trim();

if (!full_name || !email || !reason) return;

  // Tokeni localStorage-dən al
  const token = localStorage.getItem("token"); 
  if (!token) {
    alert("You must be logged in to send a message.");
    window.location.href = "https://sukurov2004.github.io/Filmalisa-/pages/client/login.html";
    return;
  }

  try {
    const res = await fetch(
      "https://api.sarkhanrahimli.dev/api/filmalisa/contact",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          full_name,
          email,
          reason,
        }),
      }
    );

    if (!res.ok) {
      throw new Error("Failed to send");
    }

    alert("Message sent successfully!");
    contactForm.reset();
  } catch (error) {
    console.error(error);
    alert("Something went wrong!");
  }
});