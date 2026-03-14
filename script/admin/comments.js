document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    window.location.replace(
      "https://sukurov2004.github.io/Filmalisa-/pages/admin/login.html",
    );
    return;
  }

  const commentsBody = document.querySelector("#comments-body");
  const deleteModal = document.querySelector("#deleteModal");
  const cancelBtn = document.querySelector(".cancel-btn");
  const confirmDeleteBtn = document.querySelector(".delete-btn");
  const paginationEl = document.querySelector(".pagination");

  let commentIdToDelete = null;
  let movieIdToDelete = null;

  // ── Pagination funksiyası ──
  function initPagination(tableBodyEl, paginationEl, rowsPerPage = 5) {
    let currentPage = 1;
    let rows = [];

    function init(newRows) {
      rows = newRows;
      currentPage = 1;
      renderPagination();
      displayRows(currentPage);
    }

    function displayRows(page) {
      const start = (page - 1) * rowsPerPage;
      const end = start + rowsPerPage;
      rows.forEach((row, index) => {
        row.style.display =
          index >= start && index < end ? "table-row" : "none";
      });
    }

    function createButton(label, page = null, disabled = false, active = false) {
      const button = document.createElement("button");
      button.textContent = label;
      if (active) button.classList.add("active");
      if (disabled) button.disabled = true;
      if (page !== null) {
        button.addEventListener("click", () => {
          currentPage = page;
          renderPagination();
          displayRows(currentPage);
        });
      }
      return button;
    }

    function createDots() {
      const span = document.createElement("span");
      span.textContent = "...";
      span.className = "pagination-dots";
      return span;
    }

    function renderPagination() {
      paginationEl.innerHTML = "";
      const pageCount = Math.ceil(rows.length / rowsPerPage);
      if (pageCount <= 1) return;

      const delta = 2;
      let start = Math.max(1, currentPage - delta);
      let end = Math.min(pageCount, currentPage + delta);

      if (currentPage - delta < 1)
        end = Math.min(pageCount, end + (delta - currentPage + 1));
      if (currentPage + delta > pageCount)
        start = Math.max(1, start - (currentPage + delta - pageCount));

      paginationEl.appendChild(createButton("Prev", currentPage - 1, currentPage === 1));

      if (start > 1) {
        paginationEl.appendChild(createButton(1, 1));
        if (start > 2) paginationEl.appendChild(createDots());
      }

      for (let i = start; i <= end; i++) {
        paginationEl.appendChild(createButton(i, i, false, i === currentPage));
      }

      if (end < pageCount) {
        if (end < pageCount - 1) paginationEl.appendChild(createDots());
        paginationEl.appendChild(createButton(pageCount, pageCount));
      }

      paginationEl.appendChild(createButton("Next", currentPage + 1, currentPage === pageCount));
    }

    return { init };
  }

  const pager = initPagination(commentsBody, paginationEl, 5);

  const url = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/comments";

  async function getComments() {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error("Məlumat yüklənmədi");

      const data = await response.json();

      if (data.data && Array.isArray(data.data)) {
        commentsBody.innerHTML = "";

        data.data.forEach((item, index) => {
          const tr = document.createElement("tr");
          tr.dataset.id = item.id;

          tr.innerHTML = `
            <td>${index + 1}</td>
            <td>
              <img src="${item.movie?.cover_url || "../../assets/Admin/images/movies.svg"}"
                style="width:45px;height:60px;object-fit:cover;border-radius:4px;display:block;margin:0 auto"
                onerror="this.src='../../assets/Admin/images/movies.svg'">
            </td>
            <td>${item.movie?.title || "Film adı yoxdur"}</td>
            <td class="comment-cell" data-full="${item.comment}">
              ${item.comment.length > 30 ? item.comment.slice(0, 30) + "..." : item.comment}
            </td>
            <td>
              <i class="fa-solid fa-trash delete"
                 data-id="${item.id}"
                 data-movie-id="${item.movie?.id}"
                "></i>
            </td>
          `;

          commentsBody.appendChild(tr);
        });

        const rows = Array.from(commentsBody.querySelectorAll("tr"));
        pager.init(rows);
      }
    } catch (error) {
      console.log("Xəta baş verdi:", error);
    }
  }

  getComments();
// =============================================
  // JS TOOLTIP
  // =============================================
  const jsTooltip = document.createElement("div");
  jsTooltip.className = "js-tooltip";
  document.body.appendChild(jsTooltip);

  document.addEventListener("mouseover", (e) => {
    const el = e.target.closest(".comment-cell");
    if (!el) return;
    const text = el.dataset.full;
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
    const el = e.target.closest(".comment-cell");
    if (!el) return;
    jsTooltip.style.display = "none";
  });

  // ── Modal və delete eventləri ──
  commentsBody.addEventListener("click", (e) => {
    const icon = e.target.closest(".delete");
    if (!icon) return;
    commentIdToDelete = icon.dataset.id;
    movieIdToDelete = icon.dataset.movieId;
    deleteModal.classList.add("active");
  });

  cancelBtn.addEventListener("click", () =>
    deleteModal.classList.remove("active"),
  );

  deleteModal.addEventListener("click", (e) => {
    if (e.target === deleteModal) deleteModal.classList.remove("active");
  });

  confirmDeleteBtn.addEventListener("click", async () => {
    if (!commentIdToDelete || !movieIdToDelete) return;

    try {
      const response = await fetch(
        `https://api.sarkhanrahimli.dev/api/filmalisa/admin/movies/${movieIdToDelete}/comment/${commentIdToDelete}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) throw new Error("Silmek olmadi");

      const row = commentsBody.querySelector(`[data-id="${commentIdToDelete}"]`);
      if (row) row.remove();

      const rows = Array.from(commentsBody.querySelectorAll("tr"));
      pager.init(rows);

      deleteModal.classList.remove("active");
      commentIdToDelete = null;
      movieIdToDelete = null;
    } catch (error) {
      console.log("Xəta:", error);
    }
  });
});