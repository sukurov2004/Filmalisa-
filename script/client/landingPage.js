// ===== AUTH GUARD =====
(function () {
  const token = localStorage.getItem("token");

  if (token) {
    window.location.replace("http://127.0.0.1:5500/pages/client/home.html");
  }
})();