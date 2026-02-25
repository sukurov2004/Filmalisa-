document.addEventListener("DOMContentLoaded", () => {
  const adminToken = localStorage.getItem("adminToken");
  if (!adminToken) {
   window.location.href = "https://sukurov2004.github.io/Filmalisa-/index.html";
    return;
  }

  const API_BASE = "https://api.sarkhanrahimli.dev/api/filmalisa/admin";
  const ENDPOINTS = {
    list: "/contacts",
    delete: (id) => `/contact/${encodeURIComponent(String(id))}`,
  };

  const HEADERS = {
    Authorization: `Bearer ${adminToken}`,
    "Content-Type": "application/json",
  };

  const ROWS_PER_PAGE = 5;

  const tbody = document.querySelector(".movies-table tbody");
  const pagination = document.querySelector(".pagination");
  const modal = document.getElementById("deleteModal");
  const cancelBtn = modal?.querySelector(".cancel-btn");
  const deleteBtn = modal?.querySelector(".delete-btn");

  let data = [];
  let currentPage = 1;
  let selectedId = null;

  const buildUrl = (path) =>
    API_BASE.replace(/\/$/, "") + "/" + String(path).replace(/^\//, "");

  const escapeHtml = (str) =>
    String(str ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");

  const extractArray = (res) => {
    if (Array.isArray(res)) return res;
    if (Array.isArray(res?.data)) return res.data;
    if (Array.isArray(res?.data?.data)) return res.data.data;
    return [];
  };

  async function apiGet(url) {
    const res = await fetch(url, { headers: HEADERS });
    if (!res.ok) throw new Error(res.status);
    return res.json();
  }

  async function apiDelete(url) {
    const res = await fetch(url, { method: "DELETE", headers: HEADERS });
    if (!res.ok) throw new Error(res.status);
  }

  function renderRows() {
    tbody.innerHTML = "";

    const start = (currentPage - 1) * ROWS_PER_PAGE;
    const pageData = data.slice(start, start + ROWS_PER_PAGE);

    if (pageData.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5">No messages found</td></tr>`;
      return;
    }

    tbody.innerHTML = pageData
      .map(
        (item) => `
        <tr data-id="${escapeHtml(item.id)}">
          <td>${escapeHtml(item.id)}</td>
          <td>${escapeHtml(item.username || item.name || "-")}</td>
          <td>${escapeHtml(item.email || "-")}</td>
          <td>${escapeHtml(item.question || item.message || "-")}</td>
          <td><i class="fa-solid fa-trash delete" role="button" tabindex="0"></i></td>
        </tr>
      `
      )
      .join("");
  }

  function renderPagination() {
    pagination.innerHTML = "";
    const totalPages = Math.ceil(data.length / ROWS_PER_PAGE) || 1;

    for (let i = 1; i <= totalPages; i++) {
      const btn = document.createElement("button");
      btn.textContent = i;
      btn.className = i === currentPage ? "active" : "";
      btn.addEventListener("click", () => {
        currentPage = i;
        renderRows();
        renderPagination();
      });
      pagination.appendChild(btn);
    }
  }

  async function loadMessages() {
    try {
      const res = await apiGet(buildUrl(ENDPOINTS.list));
      data = extractArray(res);
      currentPage = 1;
      renderRows();
      renderPagination();
    } catch (e) {
      tbody.innerHTML = `<tr><td colspan="5">Failed to load data</td></tr>`;
    }
  }

  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("delete")) {
      selectedId = e.target.closest("tr")?.dataset?.id || null;
      if (selectedId) modal.classList.add("show");
    }
  });

  cancelBtn?.addEventListener("click", () => modal.classList.remove("show"));

  deleteBtn?.addEventListener("click", async () => {
    if (!selectedId) return;
    try {
      await apiDelete(buildUrl(ENDPOINTS.delete(selectedId)));
      data = data.filter((x) => String(x.id) !== String(selectedId));
      modal.classList.remove("show");

      const totalPages = Math.ceil(data.length / ROWS_PER_PAGE) || 1;
      if (currentPage > totalPages) currentPage = totalPages;

      renderRows();
      renderPagination();
    } catch (e) {
      modal.classList.remove("show");
      alert("Delete failed");
    }
  });

  loadMessages();
}); 