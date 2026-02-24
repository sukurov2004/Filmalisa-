const API_BASE = "https://api.sarkhanrahimli.dev/api/filmalisa";

const modal          = document.getElementById("movieModal");
const tableBody      = document.querySelector(".movies-table tbody");
const previewImg     = document.querySelector(".modal-right img");
const submitBtn      = document.querySelector(".submit-btn");
const createBtn      = document.getElementById("createBtn");
const closeModalBtn  = document.getElementById("closeModal");
const titleInput     = document.getElementById("titleInput");
const overviewInput  = document.getElementById("overviewInput");
const coverInput     = document.getElementById("coverInput");
const trailerInput   = document.getElementById("trailerInput");
const watchInput     = document.getElementById("watchInput");
const imdbInput      = document.getElementById("imdbInput");
const runtimeInput   = document.getElementById("runtimeInput");
const actorsInput    = document.getElementById("actorsInput");
const categorySelect = document.getElementById("categorySelect");
const adultCheck     = document.getElementById("adultCheck");

let editingId  = null;
let pagination = null;
const token    = localStorage.getItem("adminToken");

// ── Səhifə yüklənəndə ─────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  if (!token) {
    window.location.href = "https://sukurov2004.github.io/Filmalisa-/index.html";
    return;
  }
  pagination = initPagination(tableBody, document.querySelector(".pagination"), 8);
  getCategories();
  getMovies();
});

// ── Bildiriş ──────────────────────────────────────────────────
function showNotification(msg, type = "success") {
  document.querySelector(".notif")?.remove();
  const notif = document.createElement("div");
  notif.className = "notif";
  notif.textContent = msg;
  notif.style.cssText = `
    position:fixed; top:20px; right:20px; z-index:9999;
    padding:12px 20px; border-radius:8px; font-size:14px; font-weight:500;
    background:${type === "success" ? "#22c55e" : "#ef4444"}; color:#fff;
    box-shadow:0 4px 12px rgba(0,0,0,0.3);
  `;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}

// ── "22,10" → [22, 10] ────────────────────────────────────────
function parseActors(value) {
  return value
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n));
}

// ── GET — Categoryləri yüklə ──────────────────────────────────
async function getCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const data       = await res.json();
    const categories = Array.isArray(data) ? data : data.categories || data.data || [];

    categorySelect.innerHTML = `<option value="">Category</option>`;
    categories.forEach((cat) => {
      const opt       = document.createElement("option");
      opt.value       = cat.id;
      opt.textContent = cat.name;
      categorySelect.appendChild(opt);
    });
  } catch (err) {
    console.error("Categories yüklənmədi:", err);
  }
}

// ── API obyektini normallaşdır ─────────────────────────────────
function normalizeMovie(movie) {
  return {
    id:       movie.id,
    title:    movie.title        || "",
    overview: movie.overview     || "",
    cover:    movie.cover_url    || movie.cover   || "",
    trailer:  movie.fragman      || movie.trailer || "",
    watch:    movie.watch_url    || movie.watch   || "",
    imdb:     movie.imdb         || "",
    runtime:  movie.run_time_min || movie.runtime || "",
    category: movie.category?.id || movie.category || "",
    isAdult:  movie.adult        ?? movie.isAdult ?? false,
    actors:   movie.actors       || [],
  };
}

// ── Inputları təmizlə ─────────────────────────────────────────
function clearInputs() {
  titleInput.value      = "";
  overviewInput.value   = "";
  coverInput.value      = "";
  trailerInput.value    = "";
  watchInput.value      = "";
  imdbInput.value       = "";
  runtimeInput.value    = "";
  actorsInput.value     = "";
  categorySelect.value  = "";
  adultCheck.checked    = false;
  previewImg.src        = "../../assets/Admin/images/movies.svg";
  submitBtn.textContent = "Submit";
  editingId             = null;
}

// ── Modal aç / bağla ──────────────────────────────────────────
function openModal(movie = null) {
  // Əgər create rejimi açılırsa — inputları təmizlə
  // Əgər edit rejimi açılırsa — mövcud məlumatları doldur
  if (!movie) {
    clearInputs();
  } else {
    const m = normalizeMovie(movie);
    editingId             = movie.id;
    titleInput.value      = m.title;
    overviewInput.value   = m.overview;
    coverInput.value      = m.cover;
    trailerInput.value    = m.trailer;
    watchInput.value      = m.watch;
    imdbInput.value       = m.imdb;
    runtimeInput.value    = m.runtime;
    categorySelect.value  = m.category;
    adultCheck.checked    = m.isAdult;
    previewImg.src        = m.cover || "../../assets/Admin/images/movies.svg";
    actorsInput.value     = m.actors.map((a) => a.id ?? a).join(", ");
    submitBtn.textContent = "Update";
  }

  modal.classList.add("active");
}

// Modal bağlananda inputlar qalır — yalnız görünüş gizlənir
function closeModal() {
  modal.classList.remove("active");
}

// Create düyməsi: əgər modal artıq açıqdırsa inputlar qalsın,
// yox əgər edit modundadırsa yeni create açılsın
createBtn.addEventListener("click", () => openModal());
closeModalBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });

coverInput.addEventListener("input", () => {
  previewImg.src = coverInput.value.trim() || "../../assets/Admin/images/movies.svg";
});

// ── GET — filmlər siyahısı ────────────────────────────────────
async function getMovies() {
  try {
    const res = await fetch(`${API_BASE}/admin/movies`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`${res.status}`);
    const data   = await res.json();
    const movies = Array.isArray(data) ? data : data.movies || data.data || [];
    renderTable(movies);
  } catch (err) {
    showNotification("Filmlər yüklənmədi: " + err.message, "error");
  }
}

// ── Cədvəli render et ─────────────────────────────────────────
function truncate(text, max) {
  if (!text) return "—";
  return text.length > max ? text.slice(0, max) + "..." : text;
}

function renderTable(movies) {
  tableBody.innerHTML = "";

  if (!movies.length) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:20px;opacity:.5;">No movies found</td></tr>`;
    return;
  }

  movies.forEach((raw, i) => {
    const movie = normalizeMovie(raw);
    const tr    = document.createElement("tr");
    tr.innerHTML = `
      <td>${movie.id ?? i + 1}</td>
      <td class="movie-title">
        <img src="${movie.cover || "../../assets/Admin/images/movies.svg"}" alt=""
          onerror="this.src='../../assets/Admin/images/movies.svg'" />
        <span title="${movie.title}">${truncate(movie.title, 20)}</span>
      </td>
      <td title="${movie.overview}">${truncate(movie.overview, 35)}</td>
      <td>${truncate(categorySelect.querySelector(`option[value="${movie.category}"]`)?.textContent || "—", 12)}</td>
      <td>${movie.imdb || "—"}</td>
      <td><i class="fa-solid fa-pen edit"    data-id="${movie.id}"></i></td>
      <td><i class="fa-solid fa-trash delete" data-id="${movie.id}"></i></td>
    `;
    tableBody.appendChild(tr);
  });

  tableBody.querySelectorAll(".edit").forEach((btn) =>
    btn.addEventListener("click", () => getMovieById(btn.dataset.id))
  );
  tableBody.querySelectorAll(".delete").forEach((btn) =>
    btn.addEventListener("click", () => confirmDelete(btn.dataset.id))
  );

  pagination.init([...tableBody.querySelectorAll("tr")]);
}

// ── GET — tək film (edit üçün) ────────────────────────────────
async function getMovieById(id) {
  try {
    const res = await fetch(`${API_BASE}/admin/movie/${id}`, {
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`${res.status}`);
    const data = await res.json();
    openModal(data.movie || data.data || data);
  } catch (err) {
    showNotification("Film tapılmadı: " + err.message, "error");
  }
}

// ── DELETE ────────────────────────────────────────────────────
function confirmDelete(id) {
  if (typeof openDeleteModal === "function") {
    openDeleteModal(() => deleteMovie(id));
  } else {
    if (confirm("Bu filmi silmək istəyirsiniz?")) deleteMovie(id);
  }
}

async function deleteMovie(id) {
  try {
    const res = await fetch(`${API_BASE}/admin/movie/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`${res.status}`);
    showNotification("Film silindi!");
    getMovies();
  } catch (err) {
    showNotification("Silinmə uğursuz: " + err.message, "error");
  }
}

// ── POST / PUT ────────────────────────────────────────────────
submitBtn.addEventListener("click", async () => {
  const title  = titleInput.value.trim();
  const actors = parseActors(actorsInput.value);

  if (!title)         { showNotification("Title boş ola bilməz", "error"); return; }
  if (!actors.length) { showNotification("Ən azı 1 actor ID daxil edin (məs: 22,10)", "error"); return; }

  const body = {
    title,
    overview:     overviewInput.value.trim(),
    cover_url:    coverInput.value.trim(),
    fragman:      trailerInput.value.trim(),
    watch_url:    watchInput.value.trim(),
    imdb:         imdbInput.value.trim(),
    run_time_min: Number(runtimeInput.value) || 0,
    category:     Number(categorySelect.value) || null,
    adult:        adultCheck.checked,
    actors,
  };

  const isEditing = Boolean(editingId);
  const url    = isEditing ? `${API_BASE}/admin/movie/${editingId}` : `${API_BASE}/admin/movie`;
  const method = isEditing ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `${res.status}`);
    }

    showNotification(isEditing ? "Film yeniləndi!" : "Film əlavə edildi!");
    clearInputs();   // yalnız uğurlu submit-dən sonra təmizlə
    closeModal();
    getMovies();
  } catch (err) {
    showNotification("Xəta: " + err.message, "error");
  }
});