document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
         window.location.href = "https://sukurov2004.github.io/Filmalisa-/index.html";
         return;
  }
  const commentsBody = document.querySelector("#comments-body");

 const url = "https://api.sarkhanrahimli.dev/api/filmalisa/admin/comments"
async function getComments() {
  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      }
    });

    if (!response.ok) {
        throw new Error("Məlumat yüklənmədi");
    }

    const data = await response.json();
    
    console.log("Gələn məlumat:", data);

  } catch (error) {
    console.log("Xəta baş verdi:", error);
  }
}
getComments();
});
