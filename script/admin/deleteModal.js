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