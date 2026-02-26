// ===== CAROUSEL JS =====
<<<<<<< HEAD
// Bunu </body>-dən əvvəl <script> tag-ı içinə yapışdır
// =======================

(function () {
  const grid = document.getElementById('movieGrid');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('dots');

  // ── Ayar: kart neçə px genişdir? (CSS-dəki width ilə eyni olmalıdır) ──
  const CARD_WIDTH = 400; // movie-card { width: 400px }
  const CARD_GAP = 0; // movie-grid-də gap yoxdur
  const VISIBLE = 3; // eyni anda ekranda neçə kart görünsün
  // ──────────────────────────────────────────────────────────────────────

  const cards = grid.querySelectorAll('.movie-card');
=======

(function () {
  const grid = document.getElementById("movieGrid");
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  const CARD_WIDTH = 300;
  const CARD_GAP = 0;
  const VISIBLE = 4.9;

  const cards = grid.querySelectorAll(".movie-card");
>>>>>>> 9cc8465f984497fd7f712892d2d3ea1d8c2c3b8f
  const step = CARD_WIDTH + CARD_GAP;
  const maxIndex = Math.max(0, cards.length - VISIBLE);

  let currentIndex = 0;

<<<<<<< HEAD
  // Dot-ları yarat
  for (let i = 0; i <= maxIndex; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }

=======
>>>>>>> 9cc8465f984497fd7f712892d2d3ea1d8c2c3b8f
  function goTo(index) {
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    grid.style.transform = `translateX(-${currentIndex * step}px)`;

<<<<<<< HEAD
    document.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === currentIndex);
    });

=======
>>>>>>> 9cc8465f984497fd7f712892d2d3ea1d8c2c3b8f
    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === maxIndex;
  }

<<<<<<< HEAD
  // Düymələr
  prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
  nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

  // ── Mouse drag ──
=======
  prevBtn.addEventListener("click", () => goTo(currentIndex - 1));
  nextBtn.addEventListener("click", () => goTo(currentIndex + 1));

>>>>>>> 9cc8465f984497fd7f712892d2d3ea1d8c2c3b8f
  let isDragging = false;
  let startX = 0;
  let dragOffset = 0;
  let hasDragged = false;

<<<<<<< HEAD
  grid.addEventListener('mousedown', (e) => {
=======
  grid.addEventListener("mousedown", (e) => {
>>>>>>> 9cc8465f984497fd7f712892d2d3ea1d8c2c3b8f
    isDragging = true;
    hasDragged = false;
    startX = e.clientX;
    dragOffset = 0;
  });

<<<<<<< HEAD
  window.addEventListener('mousemove', (e) => {
=======
  window.addEventListener("mousemove", (e) => {
>>>>>>> 9cc8465f984497fd7f712892d2d3ea1d8c2c3b8f
    if (!isDragging) return;
    dragOffset = e.clientX - startX;
    if (Math.abs(dragOffset) > 5) {
      hasDragged = true;
<<<<<<< HEAD
      grid.classList.add('dragging');
=======
      grid.classList.add("dragging");
>>>>>>> 9cc8465f984497fd7f712892d2d3ea1d8c2c3b8f
      grid.style.transform = `translateX(${-(currentIndex * step) + dragOffset}px)`;
    }
  });

<<<<<<< HEAD
  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    grid.classList.remove('dragging');
=======
  window.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    grid.classList.remove("dragging");
>>>>>>> 9cc8465f984497fd7f712892d2d3ea1d8c2c3b8f
    if (hasDragged) {
      if (dragOffset < -80) goTo(currentIndex + 1);
      else if (dragOffset > 80) goTo(currentIndex - 1);
      else goTo(currentIndex);
    }
  });

<<<<<<< HEAD
  // Drag zamanı click işləməsin
  grid.addEventListener('click', (e) => {
    if (hasDragged) e.preventDefault();
  });

  // ── Touch (mobil) ──
=======
  grid.addEventListener("click", (e) => {
    if (hasDragged) e.preventDefault();
  });

>>>>>>> 9cc8465f984497fd7f712892d2d3ea1d8c2c3b8f
  let touchStartX = 0;
  let touchCurrentX = 0;

  grid.addEventListener(
<<<<<<< HEAD
    'touchstart',
=======
    "touchstart",
>>>>>>> 9cc8465f984497fd7f712892d2d3ea1d8c2c3b8f
    (e) => {
      touchStartX = e.touches[0].clientX;
      touchCurrentX = e.touches[0].clientX;
    },
    { passive: true },
  );

  grid.addEventListener(
<<<<<<< HEAD
    'touchmove',
    (e) => {
      touchCurrentX = e.touches[0].clientX;
      const diff = touchCurrentX - touchStartX;
      grid.classList.add('dragging');
=======
    "touchmove",
    (e) => {
      touchCurrentX = e.touches[0].clientX;
      const diff = touchCurrentX - touchStartX;
      grid.classList.add("dragging");
>>>>>>> 9cc8465f984497fd7f712892d2d3ea1d8c2c3b8f
      grid.style.transform = `translateX(${-(currentIndex * step) + diff}px)`;
    },
    { passive: true },
  );

<<<<<<< HEAD
  grid.addEventListener('touchend', () => {
    grid.classList.remove('dragging');
=======
  grid.addEventListener("touchend", () => {
    grid.classList.remove("dragging");
>>>>>>> 9cc8465f984497fd7f712892d2d3ea1d8c2c3b8f
    const diff = touchCurrentX - touchStartX;
    if (diff < -50) goTo(currentIndex + 1);
    else if (diff > 50) goTo(currentIndex - 1);
    else goTo(currentIndex);
  });

<<<<<<< HEAD
  // Başlanğıc
=======
>>>>>>> 9cc8465f984497fd7f712892d2d3ea1d8c2c3b8f
  goTo(0);
})();
