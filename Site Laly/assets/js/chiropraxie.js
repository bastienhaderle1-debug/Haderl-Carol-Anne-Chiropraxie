/* chiropraxie.js */
(function () {
  const roots = document.querySelectorAll('.why-chiro');
  if (!roots.length) return;

  function isMobile() {
    return window.matchMedia('(max-width:980px)').matches;
  }

  roots.forEach(root => {
    const tabs = Array.from(root.querySelectorAll('.why-chiro__tab'));
    const panels = Array.from(root.querySelectorAll('.why-chiro__panel'));

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
        const isOn = btn.dataset.tab === id;
        btn.classList.toggle('is-active', isOn);
        btn.setAttribute('aria-selected', isOn ? 'true' : 'false');
      });

      panels.forEach(p => p.classList.toggle('is-active', p.id === id));

      if (isMobile() && panel) {
        setTimeout(() => {
          panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 50);
      }
    }

    tabs.forEach(btn => {
      btn.addEventListener('click', () => activate(btn.dataset.tab, { toggle: true }));
    });

    // init : assure qu'un panel est ouvert
    const activeBtn = tabs.find(b => b.classList.contains('is-active')) || tabs[0];
    if (activeBtn) activate(activeBtn.dataset.tab, { toggle: false });
  });
})();