// ===== AUTH GUARD =====
(function () {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.replace(
      "https://sukurov2004.github.io/Filmalisa-/pages/client/login.html",
    );
  }
})();

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
    const card = document.createElement("a");
    card.className = "movie-card";
    card.href = `detailed.html?id=${movie.id}`;
    card.innerHTML = `
      <img src="${movie.cover_url || ""}" class="movie-image" alt="${movie.title}" />
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