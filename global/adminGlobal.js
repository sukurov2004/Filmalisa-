document.addEventListener("DOMContentLoaded", () => {
  const sidebarLinks = document.querySelectorAll(".sidebar .menu a");

  const currentPage = window.location.href.split("/").pop().split("?")[0];

  sidebarLinks.forEach((link) => {
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

// FAQ ACCORDION — JavaScript

(function () {
  const headers = document.querySelectorAll(".accordion-header");

  headers.forEach(function (btn) {
    btn.addEventListener("click", function () {
      const isOpen = btn.getAttribute("aria-expanded") === "true";

      // Hamısını bağla
      headers.forEach(function (otherBtn) {
        const otherId = otherBtn.getAttribute("aria-controls");
        const otherContent = document.getElementById(otherId);
        otherBtn.setAttribute("aria-expanded", "false");
        otherContent.style.maxHeight = "0";
        otherContent.style.padding = "0 15px";
        otherContent.style.opacity = "0";
      });

      // Kliklənəni aç (əgər bağlıydısa)
      if (!isOpen) {
        const contentId = btn.getAttribute("aria-controls");
        const content = document.getElementById(contentId);
        btn.setAttribute("aria-expanded", "true");
        content.style.maxHeight = content.scrollHeight + "px";
        content.style.padding = "30px";
        content.style.opacity = "1";
      }
    });
  });
})();
