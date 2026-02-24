document.addEventListener("DOMContentLoaded", () => {
  // =====================
  // AUTH CHECK
  // =====================
  const token = localStorage.getItem("adminToken");
  if (!token) {
    window.location.href =
      "https://sukurov2004.github.io/Filmalisa-/index.html";
    return;
  }

  // =====================
  // MODAL ELEMENTS
  // =====================
  const createBtn = document.getElementById("createBtn");
  const modal = document.getElementById("movieModal");
  const closeModal = document.getElementById("closeModal");


  if (!createBtn || !modal || !closeModal) return;

  // =====================
  // OPEN MODAL
  // =====================
  createBtn.addEventListener("click", () => {
    modal.classList.add("active");
  });

  // =====================
  // CLOSE MODAL (X düyməsi)
  // =====================
  closeModal.addEventListener("click", () => {
    modal.classList.remove("active");
  });

  // =====================
  // CLOSE MODAL (overlay click)
  // =====================
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });

  // =====================
  // CLOSE MODAL (ESC)
  // =====================
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("active")) {
      modal.classList.remove("active");
    }
  });
});