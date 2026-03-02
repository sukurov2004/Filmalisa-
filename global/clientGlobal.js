function renderStars(imdb) {
  const rating = parseFloat(imdb) / 2;
  let html = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) html += '<span class="star filled">★</span>';
    else if (i - rating < 1) html += '<span class="star half">★</span>';
    else html += '<span class="star empty">★</span>';
  }
  return html;
}

document.addEventListener("DOMContentLoaded", () => {
  const cinemaIntro = document.getElementById("cinemaIntro");
  if (!cinemaIntro) return;

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
