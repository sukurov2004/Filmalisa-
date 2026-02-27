document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  const signInBtn = document.querySelector(".sign-in-btn");
  const userMenu = document.querySelector(".user-menu");
  const userIcon = document.querySelector(".user-icon");
  const dropdown = document.querySelector(".dropdown");
  const logoutBtn = document.querySelector(".logout-btn");

  if (token) {
    signInBtn.classList.add("hidden");
    userMenu.classList.remove("hidden");
  }

  // Dropdown toggle
  userIcon.addEventListener("click", () => {
    dropdown.classList.toggle("hidden");
  });

  // Logout
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.reload();
  });

  // Click outside close
  document.addEventListener("click", (e) => {
    if (!userMenu.contains(e.target)) {
      dropdown.classList.add("hidden");
    }
  });
});