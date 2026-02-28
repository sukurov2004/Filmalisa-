// ===== AUTH GUARD =====
(function () {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.replace("https://sukurov2004.github.io/Filmalisa-/pages/client/login.html");
  }
})();

// search.js

const API_BASE = "BURADA_API_URL"; 
// məsələn: "https://api.sarkhanrahimli.dev/api/filmalisa" və ya sizin endpoint

const gridEl = document.querySelector(".grid");
const inputEl = document.querySelector(".search input"); // ✅ düz
const clearBtn = document.querySelector(".search-add");

// ---------- Kart render edən funksiya ----------
function renderMovies(list) {
  grid.innerHTML = "";

  if (!list || list.length === 0) {
    grid.innerHTML = `<p style="opacity:.7">No results</p>`;
    return;
  }

  const fragment = document.createDocumentFragment();

  list.forEach((movie) => {
    // BU field-ləri API-nə uyğunlaşdır:
    const id = movie.id || movie._id;
    const title = movie.name || movie.title || "No title";
    const genre = movie.genre || movie.category || "Unknown";
    const rating = Number(movie.rating || 5);
    const posterUrl = movie.image || movie.poster || movie.posterUrl || "";

    const card = document.createElement("article");
    card.className = "card";
    card.dataset.id = id; // klikdə lazım olacaq

    card.innerHTML = `
      <div class="poster" style="background-image:url('${posterUrl}')"></div>
      <div class="meta">
        <span class="tag">${genre}</span>
        <div class="stars">${"★".repeat(Math.round(rating))}</div>
        <h3 class="name">${title}</h3>
      </div>
    `;

    fragment.appendChild(card);
  });

  grid.appendChild(fragment);
}

// ---------- API-dən film gətir ----------
async function fetchMovies(query = "") {
  try {
    // endpoint nümunələri:
    // 1) /movies?search=batman
    // 2) /movies/search?q=batman
    // səninki necədirsə onu yaz

    const url = query
      ? `${API_BASE}/movies?search=${encodeURIComponent(query)}`
      : `${API_BASE}/movies`;

    const res = await fetch(url);
    if (!res.ok) throw new Error("API error: " + res.status);

    const data = await res.json();

    // bəzi API-lər { data: [...] } qaytarır, bəzisi birbaşa [...]
    const list = Array.isArray(data) ? data : data.data || data.movies || [];

    renderMovies(list);
  } catch (err) {
    console.error(err);
    grid.innerHTML = `<p style="color:#ff6b6b">Error loading data</p>`;
  }
}

// ---------- Kliklə kart işləsin (Event Delegation) ----------
grid.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;

  const id = card.dataset.id;

  // 1) Detal səhifəsinə keçid (ən rahat)
  window.location.href = `movie-detail.html?id=${encodeURIComponent(id)}`;

  // 2) və ya modal açmaq istəyirsənsə deyərsən, onu da edərəm.
});

// ---------- Axtarış ----------
btn.addEventListener("click", () => {
  fetchMovies(input.value.trim());
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") fetchMovies(input.value.trim());
});

// ---------- Page açılan kimi ----------
fetchMovies();

