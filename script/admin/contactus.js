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
  const token = localStorage.getItem("adminToken");

  if (!token) {
      window.location.href = "https://sukurov2004.github.io/Filmalisa-/pages/admin/login.html";
    return;
  }

  const BASE_URL = "https://api.sarkhanrahimli.dev/api/filmalisa";
  const tbody = document.querySelector(".movies-table tbody");
  const deleteModal = document.getElementById("deleteModal");

  let deleteId = null;
  let pagination = null;

  // ── Notification ──
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

  // ── Mesajları gətir ──
  async function fetchMessages() {
    try {
      const res = await fetch(`${BASE_URL}/admin/contacts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      renderMessages(data.data);
    } catch (err) {
      showNotification("Mesajlar yüklənmədi", "error");
      console.error("Messages can't be downloaded:", err);
    }
  }

  // ── Cədvəli doldur ──
  function renderMessages(messages) {
    tbody.innerHTML = "";
    messages.forEach((msg) => {
      appendMessageRow(msg);
    });
    bindTableEvents();
    refreshPagination();
  }

  // ── Sıranı cədvələ əlavə et ──
  function appendMessageRow(msg,index) {
    const tr = document.createElement("tr");
    tr.dataset.id = msg.id;
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${msg.full_name || msg.name}</td>
      <td>${msg.email}</td>
      <td>${msg.reason || msg.message}</td>
      <td><i class="fa-solid fa-trash delete" data-id="${msg.id}"></i></td>
    `;
    tbody.appendChild(tr);
  }

  // ── Pagination-ı yenilə ──
  function refreshPagination() {
    pagination.init([...tbody.querySelectorAll("tr")]);
  }

  // ── Event-ləri bind et ──
  function bindTableEvents() {
    tbody.querySelectorAll(".delete").forEach((icon) => {
      icon.addEventListener("click", () => {
        deleteId = icon.dataset.id;
        deleteModal.classList.add("active");
      });
    });
  }

  // ── DELETE ──
  document.querySelector(".delete-btn").addEventListener("click", async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`${BASE_URL}/admin/contact/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`${res.status}`);

      tbody.querySelector(`tr[data-id="${deleteId}"]`)?.remove();
      refreshPagination();

      showNotification("Mesaj silindi!");
      deleteModal.classList.remove("active");
      deleteId = null;
    } catch (err) {
      showNotification("Silmə uğursuz oldu: " + err.message, "error");
      console.error("Silmə uğursuz oldu:", err);
    }
  });

  document.querySelector(".cancel-btn").addEventListener("click", () => {
    deleteModal.classList.remove("active");
    deleteId = null;
  });

  pagination = initPagination(
    tbody,
    document.querySelector(".pagination"),
    5
  );

  fetchMessages();
});

