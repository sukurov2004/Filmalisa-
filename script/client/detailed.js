// ===== AUTH GUARD =====
(function () {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.replace("https://sukurov2004.github.io/Filmalisa-/pages/client/login.html");
  }
})();

document.addEventListener("DOMContentLoaded", () => {
  // Elementləri seçirik
  const modal = document.getElementById("videoModal");
  const iframe = document.getElementById("youtubeFrame");
  const playBtn = document.querySelector(".play-overlay");

  // Videonun linki
  const videoUrl ="https://www.youtube.com/embed/fzmM0AB60QQ?si=bxg5YICePDdE_23-";

  // Play funksiyası
  window.toggleVideo = function () {
    if (!modal || !iframe) return;

    modal.classList.toggle("active");

    if (modal.classList.contains("active")) {
      iframe.src = videoUrl; // Modal açılanda videonu başlat
    } else {
      iframe.src = ""; // Bağlananda videonu tam dayandır (səs kəsilsin)
    }
  };

  // Düymə animasiyası
  document.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", function () {
      this.style.transform = "scale(0.95)";
      setTimeout(() => {
        this.style.transform = "scale(1)";
      }, 150);
    });
  });
});
