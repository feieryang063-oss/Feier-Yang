document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Nav mobile toggle ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var links = document.querySelector('.nav-links');
  if (toggle && links) {
    var syncExpanded = function () {
      toggle.setAttribute('aria-expanded', links.classList.contains('open'));
    };
    syncExpanded();
    toggle.addEventListener('click', function () { links.classList.toggle('open'); syncExpanded(); });
    links.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { links.classList.remove('open'); syncExpanded(); });
    });
  }

  /* ---------- Eyes: track cursor ---------- */
  var eyes = document.querySelectorAll('.eye');
  var pupilRange = 5;
  document.addEventListener('mousemove', function (e) {
    eyes.forEach(function (eye) {
      var rect = eye.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      var dx = e.clientX - cx;
      var dy = e.clientY - cy;
      var angle = Math.atan2(dy, dx);
      var dist = Math.min(pupilRange, Math.hypot(dx, dy) / 14);
      var px = Math.cos(angle) * dist;
      var py = Math.sin(angle) * dist;
      var pupil = eye.querySelector('.pupil');
      pupil.style.transform = 'translate(calc(-50% + ' + px.toFixed(1) + 'px), calc(-50% + ' + py.toFixed(1) + 'px))';
    });
  });

  /* ---------- Eyes: random blink ---------- */
  function scheduleBlink() {
    var delay = 2200 + Math.random() * 4200;
    setTimeout(function () {
      eyes.forEach(function (eye) { eye.classList.add('blink'); });
      setTimeout(function () {
        eyes.forEach(function (eye) { eye.classList.remove('blink'); });
      }, 160);
      scheduleBlink();
    }, delay);
  }
  if (eyes.length) scheduleBlink();

  /* ---------- Bunny: sway with scroll, like wind ---------- */
  var bunny = document.querySelector('.bunny-anchor');
  if (bunny) {
    var ticking = false;
    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        var y = window.scrollY;
        var tilt = Math.sin(y / 260) * 6;
        bunny.style.transform = 'rotate(' + tilt.toFixed(2) + 'deg)';
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- Scroll-in reveal ---------- */
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealSelectors = '.section-head, .work-item, .about-grid, .project-section, .project-cover, .project-links, .project-video';
  var revealEls = document.querySelectorAll(revealSelectors);
  if (revealEls.length && !reduceMotion && 'IntersectionObserver' in window) {
    revealEls.forEach(function (el) { el.classList.add('reveal'); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Filters ---------- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var cards = document.querySelectorAll('[data-category]');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var cat = btn.getAttribute('data-filter');
      cards.forEach(function (card) {
        var show = cat === 'all' || card.getAttribute('data-category') === cat;
        card.style.display = show ? '' : 'none';
      });
    });
  });
});
