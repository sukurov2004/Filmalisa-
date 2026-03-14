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

const API_BASE = "https://api.sarkhanrahimli.dev/api/filmalisa";
const token = localStorage.getItem("token");

const grid = document.getElementById("resultsGrid");
const input = document.getElementById("searchInput");
const btn = document.getElementById("searchBtn");
const paginationEl = document.querySelector(".pagination");

// ---------- Kart render ----------
function renderMovies(list) {
  grid.innerHTML = "";

  if (!list || list.length === 0) {
    paginationEl.innerHTML = "";
    grid.innerHTML = `
      <div style="
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        pointer-events: none;
      ">
        <div class="error-container" style="pointer-events: all; text-align: center;">
          <img class="error-img" src="../../assets/client/GridImages/error.svg" alt="" />
          <h1 class="error-title">Lost your way?</h1>
          <p class="error-text">Oops! This is awkward. You are looking for something that doesn't actually exist.</p>
          <button class="error-btn" onclick="window.location.href='search.html'">Go Home</button>
        </div>
      </div>
    `;
    return;
  }

  const fragment = document.createDocumentFragment();

  list.forEach((movie) => {
    const embedBase = getEmbedUrl(movie.fragman);
    const videoId = getVideoId(movie.fragman);
    const trailerSrc = embedBase
      ? `${embedBase}?autoplay=1&mute=1&controls=0&modestbranding=1&loop=1&playlist=${videoId}&disablekb=1&iv_load_policy=3&rel=0&fs=0&playsinline=1`
      : "";

    const card = document.createElement("a");
    card.className = "movie-card";
    card.href = `detailed.html?id=${movie.id}`;
    card.innerHTML = `
      <img src="${movie.cover_url || ""}" class="movie-image" alt="${movie.title}" />
      ${trailerSrc ? `
        <div class="card-trailer">
          <iframe src="" data-src="${trailerSrc}" allowfullscreen allow="autoplay"></iframe>
        </div>
      ` : ""}
      <div class="movie-details">
        <div class="movie-category-container">
          <span class="movie-category">${movie.category?.name || ""}</span>
        </div>
        <div class="movie-rating">
          ${renderStars(movie.imdb || 0)}
        </div>
        <p class="movie-title">${movie.title}</p>
      </div>
    `;
    fragment.appendChild(card);
  });

  grid.appendChild(fragment);

  const cards = Array.from(grid.querySelectorAll(".movie-card"));
  const pager = initPagination(null, paginationEl, 8);
  pager.init(cards);
  initCardTrailers();
}

// ---------- API-dən film gətir ----------
async function fetchMovies(query = "") {
  try {
    const url = query
      ? `${API_BASE}/movies?search=${encodeURIComponent(query)}`
      : `${API_BASE}/movies`;

    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("API error: " + res.status);

    const data = await res.json();
    const list = Array.isArray(data) ? data : data.data || [];

    renderMovies(list);
  } catch (err) {
    console.error(err);
    paginationEl.innerHTML = "";
    grid.innerHTML = `<p style="color:#ff6b6b; padding:20px;">Error loading data</p>`;
  }
}

// ---------- Axtarış düyməsi ----------
btn.addEventListener("click", () => {
  fetchMovies(input.value.trim());
});

// ---------- Enter ilə axtarış ----------
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") fetchMovies(input.value.trim());
});

// ---------- Səhifə açılanda bütün filmlər ----------
fetchMovies();