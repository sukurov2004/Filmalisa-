// ===== AUTH GUARD =====
(function () {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.replace("http://127.0.0.1:5500/pages/client/login.html");
  }
})();
document.addEventListener("DOMContentLoaded", async()=>{
    const token = localStorage.getItem("token");

    if(!token) {
        // window.location.href = "./login.html";
        return;
    }

    const url = "https://api.sarkhanrahimli.dev/api/filmalisa/profile";

    const profilImg = document.querySelector(".avatar-gradient img");
    const imgUrlInput = document.querySelector("input[name='profileImage']");
    const fullNameInput = document.querySelector("input[name='fullName']");
    const emailInput = document.querySelector("input[name='email']");
    const passwordInput = document.querySelector("input[name='password']");
    const form = document.querySelector(".account-form");

    async function getProfile() {
        try {
            const response = await fetch(url , {
                method: "GET",
                headers: {
                    "Content-type": "application/json",
                    Authorization : `Bearer ${token}`,
                },
            });
            if(!response.ok) throw new Error("Melumat yuklenmedi");
            const data = await response.json();
            const user = data.data

            fullNameInput.value = user.full_name || ""; //null ve ya undifined olarsa bos stringe yazacaq
            emailInput.value = user.email || "";
            imgUrlInput.value = user.img_url || "";

            if(user.img_url){
                profilImg.src = user.img_url;
            }
            
        } catch (error) {
            console.log("Xeta",error);
        }
    }
    getProfile();
});