document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
         window.location.href = "https://sukurov2004.github.io/Filmalisa-/index.html";
  }
});


// contactus.js (ALL-IN-ONE: GET + DELETE + Modal + Pagination)

const API_BASE = "http://localhost:3000"; // <-- dəyiş: sənin backend base URL
const ENDPOINTS = {
  list: "/contactus",         // GET  -> bütün mesajlar
  delete: (id) => `/contactus/${id}`, // DELETE -> bir mesaj
};

// Əgər auth lazımdırsa token əlavə et:
// const TOKEN = localStorage.getItem("token");
// const AUTH_HEADERS = TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {};
const AUTH_HEADERS = {}; // auth yoxdursa belə qalsın

const ROWS_PER_PAGE = 5;

document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // ELEMENTS
  // =========================
  const table = document.querySelector(".movies-table");
  const tbody = table?.querySelector("tbody");
  const paginationWrap = document.querySelector(".pagination");

  const modalOverlay = document.getElementById("deleteModal");
  const cancelBtn = modalOverlay?.querySelector(".cancel-btn");
  const deleteBtn = modalOverlay?.querySelector(".delete-btn");

  if (!table || !tbody || !paginationWrap || !modalOverlay) return;

  // =========================
  // STATE
  // =========================
  let data = [];             // API-dən gələn massiv
  let currentPage = 1;       // pagination page
  let selectedId = null;     // delete ediləcək mesaj id
  let isDeleting = false;

  // =========================
  // API HELPERS
  // =========================
  async function apiGet(url) {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...AUTH_HEADERS,
      },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`GET failed: ${res.status} ${res.statusText} ${text}`);
    }

    return res.json();
  }

  async function apiDelete(url) {
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        ...AUTH_HEADERS,
      },
    });

    // Bəzi backendlər DELETE-də 204 No Content qaytarır
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`DELETE failed: ${res.status} ${res.statusText} ${text}`);
    }

    // 204 olduqda json parse etmə
    if (res.status === 204) return null;
    return res.json().catch(() => null);
  }

  // =========================
  // RENDER
  // =========================
  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function renderRows() {
    // data -> tbody
    tbody.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="padding:16px; opacity:.7;">No messages found.</td>
        </tr>
      `;
      return;
    }

    const rowsHtml = data
      .map((item) => {
        // Serverdən gələn field-ları özünə uyğunlaşdır:
        // Məs: item.id / item.username / item.email / item.question
        const id = item.id ?? item._id ?? "";
        const username = item.username ?? item.name ?? "";
        const email = item.email ?? "";
        const question = item.question ?? item.message ?? "";

        return `
          <tr data-id="${escapeHtml(id)}">
            <td>${escapeHtml(id)}</td>
            <td>${escapeHtml(username)}</td>
            <td>${escapeHtml(email)}</td>
            <td>${escapeHtml(question)}</td>
            <td><i class="fa-solid fa-trash delete" title="Delete"></i></td>
          </tr>
        `;
      })
      .join("");

    tbody.innerHTML = rowsHtml;
  }

  // =========================
  // PAGINATION
  // =========================
  function getRows() {
    return Array.from(tbody.querySelectorAll("tr"));
  }

  function renderControls(page, totalPages) {
    paginationWrap.innerHTML = "";

    const makeBtn = (text, disabled, onClick, isActive = false) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "page-btn";
      btn.textContent = text;
      if (disabled) btn.disabled = true;
      if (isActive) btn.classList.add("active");
      btn.addEventListener("click", onClick);
      return btn;
    };

    paginationWrap.appendChild(
      makeBtn("‹", page === 1, () => showPage(page - 1))
    );

    for (let i = 1; i <= totalPages; i++) {
      paginationWrap.appendChild(
        makeBtn(String(i), false, () => showPage(i), i === page)
      );
    }

    paginationWrap.appendChild(
      makeBtn("›", page === totalPages, () => showPage(page + 1))
    );
  }

  function showPage(page) {
    const rows = getRows();
    const totalRows = rows.length;
    const totalPages = Math.max(1, Math.ceil(totalRows / ROWS_PER_PAGE));

    currentPage = Math.min(Math.max(1, page), totalPages);

    const start = (currentPage - 1) * ROWS_PER_PAGE;
    const end = start + ROWS_PER_PAGE;

    rows.forEach((row, idx) => {
      row.style.display = idx >= start && idx < end ? "" : "none";
    });

    renderControls(currentPage, totalPages);
  }

  function refreshPagination() {
    const rows = getRows();
    const totalPages = Math.max(1, Math.ceil(rows.length / ROWS_PER_PAGE));
    if (currentPage > totalPages) currentPage = totalPages;
    showPage(currentPage);
  }

  // =========================
  // MODAL
  // =========================
  function openModal(id) {
    selectedId = id;
    modalOverlay.classList.add("show");
    document.body.classList.add("modal-open");
  }

  function closeModal() {
    modalOverlay.classList.remove("show");
    document.body.classList.remove("modal-open");
    selectedId = null;
  }

  // =========================
  // LOAD DATA (GET)
  // =========================
  async function loadMessages() {
    try {
      // istəyirsənsə yüklənmə zamanı placeholder göstərə bilərik:
      tbody.innerHTML = `
        <tr><td colspan="5" style="padding:16px; opacity:.7;">Loading...</td></tr>
      `;

      const url = API_BASE + ENDPOINTS.list;
      const result = await apiGet(url);

      // backend iki cür qaytara bilər:
      // 1) düz massiv: [ {...}, {...} ]
      // 2) object içində: { data: [...] }
      data = Array.isArray(result) ? result : (result?.data ?? []);

      renderRows();
      refreshPagination();
      showPage(1);
    } catch (err) {
      console.error(err);
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="padding:16px; color:#ffb4b4;">
            Failed to load messages.
          </td>
        </tr>
      `;
    }
  }

  // =========================
  // DELETE (API)
  // =========================
  async function deleteMessage(id) {
    if (!id || isDeleting) return;

    isDeleting = true;
    deleteBtn.disabled = true;
    deleteBtn.textContent = "Deleting...";

    try {
      const url = API_BASE + ENDPOINTS.delete(id);
      await apiDelete(url);

      // UI-dan sil (data state-dən)
      data = data.filter((x) => String(x.id ?? x._id) !== String(id));

      renderRows();
      closeModal();
      refreshPagination();
    } catch (err) {
      console.error(err);
      alert("Delete failed. Check console / API.");
    } finally {
      isDeleting = false;
      deleteBtn.disabled = false;
      deleteBtn.textContent = "Delete";
    }
  }

  // =========================
  // EVENTS
  // =========================
  document.addEventListener("click", (e) => {
    const trash = e.target.closest(".delete");
    if (!trash) return;

    const row = trash.closest("tr");
    const id = row?.dataset?.id;
    if (!id) return;

    openModal(id);
  });

  cancelBtn.addEventListener("click", closeModal);

  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains("show")) {
      closeModal();
    }
  });

  deleteBtn.addEventListener("click", () => {
    if (!selectedId) return;
    deleteMessage(selectedId);
  });

  // =========================
  // INIT
  // =========================
  loadMessages();
});