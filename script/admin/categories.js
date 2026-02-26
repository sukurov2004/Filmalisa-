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

  // ── Kateqoriyaları gətir ──
  async function fetchCategories() {
    try {
      const res = await fetch(`${BASE_URL}/admin/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      renderCategories(data.data);
    } catch (err) {
      console.error("Categories can't downloaded:", err);
    }
  }

  // ── Cədvəli doldur ──
  function renderCategories(categories) {
    tbody.innerHTML = "";

    categories.forEach((cat) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${cat.id}</td>
        <td>${cat.name}</td>
        <td><i class="fa-solid fa-pen edit" data-id="${cat.id}" data-name="${cat.name}"></i></td>
        <td><i class="fa-solid fa-trash delete" data-id="${cat.id}"></i></td>
      `;
      tbody.appendChild(tr);
    });

    // Trash — silmə modalı
    document.querySelectorAll(".delete").forEach((icon) => {
      icon.addEventListener("click", () => {
        deleteId = icon.dataset.id;
        deleteModal.classList.add("active");
      });
    });

    // Edit — create modalı edit rejimində aç
    document.querySelectorAll(".edit").forEach((icon) => {
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
    if (!name) return;

    try {
      if (editId) {
        // PUT — update
        await fetch(`${BASE_URL}/admin/category/${editId}`, {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        });
      } else {
        // POST — create
        await fetch(`${BASE_URL}/admin/category`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name }),
        });
      }

      categoryModal.classList.remove("active");
      editId = null;
      fetchCategories();
    } catch (err) {
      console.error("Əməliyyat uğursuz oldu:", err);
    }
  });

  // ── DELETE ──
  document.querySelector(".delete-btn").addEventListener("click", async () => {
    if (!deleteId) return;
    try {
      await fetch(`${BASE_URL}/admin/category/${deleteId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      deleteModal.classList.remove("active");
      deleteId = null;
      fetchCategories();
    } catch (err) {
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

  fetchCategories();
});
