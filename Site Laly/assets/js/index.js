/* index.js */

/* chiro-soluces tabs */
(function () {
  const root = document.querySelector('.chiro-soluces');
  if (!root) return;

  const tabs = [...root.querySelectorAll('.chiro-soluces__tab')];
  const panels = [...root.querySelectorAll('.chiro-soluces__panel')];

  const isMobile = () => window.matchMedia('(max-width:980px)').matches;

  function activate(id, { toggle = false } = {}) {
    const panel = panels.find(p => p.id === id);
    const alreadyOpen = panel && panel.classList.contains('is-active');

    if (toggle && isMobile() && alreadyOpen) {
      tabs.forEach(btn => {
        btn.classList.remove('is-active');
        btn.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => p.classList.remove('is-active'));
      return;
    }

    tabs.forEach(btn => {
      const on = btn.dataset.tab === id;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
    });

    panels.forEach(p => p.classList.toggle('is-active', p.id === id));

    // Scroll uniquement si clic utilisateur (évite de descendre tout seul)
    if (toggle && isMobile() && panel) {
      setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
  }

  tabs.forEach(btn => btn.addEventListener('click', () => activate(btn.dataset.tab, { toggle: true })));

  const activeBtn = tabs.find(b => b.classList.contains('is-active')) || tabs[0];
  if (activeBtn) activate(activeBtn.dataset.tab, { toggle: false });
})();

/* AVIS carousel: flèches + dots */
(function () {
  const wrap = document.querySelector('.avis__wrap');
  if (!wrap) return;

  const viewport = wrap.querySelector('.avis__viewport');
  const cards = [...wrap.querySelectorAll('.avis__card')];
  const dotsWrap = wrap.querySelector('.avis__dots');
  const prevBtn = wrap.querySelector('.avis__nav--prev');
  const nextBtn = wrap.querySelector('.avis__nav--next');

  if (!viewport || cards.length === 0 || !dotsWrap) return;

  dotsWrap.innerHTML = '';
  const dots = cards.map((_, i) => {
    const b = document.createElement('button');
    b.className = 'avis__dot';
    b.type = 'button';
    b.setAttribute('aria-label', `Aller à l'avis ${i + 1}`);
    b.addEventListener('click', () => scrollToIndex(i));
    dotsWrap.appendChild(b);
    return b;
  });

  function cardCenterLeft(card) {
    const vpRect = viewport.getBoundingClientRect();
    const cRect = card.getBoundingClientRect();
    const currentLeft = viewport.scrollLeft;
    const delta = (cRect.left - vpRect.left) - (vpRect.width / 2 - cRect.width / 2);
    return currentLeft + delta;
  }

  function scrollToIndex(i) {
    viewport.scrollTo({ left: cardCenterLeft(cards[i]), behavior: 'smooth' });
  }

  function getActiveIndex() {
    const center = viewport.scrollLeft + viewport.clientWidth / 2;
    let best = 0;
    let bestDist = Infinity;

    cards.forEach((card, i) => {
      const x = card.offsetLeft + card.offsetWidth / 2;
      const d = Math.abs(center - x);
      if (d < bestDist) { bestDist = d; best = i; }
    });
    return best;
  }

  function updateDots() {
    const i = getActiveIndex();
    dots.forEach((d, k) => d.classList.toggle('is-active', k === i));
  }

  prevBtn?.addEventListener('click', () => {
    const i = getActiveIndex();
    scrollToIndex(Math.max(0, i - 1));
  });

  nextBtn?.addEventListener('click', () => {
    const i = getActiveIndex();
    scrollToIndex(Math.min(cards.length - 1, i + 1));
  });

  viewport.addEventListener('scroll', () => requestAnimationFrame(updateDots));

  updateDots();
})();

/* Tracking clics tel / booking */
(function(){
  function track(name, data){
    console.log("[track]", name, data || {});
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if(!a) return;

    if(a.href.startsWith("tel:")) track("click_call", { href: a.href });
    if(a.href.includes("fresha.com")) track("click_booking", { href: a.href });
  });
})();

/* HERO CONTACT POPUP */
(function(){
  const trigger = document.querySelector('.hero-contact-trigger');
  const panel = document.querySelector('.hero-contact-panel');
  const closeBtn = document.querySelector('.hero-contact-close');

  if(!trigger || !panel) return;

  function closePanel(){
    panel.classList.remove('is-open');
    panel.setAttribute('aria-hidden', 'true');
    trigger.setAttribute('aria-expanded', 'false');
  }

  function openPanel(){
    panel.classList.add('is-open');
    panel.setAttribute('aria-hidden', 'false');
    trigger.setAttribute('aria-expanded', 'true');
  }

  trigger.addEventListener('click', (e) => {
    e.preventDefault();
    if(panel.classList.contains('is-open')) closePanel();
    else openPanel();
  });

  closeBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    closePanel();
  });

  document.addEventListener('click', (e) => {
    if(!panel.classList.contains('is-open')) return;
    if(e.target.closest('.hero-contact-panel')) return;
    if(e.target.closest('.hero-contact-trigger')) return;
    closePanel();
  });

  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape') closePanel();
  });
})();

/* Body map interactions */
(function(){
  const root = document.querySelector('[data-bodymap]');
  if(!root) return;

  const tags = [...root.querySelectorAll('.bodymap__tag')];
  const titleEl = root.querySelector('[data-bodymap-title]');
  const textEl = root.querySelector('[data-bodymap-text]');
  if(!tags.length || !titleEl || !textEl) return;

  const defaultTitle = titleEl.textContent.trim();
  const defaultText = textEl.textContent.trim();
  let lockedTag = null;

  function render(tag){
    titleEl.textContent = tag.dataset.title || defaultTitle;
    textEl.textContent = tag.dataset.text || defaultText;
    tags.forEach((item) => {
      const on = item === tag;
      item.classList.toggle('is-active', on);
      item.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }

  function reset(){
    titleEl.textContent = defaultTitle;
    textEl.textContent = defaultText;
    tags.forEach((item) => {
      item.classList.remove('is-active');
      item.setAttribute('aria-pressed', 'false');
    });
  }

  tags.forEach((tag) => {
    tag.setAttribute('aria-pressed', 'false');

    tag.addEventListener('mouseenter', () => {
      render(tag);
    });

    tag.addEventListener('focus', () => {
      render(tag);
    });

    tag.addEventListener('mouseleave', () => {
      if(lockedTag) render(lockedTag);
      else reset();
    });

    tag.addEventListener('blur', () => {
      if(lockedTag) render(lockedTag);
      else reset();
    });

    tag.addEventListener('click', () => {
      if(lockedTag === tag){
        lockedTag = null;
        reset();
        return;
      }

      lockedTag = tag;
      render(lockedTag);
    });
  });

  document.addEventListener('keydown', (e) => {
    if(e.key !== 'Escape') return;
    if(!lockedTag) return;

    lockedTag = null;
    reset();
  });
})();


