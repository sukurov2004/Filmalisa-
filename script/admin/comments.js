document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
           window.location.href = "http://127.0.0.1:5500/index.html";
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
    
    // console.log("Gələn məlumat:", data);

    if (data.data && Array.isArray(data.data)){
      commentsBody.innerHTML = "";
      data.data.forEach((item,index) => {
        const tr = document.createElement("tr");

        tr.innerHTML = `
           <td>${index + 1}</td>
                <td>
                    <img src="${item.movie?.cover_url || '../../assets/Admin/images/movies.svg'}" 
                         style="width: 45px; height: 60px; object-fit: cover; border-radius: 4px;"
                         onerror="this.src='../../assets/Admin/images/movies.svg'">
                </td>
                <td>${item.movie?.title || "Film adı yoxdur"}</td>
                <td>${item.comment}</td> 
                <td>
                    <i class="fa-solid fa-trash delete-icon" data-id="${item.id}" style="cursor:pointer; color:red; background: #ef444426;"></i>
                </td>
        `;

        commentsBody.appendChild(tr);
      });
    }

  } catch (error) {
    console.log("Xəta baş verdi:", error);
  }
}
getComments();
});
