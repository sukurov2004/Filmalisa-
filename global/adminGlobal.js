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
