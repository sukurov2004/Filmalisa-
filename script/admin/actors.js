const createBtn = document.getElementById('createBtn');
const modal = document.getElementById('actorModal');
const cancelBtn = document.getElementById('cancelBtn');
const saveBtn = document.getElementById('saveBtn');

const tbody = document.getElementById('actorsTbody');
const nameInput = document.getElementById('nameInput');
const surnameInput = document.getElementById('surnameInput');
const imgInput = document.getElementById('imgInput');

function openModal() {
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  modal.classList.remove('open');
  document.body.style.overflow = '';
}

createBtn.addEventListener('click', openModal);
cancelBtn.addEventListener('click', closeModal);

// overlay click
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// esc close
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
});

// Add new actor
saveBtn.addEventListener('click', () => {
  const name = nameInput.value.trim();
  const surname = surnameInput.value.trim();
  const img = imgInput.value.trim();

  if (!name || !surname) {
    alert('Name və Surname boş ola bilməz.');
    return;
  }

  const id = tbody.querySelectorAll('tr').length + 1;

  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${id}</td>
    <td>${escapeHtml(name)}</td>
    <td>${escapeHtml(surname)}</td>
    <td class="col-img">
      <img class="actor-img" src="${img || '../../assets/Admin/images/movies.svg'}" alt="actor"/>
    </td>
    <td class="col-action">
      <button class="action-pill edit-pill" type="button" aria-label="Edit">
        <i class="fa-solid fa-pen"></i>
      </button>
    </td>
    <td class="col-action">
      <button class="action-pill del-pill" type="button" aria-label="Remove">
        <i class="fa-solid fa-trash"></i>
      </button>
    </td>
  `;

  tbody.appendChild(tr);

  nameInput.value = '';
  surnameInput.value = '';
  imgInput.value = '';

  closeModal();
});

// Edit / Remove (event delegation)
tbody.addEventListener('click', (e) => {
  const row = e.target.closest('tr');
  if (!row) return;

  // EDIT
  if (e.target.closest('.edit-pill')) {
    const nameCell = row.children[1];
    const surnameCell = row.children[2];
    const imgEl = row.querySelector('.actor-img');

    nameCell.textContent = newName.trim() || nameCell.textContent;
    surnameCell.textContent = newSurname.trim() || surnameCell.textContent;
    imgEl.src = newImg.trim() || imgEl.src;
  }
});

function reIndexIds() {
  [...tbody.querySelectorAll('tr')].forEach((tr, i) => {
    tr.children[0].textContent = i + 1;
  });
}

// XSS üçün sadə escape
function escapeHtml(str) {
  return str
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
