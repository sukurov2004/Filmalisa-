<<<<<<< HEAD
const createBtn = document.getElementById("createBtn");
const modal = document.getElementById("actorModal");
const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");

const tbody = document.getElementById("actorsTbody");
const nameInput = document.getElementById("nameInput");
const surnameInput = document.getElementById("surnameInput");
const imgInput = document.getElementById("imgInput");

function openModal() {
  modal.classList.add("open");
  document.body.style.overflow = "hidden";
}
function closeModal() {
  modal.classList.remove("open");
  document.body.style.overflow = "";
}

createBtn.addEventListener("click", openModal);
cancelBtn.addEventListener("click", closeModal);

// overlay click
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeModal();
});

// esc close
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("open")) closeModal();
});

// Add new actor
saveBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const surname = surnameInput.value.trim();
  const img = imgInput.value.trim();

  if (!name || !surname) {
    alert('Name və Surname boş ola bilməz.');
    return;
  }

  const id = tbody.querySelectorAll("tr").length + 1;

  const tr = document.createElement("tr");
  tr.innerHTML = `
    <td>${id}</td>
    <td>${escapeHtml(name)}</td>
    <td>${escapeHtml(surname)}</td>
    <td class="col-img">
      <img class="actor-img" src="${img || "../../assets/Admin/images/movies.svg"}" alt="actor"/>
    </td>
    <td class="col-action">
      <button class="action-pill edit-pill" type="button" aria-label="Edit">
        <i class="fa-solid fa-pen"></i>
      </button>
    </td>
    <td class="col-action">
      <button class="action-pill del-pill" type="button" aria-label="Remove">
        <i class="fa-solid fa-trash"></i>
      </button>
    </td>
  `;

  tbody.appendChild(tr);

  nameInput.value = "";
  surnameInput.value = "";
  imgInput.value = "";

  closeModal();
});

// Edit / Remove (event delegation)
tbody.addEventListener("click", (e) => {
  const row = e.target.closest("tr");
  if (!row) return;

  

  // EDIT
  if (e.target.closest(".edit-pill")) {
    const nameCell = row.children[1];
    const surnameCell = row.children[2];
    const imgEl = row.querySelector(".actor-img");


    nameCell.textContent = newName.trim() || nameCell.textContent;
    surnameCell.textContent = newSurname.trim() || surnameCell.textContent;
    imgEl.src = newImg.trim() || imgEl.src;
  }
});

function reIndexIds() {
  [...tbody.querySelectorAll("tr")].forEach((tr, i) => {
    tr.children[0].textContent = i + 1;
  });
}

// XSS üçün sadə escape
function escapeHtml(str) {
  return str
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
=======
const API_BASE = "https://api.sarkhanrahimli.dev/api/filmalisa";

let modal, tableBody, submitBtn, createBtn, closeModalBtn;
let nameInput, surnameInput, imgInput;
let editingId = null;
let pagination = null;
const token = localStorage.getItem("adminToken");

// =============================================
// DOMContentLoaded
// =============================================
document.addEventListener("DOMContentLoaded", async () => {
  if (!token) {
    window.location.href = "https://sukurov2004.github.io/Filmalisa-/pages/admin/login.html";
    return;
  }

  modal = document.getElementById("actorModal");
  tableBody = document.querySelector(".movies-table tbody");
  submitBtn = document.getElementById("saveBtn");
  createBtn = document.getElementById("createBtn");
  closeModalBtn = document.getElementById("cancelBtn");
  nameInput = document.getElementById("nameInput");
  surnameInput = document.getElementById("surnameInput");
  imgInput = document.getElementById("imgInput");

  pagination = initPagination(
    tableBody,
    document.querySelector(".pagination"),
    5,
  );

  createBtn.addEventListener("click", () => openModal());
  closeModalBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) closeModal();
  });
  submitBtn.addEventListener("click", handleSubmit);

  await getActors();
});

// =============================================
// NOTIFICATION
// =============================================
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

// =============================================
// NORMALIZE
// =============================================
function normalizeActor(actor) {
  return {
    id: actor.id,
    name: actor.name || "",
    surname: actor.surname || "",
    img: actor.img_url || actor.image || actor.img || "",
  };
}

// =============================================
// AVATAR HTML
// =============================================
function avatarHtml(img, name) {
  if (img) {
    return `
      <img src="${img}" alt="${name}"
        onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"
        style="width:40px;height:40px;object-fit:cover;border-radius:50%;" />
      <div style="display:none;width:40px;height:40px;border-radius:50%;background:#2a2a3a;align-items:center;justify-content:center;">
        <i class="fa-solid fa-user" style="color:#888;font-size:18px;"></i>
      </div>`;
  }
  return `
    <div style="display:flex;width:40px;height:40px;border-radius:50%;background:#2a2a3a;align-items:center;justify-content:center;">
      <i class="fa-solid fa-user" style="color:#888;font-size:18px;"></i>
    </div>`;
}

// =============================================
// CLEAR INPUTS
// =============================================
function clearInputs() {
  nameInput.value = "";
  surnameInput.value = "";
  imgInput.value = "";
  submitBtn.textContent = "Save";
  editingId = null;
}

// =============================================
// API CALLS
// =============================================
async function getActors() {
  try {
    const res = await fetch(`${API_BASE}/admin/actors`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error(`${res.status}`);
    const data = await res.json();
    const actors = Array.isArray(data) ? data : data.actors || data.data || [];
    renderTable(actors.reverse());
  } catch (err) {
    showNotification("Aktorlar yüklənmədi: " + err.message, "error");
  }
}

// =============================================
// TABLE RENDER
// =============================================
function renderTable(actors) {
  tableBody.innerHTML = "";

  if (!actors.length) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:20px;opacity:.5;">No actors found</td></tr>`;
    pagination.init([]);
    return;
  }

  actors.forEach((raw, index) => {
    const actor = normalizeActor(raw);
    const tr = document.createElement("tr");
    tr.dataset.id = actor.id;
    tr.innerHTML = `
      <td>${index + 1}</td>
      <td>${actor.name}</td>
      <td>${actor.surname}</td>
      <td>${avatarHtml(actor.img, actor.name)}</td>
      <td><i class="fa-solid fa-pen edit" data-id="${actor.id}" data-img="${actor.img}"></i></td>
      <td><i class="fa-solid fa-trash delete" data-id="${actor.id}"></i></td>
    `;
    tableBody.appendChild(tr);
  });

  tableBody.querySelectorAll(".edit").forEach((btn) =>
    btn.addEventListener("click", () => {
      const row = btn.closest("tr");
      openModal({
        id: btn.dataset.id,
        name: row.querySelector("td:nth-child(2)").textContent,
        surname: row.querySelector("td:nth-child(3)").textContent,
        img_url: btn.dataset.img || "",
      });
    })
  );

  tableBody.querySelectorAll(".delete").forEach((btn) =>
    btn.addEventListener("click", () => confirmDelete(btn.dataset.id))
  );

  pagination.init([...tableBody.querySelectorAll("tr")]);
}

// =============================================
// MODAL
// =============================================
function openModal(actor = null) {
  if (!actor) {
    clearInputs();
  } else {
    const a = normalizeActor(actor);
    editingId = a.id;
    nameInput.value = a.name;
    surnameInput.value = a.surname;
    imgInput.value = a.img;
    submitBtn.textContent = "Update";
  }
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("active");
  document.body.style.overflow = "";
  clearInputs();
}

// =============================================
// DELETE
// =============================================
function confirmDelete(id) {
  if (typeof openDeleteModal === "function") {
    openDeleteModal(() => deleteActor(id));
  } else {
    if (confirm("Bu aktoru silmək istəyirsiniz?")) deleteActor(id);
  }
}

async function deleteActor(id) {
  try {
    const res = await fetch(`${API_BASE}/admin/actor/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) throw new Error(`${res.status}`);
    showNotification("Aktor silindi!");
    await getActors();
  } catch (err) {
    showNotification("Silinmə uğursuz: " + err.message, "error");
  }
}

// =============================================
// SUBMIT (CREATE / UPDATE)
// =============================================
async function handleSubmit() {
  const name = nameInput.value.trim();
  const surname = surnameInput.value.trim();
  const img_url = imgInput.value.trim();

  if (!name || !surname) {
    showNotification("Name və Surname boş ola bilməz", "error");
    return;
  }

  const isEditing = Boolean(editingId);
  const url = isEditing
    ? `${API_BASE}/admin/actor/${editingId}`
    : `${API_BASE}/admin/actor`;
  const method = isEditing ? "PUT" : "POST";

  try {
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name, surname, img_url }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.message || `${res.status}`);
    }

    showNotification(isEditing ? "Aktor yeniləndi!" : "Aktor əlavə edildi!");
    closeModal();
    await getActors();
  } catch (err) {
    showNotification("Xəta: " + err.message, "error");
  }
}
>>>>>>> 9cc8465f984497fd7f712892d2d3ea1d8c2c3b8f
