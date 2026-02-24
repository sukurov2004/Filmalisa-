// contactus.js (ALL-IN-ONE: Auth Check + GET + DELETE + Modal + Pagination)

document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // AUTH CHECK
  // =========================
  const adminToken = localStorage.getItem("adminToken");
  if (!adminToken) {
    window.location.href =
      "https://sukurov2004.github.io/Filmalisa-/index.html";
    return;
  }

  // =========================
  // API CONFIG (POSTMAN-DAN DƏQİQ YAZ)
  // =========================
  // Postman-da işləyən base URL-ni yaz:
  // Misal: https://api.sarkhanrahimli.dev
  const API_BASE = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/contacts"; // <-- BUNU DƏYİŞ

  // Postman-da Contact -> GET list və DEL remove yollarını yaz:
  // Misal:
  // list: "/admin/contact/list"
  // delete: (id) => `/admin/contact/remove/${id}`
  const ENDPOINTS = {
    list: "/contactus", // <-- BUNU POSTMAN-A UYĞUNLAŞDIR
    delete: (id) => `/contactus/${id}`, // <-- BUNU POSTMAN-A UYĞUNLAŞDIR
  };

  // =========================
  // HEADERS (TOKEN)
  // =========================
  // Əgər backend "Bearer" istəyirsə:
  const AUTH_HEADERS = adminToken
    ? { Authorization: `Bearer ${adminToken}` }
    : {};

  // Əgər Bearer işləməsə bunu yoxla:
  // const AUTH_HEADERS = adminToken ? { Authorization: adminToken } : {};

  // =========================
  // SETTINGS
  // =========================
  const ROWS_PER_PAGE = 5;

  // =========================
  // ELEMENTS
  // =========================
  const table = document.querySelector(".movies-table");
  const tbody = table?.querySelector("tbody");
  const paginationWrap = document.querySelector(".pagination");

  const modalOverlay = document.getElementById("deleteModal");
  const cancelBtn = modalOverlay?.querySelector(".cancel-btn");
  const deleteBtn = modalOverlay?.querySelector(".delete-btn");

  // Əgər HTML-də nəsə yoxdursa çıx:
  if (!table || !tbody || !paginationWrap || !modalOverlay || !cancelBtn || !deleteBtn) {
    console.warn("Contact page elements not found. Check HTML selectors/IDs.");
    return;
  }

  // =========================
  // STATE
  // =========================
  let data = [];
  let currentPage = 1;
  let selectedId = null;
  let isDeleting = false;

  // =========================
  // HELPERS
  // =========================
  function buildUrl(pathOrFullUrl) {
    // Əgər full URL göndərmisənsə elə onu qaytar:
    if (/^https?:\/\//i.test(pathOrFullUrl)) return pathOrFullUrl;
    return API_BASE.replace(/\/$/, "") + "/" + String(pathOrFullUrl).replace(/^\//, "");
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  // =========================
  // API
  // =========================
  async function apiGet(url) {
    const res = await fetch(url, {
      method: "GET",
      headers: {
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
        ...AUTH_HEADERS,
      },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`DELETE failed: ${res.status} ${res.statusText} ${text}`);
    }

    // 204 No Content ola bilər
    if (res.status === 204) return null;
    return res.json().catch(() => null);
  }

  // =========================
  // RENDER ROWS
  // =========================
  function renderRows() {
    tbody.innerHTML = "";

    if (!Array.isArray(data) || data.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="padding:16px; opacity:.7;">No messages found.</td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = data
      .map((item) => {
        // Backend field-larını uyğunlaşdır:
        const id = item.id ?? item._id ?? item.contactId ?? "";
        const username = item.username ?? item.name ?? item.fullname ?? "";
        const email = item.email ?? "";
        const question = item.question ?? item.message ?? item.text ?? "";

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

    paginationWrap.appendChild(makeBtn("‹", page === 1, () => showPage(page - 1)));

    for (let i = 1; i <= totalPages; i++) {
      paginationWrap.appendChild(makeBtn(String(i), false, () => showPage(i), i === page));
    }

    paginationWrap.appendChild(
      makeBtn("›", page === totalPages, () => showPage(page + 1))
    );
  }

  function showPage(page) {
    const rows = getRows();
    const totalPages = Math.max(1, Math.ceil(rows.length / ROWS_PER_PAGE));

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
  // LOAD (GET)
  // =========================
  async function loadMessages() {
    try {
      tbody.innerHTML = `
        <tr><td colspan="5" style="padding:16px; opacity:.7;">Loading...</td></tr>
      `;

      const url = buildUrl(ENDPOINTS.list);
      const result = await apiGet(url);

      // 2 variant ola bilər:
      // 1) [ {...}, {...} ]
      // 2) { data: [ ... ] }
      data = Array.isArray(result) ? result : (result?.data ?? []);

      renderRows();
      refreshPagination();
      showPage(1);
    } catch (err) {
      console.error(err);
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="padding:16px; color:#ffb4b4;">
            Failed to load messages. (Check console: CORS / URL / Token)
          </td>
        </tr>
      `;
    }
  }

  // =========================
  // DELETE
  // =========================
  async function deleteMessage(id) {
    if (!id || isDeleting) return;

    isDeleting = true;
    deleteBtn.disabled = true;
    deleteBtn.textContent = "Deleting...";

    try {
      const url = buildUrl(ENDPOINTS.delete(id));
      await apiDelete(url);

      // State-dən sil:
      data = data.filter((x) => String(x.id ?? x._id ?? x.contactId) !== String(id));

      renderRows();
      closeModal();
      refreshPagination();
    } catch (err) {
      console.error(err);
      alert("Delete failed. Console-a bax (401 / CORS / 404 ola bilər).");
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
    if (e.key === "Escape" && modalOverlay.classList.contains("show")) closeModal();
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