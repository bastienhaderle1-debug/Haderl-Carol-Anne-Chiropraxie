/* index.js */

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

  const figure = root.querySelector('.bodymap__figure');
  const tags = [...root.querySelectorAll('.bodymap__tag')];
  if(!figure || !tags.length) return;

  const popups = new Map();
  let activeTag = null;
  let lockedTag = null;

  function hidePopup(tag){
    const popup = popups.get(tag);
    if(!popup) return;
    popup.hidden = true;
    popup.setAttribute('aria-hidden', 'true');
    popup.style.left = '';
    popup.style.top = '';
  }

  function placePopup(tag, popup){
    const gap = window.matchMedia('(max-width:520px)').matches ? 8 : 12;
    const edge = 8;
    const figureRect = figure.getBoundingClientRect();
    const tagRect = tag.getBoundingClientRect();
    const isRightSide = (tagRect.left + tagRect.width / 2) >= (figureRect.left + figureRect.width / 2);
    const popupWidth = popup.offsetWidth;
    const popupHeight = popup.offsetHeight;

    let left = isRightSide
      ? (tagRect.left - figureRect.left - popupWidth - gap)
      : (tagRect.right - figureRect.left + gap);

    const minLeft = edge - figureRect.left;
    const maxLeft = window.innerWidth - edge - figureRect.left - popupWidth;
    if(maxLeft >= minLeft){
      left = Math.min(Math.max(left, minLeft), maxLeft);
    }

    let top = (tagRect.top - figureRect.top) + (tagRect.height / 2);
    const minTop = (edge + popupHeight / 2) - figureRect.top;
    const maxTop = (window.innerHeight - edge - popupHeight / 2) - figureRect.top;
    if(maxTop >= minTop){
      top = Math.min(Math.max(top, minTop), maxTop);
    }

    popup.style.top = `${top}px`;
    popup.style.left = `${left}px`;
  }

  function showPopup(tag){
    const popup = popups.get(tag);
    if(!popup) return;
    popup.hidden = false;
    popup.setAttribute('aria-hidden', 'false');
    placePopup(tag, popup);
  }

  function setActive(tag){
    activeTag = tag;
    tags.forEach((item) => {
      const isCurrent = item === tag;
      item.classList.toggle('is-active', isCurrent);
      item.setAttribute('aria-pressed', isCurrent ? 'true' : 'false');
      item.setAttribute('aria-expanded', isCurrent ? 'true' : 'false');
      if(isCurrent) showPopup(item);
      else hidePopup(item);
    });
  }

  function createPopup(tag, index){
    const popup = document.createElement('div');
    popup.className = 'bodymap__tagPopup';
    popup.hidden = true;
    popup.setAttribute('aria-hidden', 'true');
    popup.id = `bodymap-popup-${index + 1}`;

    const close = document.createElement('button');
    close.className = 'bodymap__tagPopupClose';
    close.type = 'button';
    close.setAttribute('aria-label', 'Fermer');
    close.innerHTML = '&times;';

    const eyebrow = document.createElement('p');
    eyebrow.className = 'bodymap__eyebrow';
    eyebrow.textContent = 'Indication frequente';

    const title = document.createElement('h3');
    title.className = 'bodymap__panelTitle';
    title.textContent = tag.dataset.title || tag.textContent.trim();

    const text = document.createElement('p');
    text.className = 'bodymap__panelText';
    text.textContent = tag.dataset.text || '';

    close.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      lockedTag = null;
      setActive(null);
    });

    popup.addEventListener('click', (e) => e.stopPropagation());

    popup.append(close, eyebrow, title, text);
    tag.insertAdjacentElement('afterend', popup);
    popups.set(tag, popup);

    tag.setAttribute('aria-pressed', 'false');
    tag.setAttribute('aria-expanded', 'false');
    tag.setAttribute('aria-controls', popup.id);
  }

  tags.forEach((tag, index) => {
    createPopup(tag, index);

    tag.addEventListener('mouseenter', () => {
      if(lockedTag) return;
      setActive(tag);
    });

    tag.addEventListener('focus', () => {
      if(lockedTag) return;
      setActive(tag);
    });

    tag.addEventListener('mouseleave', () => {
      if(lockedTag) setActive(lockedTag);
      else setActive(null);
    });

    tag.addEventListener('blur', () => {
      if(lockedTag) setActive(lockedTag);
      else setActive(null);
    });

    tag.addEventListener('click', (e) => {
      e.stopPropagation();
      if(lockedTag === tag){
        lockedTag = null;
        setActive(null);
        return;
      }

      lockedTag = tag;
      setActive(tag);
    });
  });

  document.addEventListener('click', (e) => {
    if(root.contains(e.target)) return;
    if(!activeTag && !lockedTag) return;
    lockedTag = null;
    setActive(null);
  });

  document.addEventListener('keydown', (e) => {
    if(e.key !== 'Escape') return;
    if(!activeTag && !lockedTag) return;
    lockedTag = null;
    setActive(null);
  });

  window.addEventListener('resize', () => {
    if(!activeTag) return;
    const popup = popups.get(activeTag);
    if(!popup || popup.hidden) return;
    placePopup(activeTag, popup);
  });
})();

/* Body map locker interactions */
(function(){
  const locker = document.querySelector('.bodymap__locker');
  if(!locker) return;

  const buttons = [...locker.querySelectorAll('.bodymap__lockerBtn')];
  const panelHome = locker;
  const panel = locker.querySelector('[data-bodymap-locker-panel]');
  const title = locker.querySelector('[data-bodymap-locker-title]');
  const text = locker.querySelector('[data-bodymap-locker-text]');
  if(!buttons.length || !panel || !title || !text) return;

  let activeButton = null;

  function setActive(button){
    activeButton = button;

    buttons.forEach((item) => {
      const isCurrent = item === button;
      item.classList.toggle('is-active', isCurrent);
      item.setAttribute('aria-pressed', isCurrent ? 'true' : 'false');
      item.setAttribute('aria-expanded', isCurrent ? 'true' : 'false');
    });

    if(!button){
      panel.hidden = true;
      panel.setAttribute('aria-hidden', 'true');
      if(panel.parentElement !== panelHome){
        panelHome.appendChild(panel);
      }
      return;
    }

    const parentItem = button.closest('.bodymap__lockerItem');
    if(parentItem && panel.parentElement !== parentItem){
      parentItem.appendChild(panel);
    }

    title.textContent = button.dataset.title || button.textContent.trim();
    text.textContent = button.dataset.text || '';
    panel.hidden = false;
    panel.setAttribute('aria-hidden', 'false');
  }

  buttons.forEach((button) => {
    button.setAttribute('aria-controls', 'bodymap-locker-panel');
    button.setAttribute('aria-pressed', 'false');
    button.setAttribute('aria-expanded', 'false');

    button.addEventListener('click', (e) => {
      e.stopPropagation();

      if(activeButton === button){
        setActive(null);
        return;
      }

      setActive(button);
    });
  });

  document.addEventListener('click', (e) => {
    if(locker.contains(e.target)) return;
    if(!activeButton) return;
    setActive(null);
  });

  document.addEventListener('keydown', (e) => {
    if(e.key !== 'Escape') return;
    if(!activeButton) return;
    setActive(null);
  });
})();


