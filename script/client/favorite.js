// ===== CAROUSEL JS =====
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
  const step = CARD_WIDTH + CARD_GAP;
  const maxIndex = Math.max(0, cards.length - VISIBLE);

  let currentIndex = 0;

  // Dot-ları yarat
  for (let i = 0; i <= maxIndex; i++) {
    const dot = document.createElement('div');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => goTo(i));
    dotsContainer.appendChild(dot);
  }

  function goTo(index) {
    currentIndex = Math.max(0, Math.min(index, maxIndex));
    grid.style.transform = `translateX(-${currentIndex * step}px)`;

    document.querySelectorAll('.dot').forEach((d, i) => {
      d.classList.toggle('active', i === currentIndex);
    });

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === maxIndex;
  }

  // Düymələr
  prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
  nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

  // ── Mouse drag ──
  let isDragging = false;
  let startX = 0;
  let dragOffset = 0;
  let hasDragged = false;

  grid.addEventListener('mousedown', (e) => {
    isDragging = true;
    hasDragged = false;
    startX = e.clientX;
    dragOffset = 0;
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    dragOffset = e.clientX - startX;
    if (Math.abs(dragOffset) > 5) {
      hasDragged = true;
      grid.classList.add('dragging');
      grid.style.transform = `translateX(${-(currentIndex * step) + dragOffset}px)`;
    }
  });

  window.addEventListener('mouseup', () => {
    if (!isDragging) return;
    isDragging = false;
    grid.classList.remove('dragging');
    if (hasDragged) {
      if (dragOffset < -80) goTo(currentIndex + 1);
      else if (dragOffset > 80) goTo(currentIndex - 1);
      else goTo(currentIndex);
    }
  });

  // Drag zamanı click işləməsin
  grid.addEventListener('click', (e) => {
    if (hasDragged) e.preventDefault();
  });

  // ── Touch (mobil) ──
  let touchStartX = 0;
  let touchCurrentX = 0;

  grid.addEventListener(
    'touchstart',
    (e) => {
      touchStartX = e.touches[0].clientX;
      touchCurrentX = e.touches[0].clientX;
    },
    { passive: true },
  );

  grid.addEventListener(
    'touchmove',
    (e) => {
      touchCurrentX = e.touches[0].clientX;
      const diff = touchCurrentX - touchStartX;
      grid.classList.add('dragging');
      grid.style.transform = `translateX(${-(currentIndex * step) + diff}px)`;
    },
    { passive: true },
  );

  grid.addEventListener('touchend', () => {
    grid.classList.remove('dragging');
    const diff = touchCurrentX - touchStartX;
    if (diff < -50) goTo(currentIndex + 1);
    else if (diff > 50) goTo(currentIndex - 1);
    else goTo(currentIndex);
  });

  // Başlanğıc
  goTo(0);
})();
