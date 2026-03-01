// ===== AUTH GUARD =====
(function () {
  const token = localStorage.getItem("token");
  if (!token) {
    window.location.replace(
      "https://sukurov2004.github.io/Filmalisa-/pages/client/login.html",
    );
  }
})();

// ===== HERO SLIDER =====
async function initHeroSlider() {
  const token = localStorage.getItem("token");
  const BASE_URL = "https://api.sarkhanrahimli.dev/api/filmalisa";

  const wrapper = document.getElementById("heroWrapper");
  const dotsContainer = document.getElementById("heroDots");

  try {
    const res = await fetch(`${BASE_URL}/movies`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    const movies = data.data || [];

    // Show only latest 3 movies
    const latest3 = movies.sort((a, b) => b.id - a.id).slice(0, 3);

    // Create slides
    latest3.forEach((movie) => {
      const slide = document.createElement("div");
      slide.className = "hero-slide";
      slide.innerHTML = `
        <img src="${movie.cover_url || ""}" class="hero-img" alt="${movie.title}" />
        <div class="hero-content">
          <span class="hero-category">${movie.category?.name || ""}</span>
          <h1 class="hero-title">${movie.title}</h1>
          <p class="hero-desc">${movie.description || movie.overview || ""}</p>
          <a href="${movie.watch_url || "#"}" target="_blank" class="hero-btn">Watch Now</a>
        </div>
      `;
      wrapper.appendChild(slide);

      // Create dot for each slide
      const dot = document.createElement("span");
      dot.className = "hero-dot";
      dotsContainer.appendChild(dot);
    });

    // Activate first dot
    dotsContainer.querySelector(".hero-dot").classList.add("active");

    // Slider functionality
    const slides = wrapper.querySelectorAll(".hero-slide");
    const dots = dotsContainer.querySelectorAll(".hero-dot");
    let current = 0;
    let timer;

    function goTo(index) {
      dots[current].classList.remove("active");
      current = (index + slides.length) % slides.length;
      wrapper.style.transform = `translateX(-${current * 100}%)`;
      dots[current].classList.add("active");
    }

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => {
        clearInterval(timer);
        goTo(i);
        startAutoplay();
      });
    });

    function startAutoplay() {
      timer = setInterval(() => goTo(current + 1), 5000);
    }

    const slider = document.getElementById("heroSlider");
    let touchStartX = 0;

    slider.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.touches[0].clientX;
      },
      { passive: true },
    );

    slider.addEventListener("touchend", (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 50) {
        clearInterval(timer);
        goTo(current + (diff > 0 ? 1 : -1));
        startAutoplay();
      }
    });

    startAutoplay();
  } catch (err) {
    console.error("Hero slider xətası:", err);
  }
}

initHeroSlider();

// ===== CATEGORY CAROUSEL — UNIVERSAL =====
function initCarousel(carousel) {
  const CARD_WIDTH = 292;
  const CARD_GAP = 16;
  const VISIBLE = 4.8;
  const step = CARD_WIDTH + CARD_GAP;

  const grid = carousel.querySelector(".movie-grid");
  const prevBtn = carousel.querySelector(".carousel-btn.prev");
  const nextBtn = carousel.querySelector(".carousel-btn.next");
  const cards = grid.querySelectorAll(".movie-card");

  const maxIndex = Math.max(0, cards.length - VISIBLE);
  let currentIndex = 0;
  let isDragging = false;
  let startX = 0;
  let dragOffset = 0;
  let hasDragged = false;

  function goTo(index) {
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    grid.style.transform = `translateX(-${currentIndex * step}px)`;
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex >= maxIndex;
  }

  prevBtn.addEventListener("click", () => goTo(currentIndex - 1));
  nextBtn.addEventListener("click", () => goTo(currentIndex + 1));

  grid.addEventListener("mousedown", (e) => {
    isDragging = true;
    hasDragged = false;
    startX = e.clientX;
    dragOffset = 0;
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    dragOffset = e.clientX - startX;
    if (Math.abs(dragOffset) > 5) {
      hasDragged = true;
      grid.classList.add("dragging");
      grid.style.transform = `translateX(${-(currentIndex * step) + dragOffset}px)`;
    }
  });

  window.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    grid.classList.remove("dragging");
    if (hasDragged) {
      if (dragOffset < -80) goTo(currentIndex + 1);
      else if (dragOffset > 80) goTo(currentIndex - 1);
      else goTo(currentIndex);
    }
  });

  grid.addEventListener("click", (e) => {
    if (hasDragged) e.preventDefault();
  });

  let touchStartX = 0;
  let touchCurrentX = 0;

  grid.addEventListener(
    "touchstart",
    (e) => {
      touchStartX = e.touches[0].clientX;
      touchCurrentX = e.touches[0].clientX;
    },
    { passive: true },
  );

  grid.addEventListener(
    "touchmove",
    (e) => {
      touchCurrentX = e.touches[0].clientX;
      const diff = touchCurrentX - touchStartX;
      grid.classList.add("dragging");
      grid.style.transform = `translateX(${-(currentIndex * step) + diff}px)`;
    },
    { passive: true },
  );

  grid.addEventListener("touchend", () => {
    grid.classList.remove("dragging");
    const diff = touchCurrentX - touchStartX;
    if (diff < -50) goTo(currentIndex + 1);
    else if (diff > 50) goTo(currentIndex - 1);
    else goTo(currentIndex);
  });

  grid.style.transition = "transform 0.45s cubic-bezier(0.25, 0.8, 0.25, 1)";
  grid.style.cursor = "grab";
  goTo(0);
}

// ===== API — Categories and Movies =====
(async function () {
  const BASE_URL = "https://api.sarkhanrahimli.dev/api/filmalisa";
  const token = localStorage.getItem("token");
  const categoriesContainer = document.getElementById("categoriesContainer");
  const vectorIconSrc = "../../assets/client/İconsİmages/vector.svg";

  // Function to render star ratings
  function renderStars(rating) {
    let html = "";
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) html += '<span class="star filled">★</span>';
      else if (i - rating < 1) html += '<span class="star half">★</span>';
      else html += '<span class="star">★</span>';
    }
    return html;
  }

  // Card HTML- creation function
  function createCardHTML(movie, categoryName) {
    return `
    <a class="movie-card" href="detailed.html?id=${movie.id}">
      <img src="${movie.cover_url || ""}" class="movie-image" alt="${movie.title}" />
      <div class="movie-details">
        <div class="movie-category-container">
          <span class="movie-category">${categoryName}</span>
        </div>
        <div class="movie-rating">
          ${renderStars(movie.rating || 0)}
        </div>
        <p class="movie-title">${movie.title}</p>
      </div>
    </a>
  `;
  }

  // Kateqoriya section HTML
  function createSectionHTML(category, movies) {
    const cardsHTML = movies
      .map((m) => createCardHTML(m, category.name))
      .join("");

    return `
      <section class="category-section">
        <div class="category-header">
          <h2 class="ctg-title">${category.name}</h2>
          <img class="vector-icon" src="${vectorIconSrc}" alt="" />
        </div>
        <div class="category-carousel">
          <button class="carousel-btn prev">
            <img src="${vectorIconSrc}" alt="prev" />
          </button>
          <div class="carousel-track">
            <div class="movie-grid">
              ${cardsHTML}
            </div>
          </div>
          <button class="carousel-btn next">
            <img src="${vectorIconSrc}" alt="next" />
          </button>
        </div>
      </section>
    `;
  }

  try {
    // Categories and movies data fetching simultaneously

    const [categoriesRes] = await Promise.all([
      fetch(`${BASE_URL}/categories`, {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ]);

    const categoriesData = await categoriesRes.json();
    const categories = categoriesData.data || [];

    categories.forEach((category) => {
      const categoryMovies = category.movies || [];

      if (categoryMovies.length === 0) return;

      categoriesContainer.innerHTML += createSectionHTML(
        category,
        categoryMovies,
      );
    });

    document.querySelectorAll(".category-carousel").forEach(initCarousel);

    // Group movies by category
    categories.forEach((category) => {
      const categoryMovies = movies.filter(
        (m) => m.category_id === category.id,
      );

      // Show category without movie
      if (categoryMovies.length === 0) return;

      categoriesContainer.innerHTML += createSectionHTML(
        category,
        categoryMovies,
      );
    });

    // Initialize all carousels
    document.querySelectorAll(".category-carousel").forEach(initCarousel);
  } catch (err) {
    console.error("API xətası:", err);
  }
})();
