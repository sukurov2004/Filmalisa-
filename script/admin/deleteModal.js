<<<<<<< HEAD
document.addEventListener("DOMContentLoaded", function () {
  const deleteIcons = document.querySelectorAll(".delete");
  const modal = document.getElementById("deleteModal");
  const cancelBtn = document.querySelector(".cancel-btn");

  // Delete iconlara klik
  deleteIcons.forEach((icon) => {
    icon.addEventListener('click', () => {
      modal.classList.add('active');
    });
  });

  cancelBtn.addEventListener("click", () => {
    modal.classList.remove("active");
  });
=======
// ─── Delete Modal ────────────────────────────────────────────
const deleteOverlay = document.getElementById("deleteModal");
const cancelBtn = deleteOverlay.querySelector(".cancel-btn");
const deleteConfirmBtn = deleteOverlay.querySelector(".delete-btn");

let _deleteCallback = null;

// movies.js-dən çağırılır: openDeleteModal(() => deleteMovie(id))
function openDeleteModal(callback) {
  _deleteCallback = callback;
  deleteOverlay.classList.add("active");
}
>>>>>>> 9cc8465f984497fd7f712892d2d3ea1d8c2c3b8f

cancelBtn.addEventListener("click", () => {
  deleteOverlay.classList.remove("active");
  _deleteCallback = null;
});

deleteOverlay.addEventListener("click", (e) => {
  if (e.target === deleteOverlay) {
    deleteOverlay.classList.remove("active");
    _deleteCallback = null;
  }
});

deleteConfirmBtn.addEventListener("click", () => {
  if (typeof _deleteCallback === "function") {
    _deleteCallback();
  }
  deleteOverlay.classList.remove("active");
  _deleteCallback = null;
});