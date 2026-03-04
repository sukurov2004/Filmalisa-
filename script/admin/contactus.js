document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
        window.location.replace(
      "https://sukurov2004.github.io/Filmalisa-/pages/admin/login.html"
    );
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
    messages.forEach((msg,index) => {
      appendMessageRow(msg,index);
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
      <td style="text-align:center">
      <span class="contact-clamp" data-tooltip="${(msg.reason || msg.message || "").replace(/"/g, "&quot;")}">${msg.reason || msg.message}</span>
      </td>
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

// ── Tooltip ──
const jsTooltip = document.createElement("div");
jsTooltip.className = "js-tooltip";
document.body.appendChild(jsTooltip);

document.addEventListener("mouseover", (e) => {
  const el = e.target.closest(".contact-clamp");
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
  let left = x - tw / 2;
  let top = y - th - 12;

if (left + tw > window.innerWidth - 8) {
  left = window.innerWidth - tw - 8;
}

if (left < 8) {
  left = 8;
}

if (top < 8) {
  top = y + 16;
}

if (top + th > window.innerHeight - 8) {
  top = window.innerHeight - th - 8;
}

jsTooltip.style.left = left + "px";
jsTooltip.style.top = top + "px";
});

document.addEventListener("mouseout", (e) => {
  const el = e.target.closest(".contact-clamp");
  if (!el) return;
  jsTooltip.style.display = "none";
});