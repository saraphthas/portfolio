/* ==============================================================
   GALLERY — swipe, arrow buttons, dots and keyboard arrows
   Works for any <div class="gallery"> on a page.
   ============================================================== */
document.querySelectorAll('.gallery').forEach((gallery) => {
  const track = gallery.querySelector('.gallery__track');
  const slides = Array.from(track.children);
  const prevBtn = gallery.querySelector('.gallery__prev');
  const nextBtn = gallery.querySelector('.gallery__next');
  const dotsBox = gallery.querySelector('.gallery__dots');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let current = 0;

  // Distance between one slide and the next
  const step = () => (slides[1] ? slides[1].offsetLeft - slides[0].offsetLeft : track.clientWidth);

  // Slide to photo number i
  function goTo(i) {
    const target = Math.max(0, Math.min(slides.length - 1, i));
    track.scrollTo({ left: target * step(), behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  // One dot per photo
  const dots = slides.map((slide, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'gallery__dot';
    dot.setAttribute('aria-label', `Show image ${i + 1} of ${slides.length}`);
    dot.addEventListener('click', () => goTo(i));
    dotsBox.appendChild(dot);
    return dot;
  });

  // Keep the dots and arrows in sync with what's showing
  function update() {
    current = Math.round(track.scrollLeft / step());
    dots.forEach((dot, i) => {
      if (i === current) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === slides.length - 1;
  }

  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));
  track.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  window.addEventListener('resize', () => goTo(current));

  // Left/right arrow keys when the gallery is focused
  track.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') { event.preventDefault(); goTo(current - 1); }
    if (event.key === 'ArrowRight') { event.preventDefault(); goTo(current + 1); }
  });

  update();
});
