/* prestations.js */
(function(){
  const root = document.querySelector('.prestations');
  if(!root) return;

  const items = [...root.querySelectorAll('.service')];
  const sumService = root.querySelector('#sum-service');
  const sumMeta = root.querySelector('#sum-meta');

  function closeAll(){
    items.forEach(it => {
      it.classList.remove('is-open');
      const btn = it.querySelector('.service__top');
      if(btn) btn.setAttribute('aria-expanded','false');
    });
  }

  function openItem(it){
    closeAll();
    it.classList.add('is-open');
    const btn = it.querySelector('.service__top');
    if(btn) btn.setAttribute('aria-expanded','true');

    const name = it.querySelector('.service__name')?.textContent?.trim() || '';
    const meta = it.querySelector('.service__meta')?.textContent?.replace(/\s+/g,' ').trim() || '';
    if(sumService) sumService.textContent = name;
    if(sumMeta) sumMeta.textContent = meta;
  }

  items.forEach(it => {
    const btn = it.querySelector('.service__top');
    if(!btn) return;
    btn.addEventListener('click', () => openItem(it));
  });

  if(items[0]) openItem(items[0]);
})();