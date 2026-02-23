document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
         window.location.href = "https://sukurov2004.github.io/Filmalisa-/index.html";
  }
});