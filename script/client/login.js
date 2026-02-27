document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (token) {
    window.location.replace("http://127.0.0.1:5500/pages/client/home.html");
  }
});


// ── Eye toggle ──────────────────────────────────────────────
const eye = document.getElementById("loginEye");
const passwordInput = document.getElementById("loginPassword");

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

// ── Login form submit ───────────────────────────────────────
const form = document.querySelector(".form");
const submitBtn = document.querySelector(".btn");
const formMessage = document.createElement("p");
form.appendChild(formMessage);

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = form.email.value.trim();
  const password = passwordInput.value.trim();

  if (!email || !password) {
    showMessage("Please fill in all fields.", "error");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "loading...";
  hideMessage();

  try {
    const response = await fetch(
      "https://api.sarkhanrahimli.dev/api/filmalisa/auth/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token",data.data.tokens.access_token);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      showMessage("Login successful! Redirecting...", "success");

      setTimeout(() => {
        window.location.replace("http://127.0.0.1:5500/pages/client/home.html");
      }, 1500);
    } else {
      const errorMsg =
        data?.message || data?.error || "Login failed. Please try again.";
      showMessage(errorMsg, "error");
    }
  } catch (err) {
    showMessage("Network error. Please check your connection.", "error");
    console.error("Login error:", err);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "login";
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