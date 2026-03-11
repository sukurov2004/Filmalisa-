// function initPagination(tableBodyEl, paginationEl, rowsPerPage = 4) {
//   let currentPage = 1;
//   let rows = [];

//   function init(newRows) {
//     rows = newRows;
//     currentPage = 1;
//     renderPagination();
//     displayRows(currentPage);
//   }

//   function displayRows(page) {
//     const start = (page - 1) * rowsPerPage;
//     const end = start + rowsPerPage;
//     rows.forEach((row, index) => {
//       row.style.display = index >= start && index < end ? "table-row" : "none";
//     });
//   }

//   function createButton(label, page = null, disabled = false, active = false) {
//     const button = document.createElement("button");
//     button.textContent = label;
//     if (active) button.classList.add("active");
//     if (disabled) button.disabled = true;
//     if (page !== null) {
//       button.addEventListener("click", () => {
//         currentPage = page;
//         renderPagination();
//         displayRows(currentPage);
//       });
//     }
//     return button;
//   }

//   function createDots() {
//     const span = document.createElement("span");
//     span.textContent = "...";
//     span.className = "pagination-dots";
//     return span;
//   }

//   function renderPagination() {
//     paginationEl.innerHTML = "";
//     const pageCount = Math.ceil(rows.length / rowsPerPage);
//     if (pageCount <= 1) return;

//     const delta = 2;
//     let start = Math.max(1, currentPage - delta);
//     let end = Math.min(pageCount, currentPage + delta);

//     if (currentPage - delta < 1) end = Math.min(pageCount, end + (delta - currentPage + 1));
//     if (currentPage + delta > pageCount) start = Math.max(1, start - (currentPage + delta - pageCount));

//     paginationEl.appendChild(createButton("Prev", currentPage - 1, currentPage === 1));

//     if (start > 1) {
//       paginationEl.appendChild(createButton(1, 1));
//       if (start > 2) paginationEl.appendChild(createDots());
//     }

//     for (let i = start; i <= end; i++) {
//       paginationEl.appendChild(createButton(i, i, false, i === currentPage));
//     }

//     if (end < pageCount) {
//       if (end < pageCount - 1) paginationEl.appendChild(createDots());
//       paginationEl.appendChild(createButton(pageCount, pageCount));
//     }

//     paginationEl.appendChild(createButton("Next", currentPage + 1, currentPage === pageCount));
//   }

//   return { init };
// }


function initPagination(tableBodyEl, paginationEl, rowsPerPage = 4) {
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
      if (index >= start && index < end) {
        row.style.display = row.tagName === "TR" ? "table-row" : "";
      } else {
        row.style.display = "none";
      }
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

    if (currentPage - delta < 1) end = Math.min(pageCount, end + (delta - currentPage + 1));
    if (currentPage + delta > pageCount) start = Math.max(1, start - (currentPage + delta - pageCount));

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