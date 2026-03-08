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
  const thumbnail = document.getElementById("videoThumbnail");

  modal.classList.toggle("active");

  if (modal.classList.contains("active")) {
    // Əvvəlcə thumbnail göstər, iframe gizlət
    iframe.src = "";
    iframe.style.display = "none";
    if (thumbnail) thumbnail.style.display = "flex";
  } else {
    iframe.src = "";
    iframe.style.display = "none";
    if (thumbnail) thumbnail.style.display = "flex";
  }
};

window.playVideo = function () {
  const iframe = document.getElementById("youtubeFrame");
  const thumbnail = document.getElementById("videoThumbnail");
  iframe.src = getEmbedUrl(currentFragman);
  iframe.style.display = "block";
  if (thumbnail) thumbnail.style.display = "none";
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

    // Fragmanı global dəyişənə yaz
    currentFragman = movie.fragman || "";

    // ── Backdrop və hero ──
    document.querySelector(".hero-backdrop").style.backgroundImage =
      `url('${movie.cover_url}')`;
    document.querySelector(".hero-movie-name").textContent = movie.title;
    document.querySelector(".hero-genre").textContent =
      movie.category?.name || "";

    // ── Poster ──
    document.querySelector("#mainPoster img").src = movie.cover_url;
    const thumbImg = document.getElementById("thumbImg");
    if (thumbImg) thumbImg.src = movie.cover_url;

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
              <img
                src="${actor.img_url}"
                alt="${actor.name}"
              />
            </div>
            <div class="cast-info">
              <span class="actor-real-name">${actor.name} ${actor.surname}</span>
            </div>
          </div>
        `,
        )
        .join("");
    }

    // ── Favorite button ──
    const circleBtn = document.querySelector(".circle-btn");

    const favRes = await fetch(`${BASE_URL}/movies/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const favData = await favRes.json();
    const isFav = (favData.data || []).some((m) => m.id === parseInt(movieId));
    if (isFav) circleBtn.classList.add("active");

    circleBtn.addEventListener("click", async () => {
      try {
        await fetch(`${BASE_URL}/movie/${movieId}/favorite`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        circleBtn.classList.toggle("active");
      } catch (err) {
        console.error("Favorite əlavə edilmədi:", err);
      }
    });

    // ── Watch button ──
    const watchBtn = document.querySelector(".btn-watch");
    if (watchBtn && movie.watch_url) {
      watchBtn.setAttribute(
        "onclick",
        `window.open('${movie.watch_url}', '_blank')`,
      );
    }

    // ── Şərhlər və oxşar filmlər ──
    await loadComments(movieId, token, BASE_URL);
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
        body: JSON.stringify({ comment: text }),
      });
      commentInput.value = "";
      await loadComments(movieId, token, BASE_URL);
    } catch (err) {
      console.error("Şərh göndərilmədi:", err);
    }
  });

  commentInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendBtn.click();
  });
});

// ===== LOAD COMMENTS =====
async function loadComments(movieId, token, BASE_URL) {
  try {
    // Cari istifadəçinin məlumatlarını al
    const profileRes = await fetch(
      `https://api.sarkhanrahimli.dev/api/filmalisa/profile`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const profileData = await profileRes.json();
    const currentUserId = profileData.data?.id;
    const currentUserAvatar =
      profileData.data?.img_url || "../../assets/client/GridImages/avatar.svg";

    // Input area avatarını profil şəkli ilə yenilə
    const inputAvatar = document.querySelector(".user-avatar-sm img");
    if (inputAvatar) inputAvatar.src = currentUserAvatar;

    // Şərhləri yüklə
    const res = await fetch(
      `https://api.sarkhanrahimli.dev/api/filmalisa/movies/${movieId}/comments`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const data = await res.json();
    const comments = data.data || [];

    const wrapper = document.querySelector(".comments-wrapper-full");
    wrapper.querySelectorAll(".existing-comment").forEach((c) => c.remove());

    comments.forEach((comment) => {
      const isOwner = comment.user?.id === currentUserId;

      // Öz şərhisə profil avatarı, deyilsə default avatar
      const avatar = isOwner
        ? currentUserAvatar
        : "../../assets/client/İconsİmages/user.svg";

      const div = document.createElement("div");
      div.className = "existing-comment";
      div.innerHTML = `
        <div class="comment-header">
          <div class="comment-user">
            <img src="${avatar}" alt="User" />
            <span class="username">${comment.user?.full_name || "User"}</span>
          </div>
          <div style="display:flex; align-items:center; gap:8px;">
            <span class="time">${new Date(comment.created_at).toLocaleString()}</span>
            ${
              isOwner
                ? `<i class="fa-solid fa-trash comment-delete" data-id="${comment.id}" style="cursor:pointer; color:#ffffff60; font-size:14px;"></i>`
                : ""
            }
          </div>
        </div>
        <p class="comment-text">${comment.comment}</p>
      `;
      wrapper.appendChild(div);
    });

    // Şərh silmə
    wrapper.querySelectorAll(".comment-delete").forEach((icon) => {
      icon.addEventListener("click", async () => {
        try {
          await fetch(
            `https://api.sarkhanrahimli.dev/api/filmalisa/movies/${movieId}/comment/${icon.dataset.id}`,
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          await loadComments(movieId, token, BASE_URL);
        } catch (err) {
          console.error("Şərh silinmədi:", err);
        }
      });
    });
  } catch (err) {
    console.error("Şərhlər yüklənmədi:", err);
  }
}

// ===== LOAD SIMILAR MOVIES =====
async function loadSimilar(categoryId, currentMovieId, token, BASE_URL) {
  if (!categoryId) return;

  try {
    const res = await fetch(
      `https://api.sarkhanrahimli.dev/api/filmalisa/categories`,
      { headers: { Authorization: `Bearer ${token}` } },
    );
    const data = await res.json();
    const categories = data.data || [];

    const category = categories.find((c) => c.id === categoryId);
    if (!category) return;

    const similar = (category.movies || []).filter(
      (m) => m.id !== parseInt(currentMovieId),
    );
    if (similar.length === 0) return;

    const grid = document.querySelector(".similar-grid");
    grid.innerHTML = similar
      .map(
        (movie) => `
        <a class="movie-card" href="detailed.html?id=${movie.id}">
          <img
            src="${movie.cover_url || ""}"
            class="movie-image"
            alt="${movie.title}"
          />
          <div class="movie-details">
            <div class="movie-category-container">
              <span class="movie-category">${category.name}</span>
            </div>
            <div class="movie-rating">
              ${renderStars(movie.imdb || 0)}
            </div>
            <p class="movie-title">${movie.title}</p>
          </div>
        </a>
      `,
      )
      .join("");
  } catch (err) {
    console.error("Oxşar filmlər yüklənmədi:", err);
  }

  const similarCarousel = document.querySelector(
    ".similar-wrapper .category-carousel",
  );
  if (similarCarousel) initCarousel(similarCarousel);
}
