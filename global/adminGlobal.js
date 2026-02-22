document.addEventListener("DOMContentLoaded", () => {
  const sidebarLinks = document.querySelectorAll(".sidebar .menu a");

  const currentPage = window.location.href.split("/").pop().split("?")[0];

  sidebarLinks.forEach(link => {
    const linkPage = link.getAttribute("href").split("/").pop();

    if (linkPage === currentPage) {
      link.classList.add("active-link"); 
    } else {
      link.classList.remove("active-link");
    }
  });
});
// logout etmek için logout butonuna tıklanıldığında localStorage'daki token'ı sil ve login e yönlendir
const logoutBtn = document.querySelector(".logout");
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("adminToken");
  window.location.href = "http://127.0.0.1:5500/pages/admin/login.html";
});