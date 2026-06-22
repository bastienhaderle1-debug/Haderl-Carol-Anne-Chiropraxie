/* prestations.js */
(function(){
  const root = document.querySelector('.prestations');
  if(!root) return;

  const items = [...root.querySelectorAll('.service')];
  const sumService = root.querySelector('#sum-service');
  const sumMeta = root.querySelector('#sum-meta');
  const bookingHint = root.querySelector('#summary-booking-hint');
  const bookingLinks = [...document.querySelectorAll('[data-booking-link]')];
  const defaultBookingUrl = bookingLinks[0]?.getAttribute('href') || '';
  let selectedService = null;

  function updateBookingLinks(url){
    const nextUrl = (url || defaultBookingUrl || '').trim();
    bookingLinks.forEach(link => {
      if(nextUrl){
        link.setAttribute('href', nextUrl);
      } else {
        link.removeAttribute('href');
      }
    });
  }

  function updateBookingState(){
    const nextUrl = selectedService ? (selectedService.dataset.bookingUrl || '') : '';

    updateBookingLinks(nextUrl);

    bookingLinks.forEach(link => {
      const disabled = !nextUrl;
      link.classList.toggle('is-disabled', disabled);
      link.setAttribute('aria-disabled', disabled ? 'true' : 'false');
      if(disabled){
        link.setAttribute('tabindex', '-1');
      } else {
        link.removeAttribute('tabindex');
      }
    });

    if(bookingHint){
      if(!selectedService){
        bookingHint.textContent = "Choisissez d'abord une prestation.";
      } else {
        bookingHint.textContent = 'Le rendez-vous sera pris sur Doctolib pour Bujaleuf.';
      }
    }
  }

  function closeAll(){
    items.forEach(it => {
      it.classList.remove('is-open');
      const btn = it.querySelector('.service__top');
      const body = it.querySelector('.service__body');
      if(btn) btn.setAttribute('aria-expanded','false');
      if(body) body.hidden = true;
    });
  }

  function openItem(it){
    closeAll();
    it.classList.add('is-open');
    const btn = it.querySelector('.service__top');
    const body = it.querySelector('.service__body');
    if(btn) btn.setAttribute('aria-expanded','true');
    if(body) body.hidden = false;

    const name = it.querySelector('.service__name')?.textContent?.trim() || '';
    const meta = it.querySelector('.service__meta')?.textContent?.replace(/\s+/g,' ').trim() || '';
    selectedService = it;
    if(sumService) sumService.textContent = name;
    if(sumMeta) sumMeta.textContent = meta;
    updateBookingState();
  }

  items.forEach(it => {
    const btn = it.querySelector('.service__top');
    const body = it.querySelector('.service__body');
    if(!btn) return;
    if(body) body.hidden = true;
    btn.addEventListener('click', () => openItem(it));
  });

  bookingLinks.forEach(link => {
    link.addEventListener('click', event => {
      if(link.classList.contains('is-disabled')){
        event.preventDefault();
      }
    });
  });

  closeAll();
  updateBookingState();
})();
