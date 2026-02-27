document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    window.location.replace(
      "https://sukurov2004.github.io/Filmalisa-/pages/admin/login.html"
    );
  }
});

const eye = document.querySelector(".eye");
const passwordInput = document.querySelector(".loginPassword");
const eyeIcon = eye.querySelector("img");
const form = document.querySelector(".form");

const formMessage = document.createElement("p");
form.appendChild(formMessage);

form.addEventListener("submit", loginAdmin);

async function loginAdmin(e) {
  e.preventDefault();

  const username = document.querySelector(".loginName").value.trim();
  const password = document.querySelector(".loginPassword").value.trim();

  if (!username || !password) {
    showMessage("Please fill in all fields.", "error");
    return;
  }

  hideMessage();

  try {
    const response = await fetch(
      "https://api.sarkhanrahimli.dev/api/filmalisa/auth/admin/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: username,
          password: password,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.result) {
      showMessage(data.message || "Login failed!", "error");
      return;
    }

    localStorage.setItem("adminToken", data.data.tokens.access_token);

    showMessage("Login successful! Redirecting...", "success");

    setTimeout(() => {
      window.location.replace(
        "https://sukurov2004.github.io/Filmalisa-/pages/admin/dashboard.html"
      );
    }, 1500);
  } catch (error) {
    showMessage("Something went wrong. Please try again.", "error");
    console.error("Error:", error);
  }
}

// ── Eye toggle ──────────────────────────────────────────────
eye.addEventListener("click", () => {
  const isPassword = passwordInput.type === "password";
  passwordInput.type = isPassword ? "text" : "password";

  eyeIcon.src = isPassword
    ? "../../assets/client/İconsİmages/eye.svg"
    : "../../assets/client/İconsİmages/eyeOff.svg";
});

function showMessage(msg, type) {
  formMessage.textContent = msg;
  formMessage.style.display = "block";
  formMessage.style.color = type === "error" ? "#e74c3c" : "#2ecc71";
}

function hideMessage() {
  formMessage.style.display = "none";
}