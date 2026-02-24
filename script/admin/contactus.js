document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
         window.location.href = "http://127.0.0.1:5500/index.html";
  }
});