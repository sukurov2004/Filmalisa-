// Modal elementləri
const createBtn = document.getElementById("createBtn");
const actorModal = document.getElementById("actorModal");
const cancelBtn = document.getElementById("cancelBtn");
const saveBtn = document.getElementById("saveBtn");

// Inputlar
const nameInput = document.getElementById("nameInput");
const surnameInput = document.getElementById("surnameInput");
const imgInput = document.getElementById("imgInput");

// Modal açmaq
createBtn.addEventListener("click", () => {
  actorModal.classList.add("active");
  document.body.style.overflow = "hidden";
  // inputları təmizlə
  nameInput.value = "";
  surnameInput.value = "";
  imgInput.value = "";
});

// Modal bağlama: Cancel düyməsi
cancelBtn.addEventListener("click", () => {
  closeModal();
});

// Modal bağlama: overlay click
actorModal.addEventListener("click", (e) => {
  if (e.target === actorModal) closeModal();
});

// Modal bağlama: ESC düyməsi
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && actorModal.classList.contains("active")) {
    closeModal();
  }
});

// Modal bağlama funksiyası
function closeModal() {
  actorModal.classList.remove("active");
  document.body.style.overflow = "";
}

// Save düyməsi hazırda data POST etməyəcək, sadəcə modal bağlayır
saveBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();
  const surname = surnameInput.value.trim();
  const img = imgInput.value.trim();

  if (!name || !surname) {
    alert("Name və Surname boş ola bilməz.");
    return;
  }

  closeModal();
});
