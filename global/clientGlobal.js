document.addEventListener("DOMContentLoaded", () => {
  const cinemaIntro = document.getElementById("cinemaIntro");

  // Əgər əvvəl intro göstərilibsə, birbaşa gizlət
  if (localStorage.getItem("introPlayed")) {
    cinemaIntro.style.display = "none";
    return;
  }

  // Əks halda intro göstər və sonra yadda saxla
  setTimeout(() => {
    cinemaIntro.classList.add("fade-out");

    setTimeout(() => {
      cinemaIntro.style.display = "none";
      localStorage.setItem("introPlayed", "true"); // yadda saxla
    }, 1500);
  }, 3000);
});