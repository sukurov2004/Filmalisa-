document.addEventListener("DOMContentLoaded", function () {
  const deleteIcons = document.querySelectorAll(".delete");
  const modal = document.getElementById("deleteModal");
  const cancelBtn = document.querySelector(".cancel-btn");

  deleteIcons.forEach((icon) => {
    icon.addEventListener("click", () => {
      modal.classList.add("active");
    });
  });

  cancelBtn.addEventListener("click", () => {
    modal.classList.remove("active");
  });
});
