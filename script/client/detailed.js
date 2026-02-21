function toggleVideo() {
  const modal = document.getElementById("videoModal");
  const iframe = document.getElementById("youtubeFrame");

  modal.classList.toggle("active");

  if (!modal.classList.contains("active")) {
    const currentSrc = iframe.src;
    iframe.src = "";
    iframe.src = currentSrc;
  }
}

document.querySelectorAll("button").forEach((btn) => {
  btn.addEventListener("click", function () {
    this.style.transform = "scale(0.95)";
    setTimeout(() => {
      this.style.transform = "scale(1)";
    }, 150);
  });
});

// Elementləri seçirik
const modal = document.getElementById("videoModal");
const iframe = document.getElementById("youtubeFrame");

// Videonun əsl linki (Autoplay əlavə etdik ki, açılan kimi başlasın)
const videoUrl = "https://www.youtube.com/embed/_1YzIwBRL1I?autoplay=1";

// function toggleVideo() {
//   // Modalı açıb/bağlayırıq
//   modal.classList.toggle("active");

//   // Əgər modal açıldısa, videonu yüklə
//   if (modal.classList.contains("active")) {
//     iframe.src = videoUrl;
//   } else {
//     // Modal bağlandısa, videonu sıfırla (səsi kəs)
//     iframe.src = "";
//   }
// }

// // Düymələrə klik animasiyası
// document.querySelectorAll("button").forEach((btn) => {
//   btn.addEventListener("click", function () {
//     this.style.transform = "scale(0.95)";
//     setTimeout(() => {
//       this.style.transform = "scale(1)";
//     }, 150);
//   });
// });

// console.log("JS faylı işə düşdü!"); // F12 basıb Konsolda bu yazını görməlisən

// const modal = document.querySelector(".modal-overlay"); // Class ilə tapırıq
// const iframe = document.querySelector("#youtubeFrame");
// const playBtn = document.querySelector(".play-overlay"); // HTML-də onclick olmasa belə işləsin

// // Videonun linki
// const videoUrl = "https://www.youtube.com/embed/_1YzIwBRL1I?autoplay=1";

// // Play düyməsinə basanda
// if (playBtn) {
//   playBtn.addEventListener("click", () => {
//     console.log("Play düyməsi basıldı!"); // Konsolda bunu görməlisən
//     modal.classList.add("active");
//     iframe.src = videoUrl;
//   });
// } else {
//   console.error("Xəta: .play-overlay elementi tapılmadı!");
// }

// // Bağlamaq (X) düyməsinə basanda
// function toggleVideo() {
//   // HTML-dəki onclick="toggleVideo()" üçündür
//   // Əgər modal açıqdırsa, bağlayırıq
//   if (modal.classList.contains("active")) {
//     modal.classList.remove("active");
//     iframe.src = ""; // Videonu dayandır
//   } else {
//     // Əgər play düyməsində onclick="toggleVideo()" qalıbsa bu hissə işləyəcək
//     modal.classList.add("active");
//     iframe.src = videoUrl;
//   }
// }