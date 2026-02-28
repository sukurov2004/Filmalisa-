// ===== AUTH GUARD =====
(function () {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.replace("http://127.0.0.1:5500/pages/client/login.html");
  }
})();

const API_BASE = "https://api.sarkhanrahimli.dev/api/filmalisa";
const token = localStorage.getItem("token");

const grid = document.getElementById("resultsGrid");
const input = document.getElementById("searchInput");
const btn = document.getElementById("searchBtn");

// ---------- Kart render ----------
function renderMovies(list) {
  grid.innerHTML = "";

if (!list || list.length === 0) {
    grid.innerHTML = `
      <div class="error-container">
        <img
          class="error-img"
          src="../../assets/client/GridImages/error.svg"
          alt=""
        />
        <h1 class="error-title">Lost your way?</h1>
        <p class="error-text">
          Oops! This is awkward. You are looking for something that doesn't actually exist.
        </p>
        <button class="error-btn" onclick="window.location.href='search.html'">Go Home</button>
      </div>
    `;
    return;
  }
  const fragment = document.createDocumentFragment();

  list.forEach((movie) => {
    const id = movie.id;
    const title = movie.title || "No title";
    const genre = movie.category?.name || "Unknown";
    const rating = Number(movie.rating || 5);
    const posterUrl = movie.cover_url || "";

    const card = document.createElement("article");
    card.className = "card";
    card.dataset.id = id;

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
    grid.innerHTML = `<p style="color:#ff6b6b; padding:20px;">Error loading data</p>`;
  }
}

// ---------- Karta klik ----------
grid.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;
  const id = card.dataset.id;
  window.location.href = `detailed.html?id=${encodeURIComponent(id)}`;
});

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