// ===== HERO SLIDER JS =====
// </body>-dən əvvəl <script> içinə yapışdır
// ==========================

(function () {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dot");

  const AUTOPLAY_DELAY = 5000; // neçə millisaniyədə bir keçsin (5000 = 5 saniyə)

  let current = 0;
  let timer;

  function goTo(index) {
    slides[current].classList.remove("active");
    dots[current].classList.remove("active");

    current = (index + slides.length) % slides.length;

    slides[current].classList.add("active");
    dots[current].classList.add("active");
  }

  function next() {
    goTo(current + 1);
  }

  // Dot-lara klik
  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      clearInterval(timer);
      goTo(i);
      startAutoplay();
    });
  });

  // Autoplay
  function startAutoplay() {
    timer = setInterval(next, AUTOPLAY_DELAY);
  }

  // Touch / swipe dəstəyi
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

  // Başlat
  startAutoplay();
})();
