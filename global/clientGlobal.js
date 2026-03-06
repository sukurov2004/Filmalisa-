function renderStars(imdb) {
  const rating = parseFloat(imdb) / 2;
  let html = "";
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) html += '<span class="star filled">★</span>';
    else if (i - rating < 1) html += '<span class="star half">★</span>';
    else html += '<span class="star empty">★</span>';
  }
  return html;
}

document.addEventListener("DOMContentLoaded", () => {
  // Loader — əgər fetch yoxdursa gizlət
  setTimeout(() => {
    if (activeRequests <= 0) hideLoader();
  }, 100);

  // Cinema intro
  const cinemaIntro = document.getElementById("cinemaIntro");
  if (!cinemaIntro) return;

  if (localStorage.getItem("introPlayed")) {
    cinemaIntro.style.display = "none";
    return;
  }

  setTimeout(() => {
    cinemaIntro.classList.add("fade-out");
    setTimeout(() => {
      cinemaIntro.style.display = "none";
      localStorage.setItem("introPlayed", "true");
    }, 1000);
  }, 2000);
});


let activeRequests = 0;

function showLoader() {
  activeRequests++;
  const loader = document.getElementById("globalLoader");
  loader?.classList.remove("hidden");
}

function hideLoader() {
  activeRequests--;
  if (activeRequests <= 0) {
    activeRequests = 0;
    const loader = document.getElementById("globalLoader");
    loader?.classList.add("hidden");
  }
}

const originalFetch = window.fetch;

window.fetch = async (...args) => {
  try {
    showLoader();
    const response = await originalFetch(...args);
    return response;
  } finally {
    hideLoader();
  }
};
// function showLoader() {
//   const loader = document.getElementById("globalLoader");
//   loader?.classList.remove("hidden");
// }

// function hideLoader() {
//     const loader = document.getElementById("globalLoader");
//   loader?.classList.add("hidden");
// }

// const originalFetch = window.fetch;

// window.fetch = async (...args) => {
//   try {
//     showLoader();
//     const response = await originalFetch(...args);
//     return response;
//   } finally {
//     hideLoader();
//   }
// };