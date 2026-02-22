(function () {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dot");
  const wrapper = document.getElementById("heroWrapper");

  const AUTOPLAY_DELAY = 5000;

  let current = 0;
  let timer;

  function goTo(index) {
    dots[current].classList.remove("active");

    current = (index + slides.length) % slides.length;

    wrapper.style.transform = `translateX(-${current * 100}%)`;

    dots[current].classList.add("active");
  }

  function next() {
    goTo(current + 1);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      clearInterval(timer);
      goTo(i);
      startAutoplay();
    });
  });

  function startAutoplay() {
    timer = setInterval(next, AUTOPLAY_DELAY);
  }

  let touchStartX = 0;
  const slider = document.getElementById("heroSlider");

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
})();

// ===== CATEGORY CAROUSELS - UNIVERSAL JS =====

(function () {
  const CARD_WIDTH = 292;
  const CARD_GAP = 16;
  const VISIBLE = 4.8;

  const step = CARD_WIDTH + CARD_GAP;

  document.querySelectorAll(".category-carousel").forEach((carousel) => {
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

    // Mouse drag
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

    // Touch
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
  });
})();
