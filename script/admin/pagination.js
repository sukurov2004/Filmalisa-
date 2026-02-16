
const rowsPerPage = 4;
const rows = Array.from(document.querySelectorAll(".movies-table tbody tr"));
const pagination = document.querySelector(".pagination");

let currentPage = 1;

function displayRows(page) {
  const start = (page - 1) * rowsPerPage;
  const end = start + rowsPerPage;

  rows.forEach((row, index) => {
    row.style.display = (index >= start && index < end) ? "table-row" : "none";
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

function renderPagination() {
  pagination.innerHTML = "";

  const pageCount = Math.ceil(rows.length / rowsPerPage);

  // Previous button
  pagination.appendChild(
    createButton("Prev", currentPage - 1, currentPage === 1)
  );

  // Page numbers
  for (let i = 1; i <= pageCount; i++) {
    pagination.appendChild(
      createButton(i, i, false, i === currentPage)
    );
  }

  // Next button
  pagination.appendChild(
    createButton("Next", currentPage + 1, currentPage === pageCount)
  );
}

renderPagination();
displayRows(currentPage);

