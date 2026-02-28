// ===== AUTH GUARD =====
(function () {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.replace("https://sukurov2004.github.io/Filmalisa-/pages/client/login.html");
  }
})();