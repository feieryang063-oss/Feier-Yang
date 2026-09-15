document.addEventListener('DOMContentLoaded', function () {

  /* ---------- Hero ticker: ensure enough content to loop with no gap ---------- */
  var tickerTrack = document.querySelector('.hero-ticker-track');
  var tickerUnit = tickerTrack && tickerTrack.querySelector('.hero-ticker-unit');
  if (tickerTrack && tickerUnit) {
    var targetWidth = window.innerWidth * 1.5;
    while (tickerTrack.scrollWidth < targetWidth) {
      tickerTrack.appendChild(tickerUnit.cloneNode(true));
    }
    var tileWidth = tickerTrack.scrollWidth;
    var clones = Array.prototype.slice.call(tickerTrack.children);
    clones.forEach(function (node) { tickerTrack.appendChild(node.cloneNode(true)); });
    var pxPerSecond = 55;
    tickerTrack.style.animationDuration = (tileWidth / pxPerSecond) + 's';
  }

  /* ---------- "Work" section heading: letters stretch to the container's right edge ---------- */
  var stretchHeading = document.querySelector('.stretch-heading');
  if (stretchHeading) {
    var stretchWrap = stretchHeading.closest('.wrap');
    var applyStretch = function () {
      stretchHeading.style.letterSpacing = '';
      var wrapRect = stretchWrap.getBoundingClientRect();
      var wrapPaddingRight = parseFloat(getComputedStyle(stretchWrap).paddingRight) || 0;
      var contentRight = wrapRect.right - wrapPaddingRight;
      var headingLeft = stretchHeading.getBoundingClientRect().left;
      var naturalWidth = stretchHeading.getBoundingClientRect().width;
      var gaps = stretchHeading.textContent.trim().length;
      var extra = (contentRight - headingLeft) - naturalWidth;
      if (extra > 0 && gaps > 0) {
        stretchHeading.style.letterSpacing = (extra / gaps) + 'px';
      }
    };
    requestAnimationFrame(function () { requestAnimationFrame(applyStretch); });
    window.addEventListener('resize', applyStretch);
  }

  /* ---------- Nav: WORK spreads its letters out to meet RESUME on hover ---------- */
  var navLinksEls = document.querySelectorAll('.nav-links a');
  if (navLinksEls.length >= 3) {
    var workLink = navLinksEls[0];
    var aboutLink = navLinksEls[1];
    var resumeLink = navLinksEls[navLinksEls.length - 1];
    var reduceMotionNav = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduceMotionNav) {
      workLink.addEventListener('mouseenter', function () {
        var startRight = workLink.getBoundingClientRect().right;
        var targetLeft = resumeLink.getBoundingClientRect().left;
        var extra = targetLeft - startRight;
        var gaps = workLink.textContent.trim().length;
        if (extra > 0 && gaps > 0) {
          workLink.style.letterSpacing = (extra / gaps) + 'px';
          aboutLink.style.opacity = '0';
        }
      });
      workLink.addEventListener('mouseleave', function () {
        workLink.style.letterSpacing = '';
        aboutLink.style.opacity = '';
      });
    }
  }

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

  /* ---------- Scroll minimap progress ---------- */
  var minimap = document.querySelector('.scroll-minimap');
  if (minimap) {
    var minimapSections = minimap.querySelectorAll('.scroll-minimap-section');
    var updateMinimap = function () {
      var scrollable = document.documentElement.scrollHeight - window.innerHeight;
      var pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
      pct = Math.min(100, Math.max(0, pct));
      var activeIndex = Math.min(minimapSections.length - 1, Math.floor(pct / 100 * minimapSections.length));
      minimapSections.forEach(function (section, i) {
        section.classList.toggle('is-active', i === activeIndex);
      });
    };
    updateMinimap();
    window.addEventListener('scroll', updateMinimap, { passive: true });
    window.addEventListener('resize', updateMinimap);
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
