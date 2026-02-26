document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("adminToken");

  // Əgər artıq login olubsa login səhifəsini blokla
  if (token) {
    window.location.replace("http://127.0.0.1:5500/pages/admin/dashboard.html");
  }
});

const eye = document.querySelector('.eye');
const passwordInput = document.querySelector('.loginPassword');
const eyeIcon = eye.querySelector('img');
const form = document.querySelector('.form');

form.addEventListener('submit', loginAdmin);

async function loginAdmin(e) {
  e.preventDefault();

  const username = document.querySelector('.loginName').value.trim();
  const password = document.querySelector('.loginPassword').value.trim();

  try {
    const response = await fetch('https://api.sarkhanrahimli.dev/api/filmalisa/auth/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: username,
        password: password,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.result) {
      alert(data.message || 'Login failed!');
      return;
    }

    // artıq olan səhv 0 silindi
    localStorage.setItem('adminToken', data.data.tokens.access_token);

    // replace istifadə edirik ki history-də qalmasın
    window.location.replace("http://127.0.0.1:5500/pages/admin/dashboard.html");

  } catch (error) {
    console.error('Error:', error);
    alert('Something went wrong. Please try again.');
  }
}

// Password show/hide
eye.addEventListener('click', function () {
  const isPassword = passwordInput.type === 'password';

  passwordInput.type = isPassword ? 'text' : 'password';

  eyeIcon.src = isPassword
    ? '../../assets/client/İconsİmages/eyeOff.svg'
    : '../../assets/client/İconsİmages/eye.svg';
});