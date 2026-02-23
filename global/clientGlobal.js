document.addEventListener("DOMContentLoaded", () => {
  const cinemaIntro = document.getElementById("cinemaIntro");

  // 4 saniyədən sonra fade out
  setTimeout(() => {
    cinemaIntro.classList.add("fade-out");
    // Fade out bitdikdən sonra elementi tamamilə gizlət
    setTimeout(() => {
      cinemaIntro.style.display = "none";
    }, 1500);
  }, 4000);
});