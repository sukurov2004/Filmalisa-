// Modal elementləri
const createBtn = document.getElementById("createBtn");
const categoryModal = document.getElementById("categoryModal");
const cancelCategory = document.getElementById("cancelCategory");
const categoryInput = document.getElementById("categoryInput");
const submitCategory = document.getElementById("submitCategory");

// Create düyməsinə klik
createBtn.addEventListener("click", () => {
  categoryInput.value = ""; // input təmizlənir
  categoryModal.classList.add("active");
});

// Cancel düyməsi modalı bağlayır
cancelCategory.addEventListener("click", () => {
  categoryModal.classList.remove("active");
});

// Submit düyməsi üçün hələ heç nə etməyəcək
submitCategory.addEventListener("click", () => {
  console.log("Submit clicked - yet to implement POST request");
});

// overlay-ə klik: modal bağlansın
categoryModal.addEventListener("click", () => {
  categoryModal.classList.remove("active");
});

// modal içini seç (düz class) və klik eventi dayandır
const modalContent = categoryModal.querySelector(".category-modal"); // <--- buradakı class HTML-dəki modalın class-ı olmalıdır
modalContent.addEventListener("click", (e) => {
  e.stopPropagation();
});
