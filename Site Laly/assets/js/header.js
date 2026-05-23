(function(){
  const header = document.querySelector('.siteHeader');
  const burger = document.querySelector('.siteHeader__burger');
  const nav = document.querySelector('.siteNav');
  const bookingTrigger = document.querySelector('.siteHeader__cta');
  const desktopQuery = window.matchMedia('(min-width:769px)');
  const bookingUrls = {
    bujaleuf: 'https://www.doctolib.fr/chiropracteur/bujaleuf/carol-anne-haderle?pid=practice-802873&source=profile',
    saintPantaleon: 'https://www.doctolib.fr/chiropracteur/varzay/venries-laura/booking/motive-categories?specialityId=191&telehealth=false&placeId=practice-713638&source=profile'
  };

  if(!header || !burger || !nav) return;

  let bookingDialog = null;
  let bookingBackdrop = null;

  function ensureBookingDialog(){
    if(bookingDialog && bookingBackdrop) return;

    const style = document.createElement('style');
    style.textContent = '.booking-overlay{position:fixed;inset:0;z-index:1600;background:rgba(12,24,21,.4);backdrop-filter:blur(4px);-webkit-backdrop-filter:blur(4px)}.booking-dialog{position:fixed;z-index:1601;left:50%;top:50%;width:min(420px,calc(100vw - 24px));padding:22px 18px 18px;transform:translate(-50%,-50%);border:1px solid rgba(23,54,45,.12);border-radius:24px;background:linear-gradient(180deg,rgba(255,255,255,.98),rgba(255,251,244,.96));box-shadow:0 28px 80px rgba(0,0,0,.2)}.booking-dialog__close{position:absolute;top:10px;right:10px;display:grid;place-items:center;width:34px;height:34px;border:0;border-radius:999px;background:rgba(28,91,69,.1);color:#1c5b45;font-size:20px;line-height:1;cursor:pointer}.booking-dialog__title{margin:0 0 8px;font-family:var(--ff-title);font-size:28px;line-height:1;color:var(--c-primary)}.booking-dialog__text{margin:0 0 16px;color:var(--c-muted);font:600 14px/1.6 var(--ff-body)}.booking-dialog__actions{display:grid;gap:10px}.booking-dialog__choice{display:flex;flex-direction:column;gap:4px;padding:14px 16px;border:1px solid rgba(23,54,45,.1);border-radius:16px;background:rgba(255,255,255,.82);color:var(--c-primary);text-decoration:none;font:800 15px/1.35 var(--ff-body);box-shadow:0 12px 28px rgba(22,53,45,.06);transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease,background .2s ease}.booking-dialog__choice small{color:var(--c-muted);font-size:12px;font-weight:700}.booking-dialog__choice:hover,.booking-dialog__choice:focus-visible{transform:translateY(-1px);border-color:rgba(31,153,167,.4);background:#fff;box-shadow:0 16px 34px rgba(22,53,45,.1);outline:none}';
    document.head.appendChild(style);

    bookingBackdrop = document.createElement('div');
    bookingBackdrop.className = 'booking-overlay';
    bookingBackdrop.hidden = true;

    bookingDialog = document.createElement('div');
    bookingDialog.className = 'booking-dialog';
    bookingDialog.setAttribute('role', 'dialog');
    bookingDialog.setAttribute('aria-modal', 'true');
    bookingDialog.setAttribute('aria-labelledby', 'booking-dialog-title');
    bookingDialog.hidden = true;
    bookingDialog.innerHTML = '' +
      '<button class="booking-dialog__close" type="button" aria-label="Fermer">&times;</button>' +
      '<h2 class="booking-dialog__title" id="booking-dialog-title">O&ugrave; voulez-vous prendre rendez-vous ?</h2>' +
      '<p class="booking-dialog__text">Choisissez le cabinet pour &ecirc;tre redirig&eacute; vers la bonne plateforme de r&eacute;servation.</p>' +
      '<div class="booking-dialog__actions">' +
        '<a class="booking-dialog__choice" href="' + bookingUrls.bujaleuf + '" target="_blank" rel="noopener">' +
          'Bujaleuf' +
          '<small>R&eacute;servation via Doctolib</small>' +
        '</a>' +
        '<a class="booking-dialog__choice" href="' + bookingUrls.saintPantaleon + '" target="_blank" rel="noopener">' +
          'Saint-Pantal&eacute;on-de-Larche' +
          '<small>R&eacute;servation via Doctolib</small>' +
        '</a>' +
      '</div>';

    document.body.appendChild(bookingBackdrop);
    document.body.appendChild(bookingDialog);

    bookingBackdrop.addEventListener('click', closeBookingDialog);
    bookingDialog.querySelector('.booking-dialog__close')?.addEventListener('click', closeBookingDialog);
  }

  function openBookingDialog(){
    ensureBookingDialog();
    bookingBackdrop.hidden = false;
    bookingDialog.hidden = false;
    document.body.style.overflow = 'hidden';
    bookingDialog.querySelector('.booking-dialog__choice')?.focus();
  }

  function closeBookingDialog(){
    if(!bookingDialog || !bookingBackdrop) return;
    bookingBackdrop.hidden = true;
    bookingDialog.hidden = true;
    document.body.style.overflow = '';
  }

  function closeMenu(){
    header.classList.remove('is-menu-open');
    burger.setAttribute('aria-expanded', 'false');
    burger.setAttribute('aria-label', 'Ouvrir le menu');
  }

  burger.addEventListener('click', () => {
    const open = header.classList.toggle('is-menu-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Fermer le menu' : 'Ouvrir le menu');
  });

  if(bookingTrigger){
    bookingTrigger.addEventListener('click', (e) => {
      e.preventDefault();
      openBookingDialog();
    });
  }

  document.addEventListener('click', (e) => {
    if(!header.classList.contains('is-menu-open')) return;
    if(e.target.closest('.siteHeader')) return;
    closeMenu();
  });

  nav.addEventListener('click', (e) => {
    if(e.target.closest('a')) closeMenu();
  });

  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && bookingDialog && !bookingDialog.hidden){
      closeBookingDialog();
      bookingTrigger?.focus();
      return;
    }
    if(e.key === 'Escape' && header.classList.contains('is-menu-open')){
      closeMenu();
      burger.focus();
    }
  });

  window.addEventListener('resize', () => {
    if(desktopQuery.matches) closeMenu();
  });
})();
