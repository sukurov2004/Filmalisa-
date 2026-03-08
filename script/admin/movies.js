const API_BASE = "https://api.sarkhanrahimli.dev/api/filmalisa";

const modal = document.getElementById("movieModal");
const tableBody = document.querySelector(".movies-table tbody");
const previewImg = document.querySelector(".modal-right img");
const submitBtn = document.querySelector(".submit-btn");
const createBtn = document.getElementById("createBtn");
const closeModalBtn = document.getElementById("closeModal");
const titleInput = document.getElementById("titleInput");
const overviewInput = document.getElementById("overviewInput");
const coverInput = document.getElementById("coverInput");
const trailerInput = document.getElementById("trailerInput");
const watchInput = document.getElementById("watchInput");
const imdbInput = document.getElementById("imdbInput");
const runtimeInput = document.getElementById("runtimeInput");
const actorSelect = document.getElementById("actorSelect");
const categorySelect = document.getElementById("categorySelect");
const adultCheck = document.getElementById("adultCheck");

let actorDropdownWrapper = null;
let actorTrigger = null;
let actorList = null;
let selectedActorIds = new Set();

let categoryDropdownWrapper = null;
let categoryTrigger = null;
let categoryList = null;
let selectedCategoryId = null;
let selectedCategoryName = "";

let editingId = null;
let pagination = null;
const token = localStorage.getItem("adminToken");

// =============================================
// DOMContentLoaded
// =============================================
document.addEventListener("DOMContentLoaded", async () => {
  if (!token) {
    window.location.replace(
      "https://sukurov2004.github.io/Filmalisa-/pages/admin/login.html",
    );
    return;
  }

  pagination = initPagination(
    tableBody,
    document.querySelector(".pagination"),
    5,
  );

  buildActorDropdown();
  buildCategoryDropdown();

  await getCategories();
  await getActors();
  await getMovies();
});

// =============================================
// CUSTOM ACTOR CHECKBOX DROPDOWN
// =============================================
function buildActorDropdown() {
  actorSelect.style.display = "none";

  actorDropdownWrapper = document.createElement("div");
  actorDropdownWrapper.className = "actor-dropdown";

  actorTrigger = document.createElement("div");
  actorTrigger.className = "actor-dropdown-trigger";
  actorTrigger.textContent = "Actors";

  actorList = document.createElement("div");
  actorList.className = "actor-dropdown-list";

  actorDropdownWrapper.appendChild(actorTrigger);
  actorDropdownWrapper.appendChild(actorList);
  actorSelect.parentNode.insertBefore(actorDropdownWrapper, actorSelect);

  actorTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    actorDropdownWrapper.classList.toggle("open");
    categoryDropdownWrapper.classList.remove("open");
  });

  document.addEventListener("click", (e) => {
    if (!actorDropdownWrapper.contains(e.target)) {
      actorDropdownWrapper.classList.remove("open");
    }
  });
}

function populateActorDropdown(actors) {
  actorList.innerHTML = "";
  actors.forEach((actor) => {
    const id = actor.id;
    const name =
      actor.full_name || actor.name || actor.fullName || `Actor #${id}`;

    const label = document.createElement("label");
    label.className = "actor-option";

    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.value = id;
    cb.checked = selectedActorIds.has(Number(id));

    cb.addEventListener("change", () => {
      if (cb.checked) selectedActorIds.add(Number(id));
      else selectedActorIds.delete(Number(id));
      updateActorTriggerLabel();
    });

    label.appendChild(cb);
    label.appendChild(document.createTextNode(" " + name));
    actorList.appendChild(label);
  });

  updateActorTriggerLabel();
}

function updateActorTriggerLabel() {
  const count = selectedActorIds.size;
  actorTrigger.textContent =
    count === 0 ? "Select Actors" : `${count} Actors Selected`;
}

function clearActorSelection() {
  selectedActorIds.clear();
  actorList
    .querySelectorAll("input[type=checkbox]")
    .forEach((cb) => (cb.checked = false));
  updateActorTriggerLabel();
}

function setSelectedActors(actorIds) {
  selectedActorIds = new Set(actorIds.map(Number));
  actorList.querySelectorAll("input[type=checkbox]").forEach((cb) => {
    cb.checked = selectedActorIds.has(Number(cb.value));
  });
  updateActorTriggerLabel();
}

// =============================================
// CUSTOM CATEGORY RADIO DROPDOWN
// =============================================
function buildCategoryDropdown() {
  categorySelect.style.display = "none";

  categoryDropdownWrapper = document.createElement("div");
  categoryDropdownWrapper.className = "actor-dropdown";

  categoryTrigger = document.createElement("div");
  categoryTrigger.className = "actor-dropdown-trigger";
  categoryTrigger.textContent = "Category";

  categoryList = document.createElement("div");
  categoryList.className = "actor-dropdown-list";

  categoryDropdownWrapper.appendChild(categoryTrigger);
  categoryDropdownWrapper.appendChild(categoryList);
  categorySelect.parentNode.insertBefore(
    categoryDropdownWrapper,
    categorySelect,
  );

  categoryTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    categoryDropdownWrapper.classList.toggle("open");
    actorDropdownWrapper.classList.remove("open");
  });

  document.addEventListener("click", (e) => {
    if (!categoryDropdownWrapper.contains(e.target)) {
      categoryDropdownWrapper.classList.remove("open");
    }
  });
}

function populateCategoryDropdown(categories) {
  categoryList.innerHTML = "";

  const noneLabel = document.createElement("label");
  noneLabel.className = "actor-option";
  const noneCb = document.createElement("input");
  noneCb.type = "radio";
  noneCb.name = "category-radio";
  noneCb.value = "";
  noneCb.checked = !selectedCategoryId;
  noneCb.addEventListener("change", () => {
    selectedCategoryId = null;
    selectedCategoryName = "";
    categoryTrigger.textContent = "Select Category";
    categorySelect.value = "";
    categoryDropdownWrapper.classList.remove("open");
  });
  noneLabel.appendChild(noneCb);
  noneLabel.appendChild(document.createTextNode(" —"));
  categoryList.appendChild(noneLabel);

  categories.forEach((cat) => {
    const label = document.createElement("label");
    label.className = "actor-option";

    const rb = document.createElement("input");
    rb.type = "radio";
    rb.name = "category-radio";
    rb.value = cat.id;
    rb.checked = Number(selectedCategoryId) === Number(cat.id);

    rb.addEventListener("change", () => {
      selectedCategoryId = cat.id;
      selectedCategoryName = cat.name;
      categoryTrigger.textContent = cat.name;
      categorySelect.value = cat.id;
      categoryDropdownWrapper.classList.remove("open");
    });

    label.appendChild(rb);
    label.appendChild(document.createTextNode(" " + cat.name));
    categoryList.appendChild(label);
  });
}

function setSelectedCategory(catId) {
  selectedCategoryId = catId ? Number(catId) : null;
  const opt = categorySelect.querySelector(`option[value="${catId}"]`);
  selectedCategoryName = opt ? opt.textContent : "";
  categoryTrigger.textContent = selectedCategoryName || "Select Category";
  categoryList.querySelectorAll("input[type=radio]").forEach((rb) => {
    rb.checked = rb.value == catId;
  });
}

function clearCategorySelection() {
  selectedCategoryId = null;
  selectedCategoryName = "";
  categoryTrigger.textContent = "Select Category";
  categorySelect.value = "";
  categoryList.querySelectorAll("input[type=radio]").forEach((rb) => {
    rb.checked = rb.value === "";
  });
}

// =============================================
// NOTIFICATION
// =============================================
function showNotification(msg, type = "success") {
  document.querySelector(".notif")?.remove();
  const notif = document.createElement("div");
  notif.className = "notif";
  notif.textContent = msg;
  notif.style.cssText = `
    position:fixed; top:20px; right:20px; z-index:99999;
    padding:12px 20px; border-radius:8px; font-size:14px; font-weight:500;
    background:${type === "success" ? "#22c55e" : "#ef4444"}; color:#fff;
    box-shadow:0 4px 12px rgba(0,0,0,0.3);
  `;
  document.body.appendChild(notif);
  setTimeout(() => notif.remove(), 3000);
}

// =============================================
// NORMALIZE
// =============================================
function normalizeMovie(movie) {
  return {
    id: movie.id,
    title: movie.title || "",
    overview: movie.overview || "",
    cover: movie.cover_url || movie.cover || "",
    trailer: movie.fragman || movie.trailer || "",
    watch: movie.watch_url || movie.watch || "",
    imdb: movie.imdb || "",
    runtime: movie.run_time_min || movie.runtime || "",
    category: movie.category?.id || movie.category || "",
    isAdult: movie.adult ?? movie.isAdult ?? false,
    actors: movie.actors || [],
  };
}

// =============================================
// CLEAR INPUTS
// =============================================
function clearInputs() {
  titleInput.value = "";
  overviewInput.value = "";
  coverInput.value = "";
  trailerInput.value = "";
  watchInput.value = "";
  imdbInput.value = "";
  runtimeInput.value = "";
  adultCheck.checked = false;
  previewImg.src = "../../assets/Admin/images/movies.svg";
  submitBtn.textContent = "Submit";
  editingId = null;
  clearActorSelection();
  clearCategorySelection();
}

// =============================================
// API CALLS
// =============================================
async function getCategories() {
  try {
    const res = await fetch(`${API_BASE}/categories`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return;
    const data = await res.json();
    const categories = Array.isArray(data)
      ? data
      : data.categories || data.data || [];

    categorySelect.innerHTML = `<option value="">Category</option>`;
    categories.forEach((cat) => {
      const opt = document.createElement("option");
      opt.value = cat.id;
      opt.textContent = cat.name;
      categorySelect.appendChild(opt);
    });

    populateCategoryDropdown(categories);
  } catch (err) {
    console.error("Categories error:", err);
  }
}

async function getActors() {
  try {
    const res = await fetch(`${API_BASE}/admin/actors`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) return;
    const data = await res.json();
    const actors = Array.isArray(data)
      ? data
      : data.actors || data.data || data.results || [];

    actorSelect.innerHTML = "";
    actors.forEach((actor) => {
      const opt = document.createElement("option");
      opt.value = actor.id;
      opt.textContent =
        actor.full_name || actor.name || actor.fullName || `Actor #${actor.id}`;
      actorSelect.appendChild(opt);
    });

    populateActorDropdown(actors);
  } catch (err) {
    console.error("Actors error:", err);
  }
}

async function getMovies() {
  try {
    const res = await fetch(`${API_BASE}/admin/movies`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error(`${res.status}`);
    const data = await res.json();
    const movies = Array.isArray(data) ? data : data.movies || data.data || [];
    renderTable(movies);
  } catch (err) {
    showNotification("Filmlər yüklənmədi: " + err.message, "error");
  }
}

async function getMovieById(id) {
  try {
    const res = await fetch(`${API_BASE}/admin/movies/${id}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error(`${res.status}`);
    const data = await res.json();
    openModal(data.movie || data.data || data);
  } catch (err) {
    showNotification("Film tapılmadı: " + err.message, "error");
  }
}

// =============================================
// TABLE RENDER
// =============================================
function renderTable(movies) {
  tableBody.innerHTML = "";

  if (!movies.length) {
    tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;padding:20px;opacity:.5;">No movies found</td></tr>`;
    return;
  }

  movies.forEach((raw, index) => {
    const movie = normalizeMovie(raw);
    const catName =
      categorySelect.querySelector(`option[value="${movie.category}"]`)
        ?.textContent || "—";

    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td class="movie-title" style="overflow:visible; position:relative;">
        <img
          src="${movie.cover || "../../assets/Admin/images/movies.svg"}"
          alt=""
          onerror="this.src='../../assets/Admin/images/movies.svg'"
        />
        <span
          class="cell-clamp"
          data-tooltip="${(movie.title || "").replace(/"/g, "&quot;")}"
        >${movie.title || "—"}</span>
      </td>
      <td style="overflow:visible; position:relative;">
        <span
          class="cell-clamp"
          data-tooltip="${(movie.overview || "").replace(/"/g, "&quot;")}"
        >${movie.overview || "—"}</span>
      </td>
      <td style="overflow:visible; position:relative;">
        <span
          class="cell-clamp"
          data-tooltip="${catName}"
        >${catName}</span>
      </td>
      <td>${movie.imdb || "—"}</td>
      <td><i class="fa-solid fa-pen edit" data-id="${movie.id}"></i></td>
      <td><i class="fa-solid fa-trash delete" data-id="${movie.id}"></i></td>
    `;
    tableBody.appendChild(tr);
  });

  tableBody
    .querySelectorAll(".edit")
    .forEach((btn) =>
      btn.addEventListener("click", () => getMovieById(btn.dataset.id)),
    );
  tableBody
    .querySelectorAll(".delete")
    .forEach((btn) =>
      btn.addEventListener("click", () => confirmDelete(btn.dataset.id)),
    );

  pagination.init([...tableBody.querySelectorAll("tr")]);
}

// =============================================
// MODAL
// =============================================
function openModal(movie = null) {
  if (!movie) {
    clearInputs();
  } else {
    const m = normalizeMovie(movie);
    editingId = movie.id;

    titleInput.value = m.title;
    overviewInput.value = m.overview;
    coverInput.value = m.cover;
    trailerInput.value = m.trailer;
    watchInput.value = m.watch;
    imdbInput.value = m.imdb;
    runtimeInput.value = m.runtime;
    adultCheck.checked = m.isAdult;
    previewImg.src = m.cover || "../../assets/Admin/images/movies.svg";
    submitBtn.textContent = "Update";

    setSelectedCategory(m.category);
    const actorIds = m.actors.map((a) => Number(a.id ?? a));
    setSelectedActors(actorIds);
  }

  modal.classList.add("active");
}

function closeModal() {
  modal.classList.remove("active");
  actorDropdownWrapper.classList.remove("open");
  categoryDropdownWrapper.classList.remove("open");
}

// =============================================
// DELETE
// =============================================
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
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error(`${res.status}`);
    showNotification("Film silindi!");
    getMovies();
  } catch (err) {
    showNotification("Silinmə uğursuz: " + err.message, "error");
  }
}

// =============================================
// EVENT LISTENERS
// =============================================
document.getElementById("coverInput").addEventListener("input", function () {
  const url = this.value.trim();
  const img = document.getElementById("coverPreviewImg");
  const placeholder = document.getElementById("coverPlaceholder");

  if (url) {
    img.src = url;
    img.style.display = "block";
    placeholder.style.display = "none";
  } else {
    img.style.display = "none";
    placeholder.style.display = "flex";
  }
});

createBtn.addEventListener("click", () => openModal());
closeModalBtn.addEventListener("click", closeModal);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

submitBtn.addEventListener("click", async () => {
  const title = titleInput.value.trim();
  const actors = [...selectedActorIds];

  if (!title) {
    showNotification("Title boş ola bilməz", "error");
    return;
  }
  if (!actors.length) {
    showNotification("Ən azı 1 actor seçin", "error");
    return;
  }

  const body = {
    title,
    overview: overviewInput.value.trim(),
    cover_url: coverInput.value.trim(),
    fragman: trailerInput.value.trim(),
    watch_url: watchInput.value.trim(),
    imdb: imdbInput.value.trim(),
    run_time_min: Number(runtimeInput.value) || 0,
    category: selectedCategoryId ? Number(selectedCategoryId) : null,
    adult: adultCheck.checked,
    actors,
  };

  const isEditing = Boolean(editingId);
  const url = isEditing
    ? `${API_BASE}/admin/movie/${editingId}`
    : `${API_BASE}/admin/movie`;
  const method = isEditing ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `${res.status}`);
    }

    showNotification(isEditing ? "Film yeniləndi!" : "Film əlavə edildi!");
    clearInputs();
    closeModal();
    getMovies();
  } catch (err) {
    showNotification("Xəta: " + err.message, "error");
  }
});
// =============================================
// JS TOOLTIP
// =============================================
const jsTooltip = document.createElement("div");
jsTooltip.className = "js-tooltip";
document.body.appendChild(jsTooltip);

document.addEventListener("mouseover", (e) => {
  const el = e.target.closest(".cell-clamp");
  if (!el) return;
  const text = el.dataset.tooltip;
  if (!text || !text.trim()) return;
  jsTooltip.textContent = text;
  jsTooltip.style.display = "block";
});

document.addEventListener("mousemove", (e) => {
  if (jsTooltip.style.display === "none") return;
  const x = e.clientX;
  const y = e.clientY;
  const tw = jsTooltip.offsetWidth;
  const th = jsTooltip.offsetHeight;
  const left = Math.min(x - tw / 2, window.innerWidth - tw - 8);
  const top = y - th - 12 < 0 ? y + 16 : y - th - 12;
  jsTooltip.style.left = Math.max(8, left) + "px";
  jsTooltip.style.top = top + "px";
});

document.addEventListener("mouseout", (e) => {
  const el = e.target.closest(".cell-clamp");
  if (!el) return;
  jsTooltip.style.display = "none";
});
