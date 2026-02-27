// search.js (API -> render cards -> live search)
document.addEventListener("DOMContentLoaded", () => {
  const gridEl = document.querySelector(".grid");
  const inputEl = document.querySelector(".search");
  const clearBtn = document.querySelector(".search-add");

  // ✅ 1) BURANI ÖZ API URL-İN İLƏ DƏYİŞ
  const API_URL = "https://api.example.com/movies";

  let allMovies = [];

  // ============ helpers ============
  const norm = (v) => String(v ?? "").toLowerCase().trim().replace(/\s+/g, " ");

  function toStars(rating) {
    // 0-5 arası ulduz
    const n = Math.max(0, Math.min(5, Number(rating) || 0));
    return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);
  }

  function getPoster(movie) {
    // poster field adları fərqli ola bilər, ona görə fallback-lər
    return (
      movie.poster ||
      movie.posterUrl ||
      movie.image ||
      movie.thumbnail ||
      "../../assets/client/GridImages/grid1.svg"
    );
  }

  function getTitle(movie) {
    return movie.title || movie.name || movie.movieName || "Untitled";
  }

  function getGenre(movie) {
    return movie.genre || movie.category || movie.tag || "Movie";
  }

  function getRating(movie) {
    // bəzən rating 10 üzərindən gəlir, onu 5-ə çeviririk
    const r = Number(movie.rating ?? movie.imdb ?? movie.rate ?? 4);
    if (!Number.isFinite(r)) return 4;
    return r > 5 ? Math.round(r / 2) : Math.round(r);
  }

  // ============ render ============
  function render(list) {
    if (!gridEl) return;

    if (!list.length) {
      gridEl.innerHTML = `<p style="opacity:.7;padding:12px">No results found</p>`;
      return;
    }

    gridEl.innerHTML = list
      .map((movie) => {
        const title = getTitle(movie);
        const genre = getGenre(movie);
        const poster = getPoster(movie);
        const stars = toStars(getRating(movie));

        return `
          <article class="card">
            <div class="poster" style="background-image:url('${poster}')"></div>
            <div class="meta">
              <span class="tag">${genre}</span>
              <div class="stars">${stars}</div>
              <h3 class="name">${title}</h3>
            </div>
          </article>
        `;
      })
      .join("");
  }

  // ============ fetch ============
  async function loadMovies() {
    if (!gridEl) return;

    gridEl.innerHTML = `<p style="opacity:.7;padding:12px">Loading...</p>`;

    try {
      const res = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();

      // API bəzən array qaytarır, bəzən {data: []} qaytarır
      const list =
        Array.isArray(data) ? data :
        Array.isArray(data.data) ? data.data :
        Array.isArray(data.results) ? data.results :
        Array.isArray(data.movies) ? data.movies :
        [];

      allMovies = list;
      render(allMovies);
    } catch (err) {
      console.error("API error:", err);
      gridEl.innerHTML = `<p style="opacity:.7;padding:12px">API error: ${err.message}</p>`;
    }
  }

  // ============ search ============
  function filterNow() {
    const q = norm(inputEl?.value);

    if (!q) {
      render(allMovies);
      return;
    }

    const filtered = allMovies.filter((m) => {
      const title = norm(getTitle(m));
      const genre = norm(getGenre(m));
      return title.includes(q) || genre.includes(q);
    });

    render(filtered);
  }

  if (inputEl) inputEl.addEventListener("input", filterNow);

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      if (!inputEl) return;
      inputEl.value = "";
      render(allMovies);
      inputEl.focus();
    });
  }

  // start
  loadMovies();
});