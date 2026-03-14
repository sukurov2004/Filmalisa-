// ===== AUTH GUARD =====
(function () {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.replace(
      "https://sukurov2004.github.io/Filmalisa-/pages/client/login.html",
    );
  }
})();

// ===== TRAILER HELPERS =====
function getEmbedUrl(url) {
  if (!url) return "";
  const short = url.match(/youtu\.be\/([^?&]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  const long = url.match(/[?&]v=([^&]+)/);
  if (long) return `https://www.youtube.com/embed/${long[1]}`;
  const embed = url.match(/embed\/([^?&]+)/);
  if (embed) return `https://www.youtube.com/embed/${embed[1]}`;
  return url;
}

function getVideoId(url) {
  if (!url) return "";
  const short = url.match(/youtu\.be\/([^?&]+)/);
  if (short) return short[1];
  const long = url.match(/[?&]v=([^&]+)/);
  if (long) return long[1];
  const embed = url.match(/embed\/([^?&]+)/);
  if (embed) return embed[1];
  return "";
}

function initCardTrailers() {
  document.querySelectorAll(".movie-card").forEach((card) => {
    const trailer = card.querySelector(".card-trailer");
    if (!trailer) return;
    const iframe = trailer.querySelector("iframe");
    let hoverTimer = null;
    let stopTimer = null;

    card.addEventListener("mouseenter", () => {
      hoverTimer = setTimeout(() => {
        iframe.src = iframe.dataset.src;
        stopTimer = setTimeout(() => {
          iframe.src = "";
        }, 15000);
      }, 5000);
    });

    card.addEventListener("mouseleave", () => {
      clearTimeout(hoverTimer);
      clearTimeout(stopTimer);
      iframe.src = "";
    });
  });
}

// ===== FAVORITE MOVIES =====
(async function () {
  const token = localStorage.getItem("token");
  const BASE_URL = "https://api.sarkhanrahimli.dev/api/filmalisa";
  const grid = document.getElementById("movieGrid");

  // Ulduz render

  try {
    const res = await fetch(`${BASE_URL}/movies/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const movies = data.data || [];

    if (movies.length === 0) {
      grid.innerHTML =
        '<p style="color:#fff; padding: 20px;">No favorite movies yet.</p>';
      return;
    }

    grid.innerHTML = movies
      .map((movie) => {
        const embedBase = getEmbedUrl(movie.fragman);
        const videoId = getVideoId(movie.fragman);
        const trailerSrc = embedBase
          ? `${embedBase}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${videoId}&disablekb=1&iv_load_policy=3&rel=0&fs=0&playsinline=1`
          : "";
        return `
        <a class="movie-card" href="detailed.html?id=${movie.id}">
          <img src="${movie.cover_url || ""}" class="movie-image" alt="${movie.title}" />
          ${
            trailerSrc
              ? `
            <div class="card-trailer">
              <iframe src="" data-src="${trailerSrc}" allowfullscreen allow="autoplay"></iframe>
            </div>
          `
              : ""
          }
          <div class="movie-details">
            <div class="movie-category-container">
              <span class="movie-category">${movie.category?.name || ""}</span>
            </div>
            <div class="movie-rating">
              ${renderStars(movie.imdb || 0)}
            </div>
            <p class="movie-title">${movie.title}</p>
          </div>
        </a>
      `;
      })
      .join("");

    // Carousel-i yenidən işə sal
    initCarousel();
    initCardTrailers();
  } catch (err) {
    console.error("Favoritlər yüklənmədi:", err);
  }
})();

// ===== CAROUSEL =====
function initCarousel() {
  const grid = document.getElementById("movieGrid");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (!prevBtn || !nextBtn) return;

  const CARD_WIDTH = 300;
  const CARD_GAP = 0;
  const VISIBLE = 4.9;
  const step = CARD_WIDTH + CARD_GAP;

  const cards = grid.querySelectorAll(".movie-card");
  const maxIndex = Math.max(0, cards.length - VISIBLE);
  let currentIndex = 0;

  function goTo(index) {
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    grid.style.transform = `translateX(-${currentIndex * step}px)`;
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;
  }

  prevBtn.addEventListener("click", () => goTo(currentIndex - 1));
  nextBtn.addEventListener("click", () => goTo(currentIndex + 1));

  let isDragging = false;
  let startX = 0;
  let dragOffset = 0;
  let hasDragged = false;

  grid.addEventListener("mousedown", (e) => {
    isDragging = true;
    hasDragged = false;
    startX = e.clientX;
    dragOffset = 0;
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    dragOffset = e.clientX - startX;
    if (Math.abs(dragOffset) > 5) {
      hasDragged = true;
      grid.classList.add("dragging");
      grid.style.transform = `translateX(${-(currentIndex * step) + dragOffset}px)`;
    }
  });

  window.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    grid.classList.remove("dragging");
    if (hasDragged) {
      if (dragOffset < -80) goTo(currentIndex + 1);
      else if (dragOffset > 80) goTo(currentIndex - 1);
      else goTo(currentIndex);
    }
  });

  grid.addEventListener("click", (e) => {
    if (hasDragged) e.preventDefault();
  });

  let touchStartX = 0;
  let touchCurrentX = 0;

  grid.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
      touchCurrentX = e.touches[0].clientX;
    },
    { passive: true },
  );

  grid.addEventListener(
    "touchmove",
    (e) => {
      touchCurrentX = e.touches[0].clientX;
      const diff = touchCurrentX - touchStartX;
      grid.classList.add("dragging");
      grid.style.transform = `translateX(${-(currentIndex * step) + diff}px)`;
    },
    { passive: true },
  );

  grid.addEventListener("touchend", () => {
    grid.classList.remove("dragging");
    const diff = touchCurrentX - touchStartX;
    if (diff < -50) goTo(currentIndex + 1);
    else if (diff > 50) goTo(currentIndex - 1);
    else goTo(currentIndex);
  });

  grid.style.transition = "transform 0.45s cubic-bezier(0.25, 0.8, 0.25, 1)";
  grid.style.cursor = "grab";

  goTo(0);
}
