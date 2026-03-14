document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("adminToken");

  // Əgər token yoxdursa → login-ə at
  if (!token) {
    window.location.replace(
      "https://sukurov2004.github.io/Filmalisa-/pages/admin/login.html",
    );
  }

  const cardList = document.querySelector(".stats-flex");

  const apiUrl = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/dashboard";

  fetch(apiUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Unauthorized or server error");
      }
      return response.json();
    })
    .then((data) => {
      cardList.innerHTML = `
      <div class="card">
        <p class="box-name">Favorite actions</p>
        <span class="number-dash">${data.data.favorites}</span>
      </div>    

      <div class="card-letter" data-link="users.html">
        <p class="box-name">Users</p>
        <span class="number-dash">${data.data.users}</span>
      </div>   

      <div class="card-letter" data-link="movies.html">
        <p class="box-name">Movies</p>
        <span class="number-dash">${data.data.movies}</span>
      </div>

      <div class="card-letter" data-link="comments.html">
        <p class="box-name">Comments</p>
        <span class="number-dash">${data.data.comments}</span>
      </div>

      <div class="card" data-link="categories.html">
        <p class="box-name">Categories</p>
        <span class="number-dash">${data.data.categories}</span>
      </div>

      <div class="card-letter" data-link="actors.html">
        <p class="box-name">Actors</p>
        <span class="number-dash">${data.data.actors}</span>
      </div>

      <div class="card-letter" data-link="contactus.html">
        <p class="box-name">Contacts</p>
        <span class="number-dash">${data.data.contacts}</span>
      </div>
    `;

      const cards = document.querySelectorAll("[data-link]");

      cards.forEach((card) => {
        card.style.cursor = "pointer";

        card.addEventListener("click", () => {
          window.location.href = card.dataset.link;
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching dashboard data:", error);
    });
});
