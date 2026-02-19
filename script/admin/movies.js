const createBtn = document.getElementById('createBtn');
const modal = document.getElementById('movieModal');
const closeModal = document.getElementById('closeModal');

createBtn.addEventListener('click', () => {
  modal.classList.add('active');
});

closeModal.addEventListener('click', () => {
  modal.classList.remove('active');
});

modal.addEventListener('click', (e) => {
  if (e.target === modal) {
    modal.classList.remove('active');
  }
});
