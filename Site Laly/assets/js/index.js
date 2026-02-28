/* index.js */
/* WHY-CHIRO tabs */
(function () {
  const root = document.querySelector('.why-chiro');
  if (!root) return;

  const tabs = [...root.querySelectorAll('.why-chiro__tab')];
  const panels = [...root.querySelectorAll('.why-chiro__panel')];

  const isMobile = () => window.matchMedia('(max-width:980px)').matches;

  function activate(id, { toggle = false } = {}) {
    const panel = panels.find(p => p.id === id);
    const alreadyOpen = panel && panel.classList.contains('is-active');

    if (toggle && isMobile() && alreadyOpen) {
      tabs.forEach(btn => { btn.classList.remove('is-active'); btn.setAttribute('aria-selected', 'false'); });
      panels.forEach(p => p.classList.remove('is-active'));
      return;
    }

    tabs.forEach(btn => {
      const on = btn.dataset.tab === id;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-selected', on ? 'true' : 'false');
    });

    panels.forEach(p => p.classList.toggle('is-active', p.id === id));

    if (isMobile() && panel) {
      setTimeout(() => panel.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
    }
  }

  tabs.forEach(btn => btn.addEventListener('click', () => activate(btn.dataset.tab, { toggle: true })));
})();

/* AVIS carousel: flèches + dots */
(function () {
  const wrap = document.querySelector('.avis__wrap');
  if (!wrap) return;

  const viewport = wrap.querySelector('.avis__viewport');
  const track = wrap.querySelector('.avis__track');
  const cards = [...wrap.querySelectorAll('.avis__card')];
  const dotsWrap = wrap.querySelector('.avis__dots');
  const prevBtn = wrap.querySelector('.avis__nav--prev');
  const nextBtn = wrap.querySelector('.avis__nav--next');

  if (!viewport || !track || cards.length === 0 || !dotsWrap) return;

  // build dots
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
    const left = cardCenterLeft(cards[i]);
    viewport.scrollTo({ left, behavior: 'smooth' });
  }

  function getActiveIndex() {
    // index du plus proche du centre
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

  viewport.addEventListener('scroll', () => {
    window.requestAnimationFrame(updateDots);
  });

  // init
  updateDots();

  (function(){
  function track(name, data){
    // remplace par GA4 plus tard ; pour l’instant log/Debug
    console.log("[track]", name, data || {});
  }

  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if(!a) return;

    if(a.href.startsWith("tel:")) track("click_call", { href: a.href });
    if(a.href.includes("fresha.com")) track("click_booking", { href: a.href });
  });
})();
})();