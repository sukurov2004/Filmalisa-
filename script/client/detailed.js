// ===== AUTH GUARD =====
(function () {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.replace("http://127.0.0.1:5500/pages/client/login.html");
  }
})();

// ===== EMBED URL HELPER =====
function getEmbedUrl(url) {
  if (!url) return "";
  const short = url.match(/youtu\.be\/([^?&]+)/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  const long = url.match(/v=([^&]+)/);
  if (long) return `https://www.youtube.com/embed/${long[1]}`;
  return url;
}

// ===== VIDEO MODAL =====
let currentFragman = "";

window.toggleVideo = function () {
  const modal = document.getElementById("videoModal");
  const iframe = document.getElementById("youtubeFrame");
  modal.classList.toggle("active");
  if (modal.classList.contains("active")) {
    iframe.src = getEmbedUrl(currentFragman);
  } else {
    iframe.src = "";
  }
};

// ===== DETAILS PAGE =====
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");
  const BASE_URL = "https://api.sarkhanrahimli.dev/api/filmalisa";

  const params = new URLSearchParams(window.location.search);
  const movieId = params.get("id");

  if (!movieId) {
    window.location.href = "home.html";
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/movies/${movieId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const movie = data.data;

    // Fragman-ı global dəyişənə yaz
    currentFragman = movie.fragman || "";

    // ── Backdrop və hero ──
    document.querySelector(".hero-backdrop").style.backgroundImage =
      `url('${movie.cover_url}')`;
    document.querySelector(".hero-movie-name").textContent = movie.title;
    document.querySelector(".hero-genre").textContent =
      movie.category?.name || "";

    // ── Poster ──
    document.querySelector("#mainPoster img").src = movie.cover_url;

    // ── Mətn ──
    document.querySelector(".description").textContent = movie.overview || "";
    document.querySelector(".rating-badge").innerHTML =
      `<i class="fa-solid fa-star"></i> ${movie.imdb || ""}`;

    // ── Cast ──
    if (movie.actors && movie.actors.length > 0) {
      const castList = document.querySelector(".cast-list");
      castList.innerHTML = movie.actors
        .map(
          (actor) => `
        <div class="cast-item">
          <div class="cast-img-box">
            <img src="${actor.img_url || "../../assets/client/GridImages/detailedActor.svg"}" alt="${actor.name}" />
          </div>
          <div class="cast-info">
            <span class="actor-real-name">${actor.name} ${actor.surname}</span>
          </div>
        </div>
      `,
        )
        .join("");
    }

    // ── Şərhlər ──
    loadComments(movieId, token, BASE_URL);

    // ── Oxşar filmlər ──
    loadSimilar(movie.category?.id, movieId, token, BASE_URL);
  } catch (err) {
    console.error("Film məlumatları yüklənmədi:", err);
  }

  // ── Şərh göndər ──
  const commentInput = document.querySelector(".comment-field");
  const sendBtn = document.querySelector(".btn-send-comment");

  sendBtn.addEventListener("click", async () => {
    const text = commentInput.value.trim();
    if (!text) return;

    try {
      await fetch(`${BASE_URL}/movies/${movieId}/comment`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: text }),
      });
      commentInput.value = "";
      loadComments(movieId, token, BASE_URL);
    } catch (err) {
      console.error("Şərh göndərilmədi:", err);
    }
  });
});

// ── Şərhlər ──
async function loadComments(movieId, token, BASE_URL) {
  try {
    const res = await fetch(`${BASE_URL}/movies/${movieId}/comments`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const comments = data.data || [];

    const wrapper = document.querySelector(".comments-wrapper-full");
    wrapper.querySelectorAll(".existing-comment").forEach((c) => c.remove());

    comments.forEach((comment) => {
      const div = document.createElement("div");
      div.className = "existing-comment";
      div.innerHTML = `
        <div class="comment-header">
          <div class="comment-user">
            <img src="../../assets/client/GridImages/avatar.svg" alt="User" />
            <span class="username">${comment.user?.full_name || "User"}</span>
          </div>
          <span class="time">${new Date(comment.created_at).toLocaleString()}</span>
        </div>
        <p class="comment-text">${comment.message}</p>
      `;
      wrapper.appendChild(div);
    });
  } catch (err) {
    console.error("Şərhlər yüklənmədi:", err);
  }
}

// ── Oxşar filmlər ──
async function loadSimilar(categoryId, currentMovieId, token, BASE_URL) {
  if (!categoryId) return;

  try {
    const res = await fetch(`${BASE_URL}/movies`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const movies = data.data || [];

    const similar = movies
      .filter(
        (m) =>
          m.category_id === categoryId && m.id !== parseInt(currentMovieId),
      )
      .slice(0, 4);

    if (similar.length === 0) return;

    const grid = document.querySelector(".similar-grid");
    grid.innerHTML = similar
      .map(
        (movie) => `
      <article class="movie-card" onclick="window.location.href='detailed.html?id=${movie.id}'">
        <div class="card-poster" style="background-image: url('${movie.cover_url}')"></div>
        <div class="card-meta">
          <span class="card-genre">${movie.category?.name || ""}</span>
          <div class="card-stars">★★★★★</div>
          <h3 class="card-name">${movie.title}</h3>
        </div>
      </article>
    `,
      )
      .join("");
  } catch (err) {
    console.error("Oxşar filmlər yüklənmədi:", err);
  }
}
