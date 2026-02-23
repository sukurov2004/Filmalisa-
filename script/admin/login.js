document.querySelector('.form').addEventListener('submit', async function (e) {
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
    localStorage.setItem('adminToken', data.data.tokens.access_token);
    window.location.href = 'https://sukurov2004.github.io/Filmalisa-/pages/admin/dashboard.html';
  } catch (error) {
    console.error('Error:', error);
    alert('Something went wrong. Please try again.');
  }
});
document.querySelector('.eye').addEventListener('click', function () {
  const passwordInput = document.querySelector('.loginPassword');
  passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
});