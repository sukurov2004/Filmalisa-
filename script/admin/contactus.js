
document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // AUTH CHECK
  // =========================
  const adminToken = localStorage.getItem("adminToken");
  if (!adminToken) {
    window.location.href = "https://sukurov2004.github.io/Filmalisa-/index.html";
    return;
  }

  // =========================
  // API CONFIG
  // =========================
  const API_BASE = "https://api.sarkhanrahimli.dev/api/filmalisa/admin";
  const ENDPOINTS = {
    list: "/contacts",
    delete: (id) => `/contact/${encodeURIComponent(String(id))}`, 
  };

  const AUTH_HEADERS = {
    Authorization: `Bearer ${adminToken}`,
    "Content-Type": "application/json",
  };

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
    if (/^https?:\/\//i.test(pathOrFullUrl)) return pathOrFullUrl;
    return (
      API_BASE.replace(/\/$/, "") +
      "/" +
      String(pathOrFullUrl).replace(/^\//, "")
    );
  }

  function escapeHtml(str) {
    return String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function extractArray(result) {
    if (Array.isArray(result)) return result;
    if (Array.isArray(result?.data)) return result.data;
    if (Array.isArray(result?.contacts)) return result.contacts;
    if (Array.isArray(result?.data?.contacts)) return result.data.contacts;
    return [];
  }

  function getItemId(item) {
    return item?.id ?? item?._id ?? item?.contactId ?? item?.contact_id ?? "";
  }

  // =========================
  // API
  // =========================
  async function apiGet(url) {
    const res = await fetch(url, {
      method: "GET",
      headers: { ...AUTH_HEADERS },
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
      headers: { ...AUTH_HEADERS },
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`DELETE failed: ${res.status} ${res.statusText} ${text}`);
    }

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
        const id = getItemId(item);

        const username =
          item?.username ?? item?.name ?? item?.fullname ?? item?.fullName ?? "";

        const email = item?.email ?? "";
        const question = item?.question ?? item?.message ?? item?.text ?? "";

        
        const safeId = encodeURIComponent(String(id));

        return `
          <tr data-id="${safeId}">
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
    const totalPages = Math.max(1, Math.ceil(rows.length / ROWS_PER_PAGE));

    currentPage = Math.min(Math.max(1, page), totalPages);

    const start = (currentPage - 1) * ROWS_PER_PAGE;
    const end = start + ROWS_PER_PAGE;

    rows.forEach((row, idx) => {
      row.style.display = idx >= start && idx < end ? "" : "none";
    });

    renderControls(currentPage, totalPages);
  }

  function refreshPagination(resetToFirst = false) {
    const rows = getRows();
    const totalPages = Math.max(1, Math.ceil(rows.length / ROWS_PER_PAGE));

    if (resetToFirst) currentPage = 1;
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

      data = extractArray(result);

      renderRows();
      refreshPagination(true); 
    } catch (err) {
      console.error(err);
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="padding:16px; color:#ffb4b4;">
            Failed to load messages. (Console-a bax: CORS / URL / Token / Response)
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

    
      data = data.filter((x) => String(getItemId(x)) !== String(id));

      renderRows();
      closeModal();
      refreshPagination();
    } catch (err) {
      console.error(err);
      alert("Delete failed. Console-a bax (401 / 403 / 404 / CORS ola bilər).");
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
    const safeId = row?.dataset?.id;
    if (!safeId) return;

    const id = decodeURIComponent(safeId); 
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