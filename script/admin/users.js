document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    window.location.href = "http://127.0.0.1:5500/pages/admin/login.html";
    return;
  }

  const tableBody = document.querySelector(".users-specific-table tbody");
  const paginationEl = document.querySelector(".pagination");

  // pagination.js-dən gələn funksiya
  const pager = initPagination(tableBody, paginationEl, 4);

  fetch("https://api.sarkhanrahimli.dev/api/filmalisa/admin/users", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Unauthorized or server error");
      return res.json();
    })
    .then((data) => {
      tableBody.innerHTML = "";

      data.data.forEach((user, index) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${index + 1}</td>
          <td>
            <div class="user-avatar">
              <i class="fa-solid fa-user"></i>
            </div>
          </td>
          <td>${user.full_name}</td>
          <td>${user.email}</td>
        `;
        tableBody.appendChild(tr);
      });

      const rows = Array.from(tableBody.querySelectorAll("tr"));
      pager.init(rows); // ← pagination işə düşür
    })
    .catch((err) => console.error("Error fetching users:", err));
});