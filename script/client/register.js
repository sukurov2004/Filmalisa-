document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (token) {
    window.location.replace("https://sukurov2004.github.io/Filmalisa-/pages/client/home.html");
  }


   const params = new URLSearchParams(window.location.search);
  const email = params.get("email");

  if (email) {
    const emailInput = document.querySelector(".registerEmail"); 
    if (emailInput) {
      emailInput.value = email;
    }
  }
});


// ── Eye toggle ──────────────────────────────────────────────
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

// ── Register form submit ────────────────────────────────────
const form = document.getElementById("registerForm");
const submitBtn = document.getElementById("submitBtn");
const formMessage = document.getElementById("formMessage");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const full_name = document.getElementById("fullname").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = passwordInput.value;

  if (!full_name || !email || !password) {
    showMessage("Please fill in all fields.", "error");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "loading...";
  hideMessage();

  try {
    const response = await fetch(
      "https://api.sarkhanrahimli.dev/api/filmalisa/auth/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password, full_name, email }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      showMessage("Registration successful! Redirecting...", "success");
      setTimeout(() => {
        window.location.href = "https://sukurov2004.github.io/Filmalisa-/pages/client/login.html";
      }, 1500);
    } else {
      const errorMsg =
        data?.message || data?.error || "Registration failed. Please try again.";
      showMessage(errorMsg, "error");
    }
  } catch (err) {
    showMessage("Network error. Please check your connection.", "error");
    console.error("Register error:", err);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "register";
  }
});

function showMessage(msg, type) {
  formMessage.textContent = msg;
  formMessage.style.display = "block";
  formMessage.style.color = type === "error" ? "#e74c3c" : "#2ecc71";
}

function hideMessage() {
  formMessage.style.display = "none";
}


