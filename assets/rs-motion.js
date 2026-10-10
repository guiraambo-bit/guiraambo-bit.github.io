/* Rancho Salim — animações leves (sem dependências).
   Blur Fade ao rolar + Staggered Text no hero. Respeita "reduzir movimento" do sistema. */
(function () {
  var doc = document, root = doc.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || !('IntersectionObserver' in window)) return;
  root.className += ' rs-js';

  function splitWords(el) {
    if (el.getAttribute('data-rs-split')) return;
    var text = (el.textContent || '').replace(/\s+/g, ' ').trim();
    if (!text) return;
    el.setAttribute('aria-label', text);
    el.setAttribute('data-rs-split', '1');
    el.innerHTML = '';
    text.split(' ').forEach(function (word, i) {
      var s = doc.createElement('span');
      s.className = 'rs-word';
      s.setAttribute('aria-hidden', 'true');
      s.style.setProperty('--i', i);
      s.textContent = word;
      el.appendChild(s);
      el.appendChild(doc.createTextNode(' '));
    });
  }

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

  var REVEAL = '.index-sections .home__subtitle, .index-sections .homepage-collection .grid-uniform, ' +
    '.index-sections .homepage-collection-grid .grid__item, .index-sections .homepage-columns .grid__item, .index-sections .rs-marquee';

  function init(scope) {
    scope = scope || doc;
    Array.prototype.forEach.call(scope.querySelectorAll('.homepage-slideshow .title--flex'), splitWords);
    Array.prototype.forEach.call(scope.querySelectorAll(REVEAL), function (el) {
      if (el.getAttribute('data-rs-r')) return;
      el.setAttribute('data-rs-r', '1');
      // o que já está visível ao carregar não anima (evita piscar)
      var r = el.getBoundingClientRect();
      if (r.top < window.innerHeight * 0.92) return;
      var sib = 0, p = el.previousElementSibling;
      while (p && p.classList.contains('rs-reveal')) { sib++; p = p.previousElementSibling; }
      el.style.setProperty('--rs-d', Math.min(sib, 4) * 0.09 + 's');
      el.classList.add('rs-reveal');
      io.observe(el);
    });
  }

  init();
  doc.addEventListener('shopify:section:load', function (e) { init(e.target); });

  // se o slideshow não iniciar, o texto não pode ficar escondido
  setTimeout(function () {
    if (doc.querySelector('.homepage-slideshow') && !doc.querySelector('.homepage-slideshow .slick-active')) root.className += ' rs-nofx';
  }, 2500);
})();
