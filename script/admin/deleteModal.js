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

  // Overlay-ə klik: modal bağlansın
  modal.addEventListener("click", () => {
    modal.classList.remove("active");
  });

  // Modal içindəki kliklərin overlay-ə çatmaması üçün
  const modalContent = modal.querySelector(".modal");
  modalContent.addEventListener("click", (e) => {
    e.stopPropagation();
  });
});
