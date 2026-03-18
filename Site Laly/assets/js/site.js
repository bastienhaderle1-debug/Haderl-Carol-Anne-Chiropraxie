(function(){
  const years = document.querySelectorAll('[data-current-year]');
  if(!years.length) return;

  const year = String(new Date().getFullYear());
  years.forEach((node) => {
    node.textContent = year;
  });
})();

(function(){
  const slider = document.querySelector('[data-hero-slider]');
  if(!slider) return;

  const slides = Array.from(slider.querySelectorAll('.hero__slide'));
  const dots = Array.from(slider.querySelectorAll('.hero__dot'));
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const intervalMs = 5000;
  let currentIndex = 0;
  let timerId = null;

  if(slides.length < 2) return;

  function syncSlides(nextIndex){
    slides.forEach((slide, index) => {
      slide.classList.toggle('is-active', index === nextIndex);
    });

    dots.forEach((dot, index) => {
      const isActive = index === nextIndex;
      dot.classList.toggle('is-active', isActive);
      dot.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    currentIndex = nextIndex;
  }

  function stopAutoplay(){
    if(timerId === null) return;
    window.clearTimeout(timerId);
    timerId = null;
  }

  function queueNextSlide(){
    stopAutoplay();
    if(reducedMotion.matches || document.hidden) return;

    timerId = window.setTimeout(() => {
      syncSlides((currentIndex + 1) % slides.length);
      queueNextSlide();
    }, intervalMs);
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      syncSlides(index);
      queueNextSlide();
    });
  });

  if(typeof reducedMotion.addEventListener === 'function'){
    reducedMotion.addEventListener('change', () => {
      if(reducedMotion.matches){
        stopAutoplay();
        return;
      }

      queueNextSlide();
    });
  }

  document.addEventListener('visibilitychange', () => {
    if(document.hidden){
      stopAutoplay();
      return;
    }

    queueNextSlide();
  });

  syncSlides(0);
  queueNextSlide();
})();
