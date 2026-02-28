(function(){
  const header = document.querySelector('.siteHeader');
  const burger = document.querySelector('.siteHeader__burger');
  const nav = document.querySelector('.siteNav');

  if(!header || !burger || !nav) return;

  function closeMenu(){
    header.classList.remove('is-menu-open');
    burger.setAttribute('aria-expanded', 'false');
  }

  burger.addEventListener('click', () => {
    const open = header.classList.toggle('is-menu-open');
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // Ferme si clic en dehors
  document.addEventListener('click', (e) => {
    if(!header.classList.contains('is-menu-open')) return;
    if(e.target.closest('.siteHeader')) return;
    closeMenu();
  });

  // Ferme au clic sur un lien
  nav.addEventListener('click', (e) => {
    if(e.target.closest('a')) closeMenu();
  });

  // Ferme si on repasse en desktop
  window.addEventListener('resize', () => {
    if(window.matchMedia('(min-width:821px)').matches) closeMenu();
  });
})();