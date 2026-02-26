document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    window.location.href = "http://127.0.0.1:5500/index.html";
    return;
  }

  const BASE_URL = "https://api.sarkhanrahimli.dev/api/filmalisa";
  const tbody = document.querySelector(".movies-table tbody");

  // Modal elementləri
  const createBtn = document.getElementById("createBtn");
  const categoryModal = document.getElementById("categoryModal");
  const cancelCategory = document.getElementById("cancelCategory");
  const categoryInput = document.getElementById("categoryInput");
  const submitCategory = document.getElementById("submitCategory");
  const deleteModal = document.getElementById("deleteModal");

  let deleteId = null;
  let editId = null;
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

  // ── Kateqoriyaları gətir ──
  async function fetchCategories() {
    try {
      const res = await fetch(`${BASE_URL}/admin/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      renderCategories(data.data);
    } catch (err) {
      showNotification("Kateqoriyalar yüklənmədi", "error");
      console.error("Categories can't downloaded:", err);
    }
  }

  // ── Cədvəli doldur ──
  function renderCategories(categories) {
    tbody.innerHTML = "";

    // Əvvəlcə hamısını normal sıra ilə əlavə et, sonra pagination init et
    categories.forEach((cat,index) => {
      appendCategoryRow(cat,index);
    });

    bindTableEvents();
    refreshPagination();
  }

  // ── Sıranı cədvələ əlavə et (normal) ──
  function appendCategoryRow(cat,index) {
    const tr = document.createElement("tr");
    tr.dataset.id = cat.id;
    tr.innerHTML = `
      <td>${index +1}</td>
      <td>${cat.name}</td>
      <td><i class="fa-solid fa-pen edit" data-id="${cat.id}" data-name="${cat.name}"></i></td>
      <td><i class="fa-solid fa-trash delete" data-id="${cat.id}"></i></td>
    `;
    tbody.appendChild(tr);
  }

  // ── Yeni sıranı cədvəlin ƏN BAŞINA əlavə et ──
  function prependCategoryRow(cat) {
    const tr = document.createElement("tr");
    tr.dataset.id = cat.id;
    tr.innerHTML = `
      <td>${cat.id}</td>
      <td>${cat.name}</td>
      <td><i class="fa-solid fa-pen edit" data-id="${cat.id}" data-name="${cat.name}"></i></td>
      <td><i class="fa-solid fa-trash delete" data-id="${cat.id}"></i></td>
    `;
    tbody.prepend(tr);
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

    tbody.querySelectorAll(".edit").forEach((icon) => {
      icon.addEventListener("click", () => {
        editId = icon.dataset.id;
        categoryInput.value = icon.dataset.name;
        submitCategory.textContent = "Update";
        categoryModal.classList.add("active");
      });
    });
  }

  // ── CREATE / UPDATE ──
  createBtn.addEventListener("click", () => {
    editId = null;
    categoryInput.value = "";
    submitCategory.textContent = "Submit";
    categoryModal.classList.add("active");
  });

  submitCategory.addEventListener("click", async () => {
    const name = categoryInput.value.trim();
    if (!name) {
      showNotification("Kateqoriya adı boş ola bilməz", "error");
      return;
    }

    try {
      if (editId) {
        // PUT — update
        const res = await fetch(`${BASE_URL}/admin/category/${editId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        });
        if (!res.ok) throw new Error(`${res.status}`);

        // Cədvəldəki mövcud sıranı yenilə
        const row = tbody.querySelector(`tr[data-id="${editId}"]`);
        if (row) {
          row.querySelector("td:nth-child(2)").textContent = name;
          row.querySelector(".edit").dataset.name = name;
        }

        showNotification("Kateqoriya yeniləndi!");
      } else {
        // POST — create
        const res = await fetch(`${BASE_URL}/admin/category`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        });
        if (!res.ok) throw new Error(`${res.status}`);

        const data = await res.json();
        const newCat = data.category || data.data || data;

        // Yeni kateqoriyanı cədvəlin ƏN BAŞINA əlavə et
        prependCategoryRow(newCat);
        bindTableEvents();
        refreshPagination();

        showNotification("Kateqoriya əlavə edildi!");
      }

      categoryModal.classList.remove("active");
      editId = null;
    } catch (err) {
      showNotification("Əməliyyat uğursuz oldu: " + err.message, "error");
      console.error("Əməliyyat uğursuz oldu:", err);
    }
  });

  // ── DELETE ──
  document.querySelector(".delete-btn").addEventListener("click", async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`${BASE_URL}/admin/category/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`${res.status}`);

      // Cədvəldən həmin sıranı sil
      tbody.querySelector(`tr[data-id="${deleteId}"]`)?.remove();
      refreshPagination();

      showNotification("Kateqoriya silindi!");
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

  // Modal overlay klik
  cancelCategory.addEventListener("click", () => {
    categoryModal.classList.remove("active");
  });

  categoryModal.addEventListener("click", () => {
    categoryModal.classList.remove("active");
  });

  categoryModal
    .querySelector(".category-modal")
    .addEventListener("click", (e) => {
      e.stopPropagation();
    });

  pagination = initPagination(
    tbody,
    document.querySelector(".pagination"),
    5,
  );

  fetchCategories();
});