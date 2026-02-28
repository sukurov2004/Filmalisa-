// ===== AUTH GUARD =====
(function () {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.replace("http://127.0.0.1:5500/pages/client/login.html");
  }
})();
document.addEventListener("DOMContentLoaded", async () => {
  const token = localStorage.getItem("token");

  const url = "https://api.sarkhanrahimli.dev/api/filmalisa/profile";

  const profilImg = document.querySelector(".avatar-gradient img");
  const imgUrlInput = document.querySelector("input[name='profileImage']");
  const fullNameInput = document.querySelector("input[name='fullName']");
  const emailInput = document.querySelector("input[name='email']");
  const passwordInput = document.querySelector("input[name='password']");
  const form = document.querySelector(".account-form");
  const eyeIcon = document.querySelector(".input-icon.right");

  //  Göz iconu
  eyeIcon.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    eyeIcon.src = isHidden
      ? "../../assets/client/İconsİmages/eyeOff.svg"
      : "../../assets/client/İconsİmages/eye.svg";
  });
  //GET
  async function getProfile() {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Melumat yuklenmedi");
      const data = await response.json();
      const user = data.data;

      fullNameInput.value = user.full_name || "";
      emailInput.value = user.email || "";
      imgUrlInput.value = user.img_url || "";

      if (user.img_url) {
        profilImg.src = user.img_url;
      }
    } catch (error) {
      console.log("Xeta", error);
    }
  }
  getProfile();

  imgUrlInput.addEventListener("input",()=>{
    if(imgUrlInput.value){
      profilImg.src = imgUrlInput.value;
    }
  });

  //PUT
  form.addEventListener("submit", async (e) => {
    e.preventDefault(); //save duymesine basanda sehife yenilenmir

    try {
      const body = {
        full_name: fullNameInput.value,
        email: emailInput.value,
      };
      if (imgUrlInput.value){
        body.img_url = imgUrlInput.value;
      }
      if (passwordInput.value) {
        body.password = passwordInput.value;
      }
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (!response.ok) throw new Error("Yenilenmedi");
      getProfile();
    } catch (error) {
      console.log("Xeta", error);
    }
  });
});
