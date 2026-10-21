(function () {
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  var mobileBar = document.querySelector('.mobile-bar');
  var heroCtas = document.querySelector('.hero .hero-ctas');

  // Header state + mobile action bar
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 10);
    if (mobileBar && heroCtas) {
      mobileBar.classList.toggle('is-visible', heroCtas.getBoundingClientRect().bottom < 0);
    }
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Mobile menu
  function setMenu(open) {
    header.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }
  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setMenu(false);
  });

  // Live New York clock
  var clock = document.querySelector('[data-nyc-clock]');
  if (clock) {
    var fmt = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit' });
    var tick = function () { clock.textContent = fmt.format(new Date()); };
    tick();
    setInterval(tick, 15000);
  }

  // Hero slideshow: load slides 2 and 3 after the page has finished loading
  if (!reduceMotion) {
    window.addEventListener('load', function () {
      setTimeout(function () {
        document.querySelectorAll('.hero-media [data-srcset]').forEach(function (el) {
          el.setAttribute('srcset', el.getAttribute('data-srcset'));
        });
        document.querySelectorAll('.hero-media [data-src]').forEach(function (el) {
          el.setAttribute('src', el.getAttribute('data-src'));
        });
      }, 1200);
    });
  }

  // Destination rotator
  var rotator = document.querySelector('[data-rotator]');
  if (rotator && !reduceMotion) {
    var words = rotator.querySelectorAll('.rotator-word');
    var i = 0;
    setInterval(function () {
      var current = words[i];
      i = (i + 1) % words.length;
      current.classList.remove('is-active');
      current.classList.add('is-leaving');
      words[i].classList.remove('is-leaving');
      words[i].classList.add('is-active');
      setTimeout(function () { current.classList.remove('is-leaving'); }, 650);
    }, 2400);
  }

  // Count-up numbers
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    if (reduceMotion) { el.textContent = target; return; }
    var start = null;
    var dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    el.textContent = '0';
    requestAnimationFrame(step);
  }

  // Reveal on scroll
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        entry.target.querySelectorAll('[data-count]').forEach(countUp);
        io.unobserve(entry.target);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });

    // Active nav link
    var links = nav.querySelectorAll('ul a');
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    links.forEach(function (a) {
      var sec = document.querySelector(a.getAttribute('href'));
      if (sec) spy.observe(sec);
    });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  // Pause looping animations while they are off screen (saves style/paint work)
  if ('IntersectionObserver' in window && !reduceMotion) {
    var animIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle('anim-paused', !entry.isIntersecting);
      });
    }, { rootMargin: '100px 0px' });
    document.querySelectorAll('.topbar, .hero, .marquee, .btn-shine, .route-map, .why-logo, .final-media').forEach(function (el) {
      animIO.observe(el);
    });
  }

  // Parallax (service area photo)
  var para = document.querySelector('[data-parallax]');
  if (para && !reduceMotion) {
    var ticking = false;
    var update = function () {
      var r = para.parentElement.getBoundingClientRect();
      var progress = (window.innerHeight - r.top) / (window.innerHeight + r.height);
      para.style.transform = 'translate3d(0,' + (-progress * 16).toFixed(2) + '%,0)';
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
    update();
  }

  var year = document.querySelector('[data-year]');
  if (year) year.textContent = new Date().getFullYear();

  // Reservation click tracking (GA4 / GTM if installed)
  document.addEventListener('click', function (e) {
    var link = e.target.closest('[data-book]');
    if (!link) return;
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'begin_reservation', { link_url: link.href, link_text: link.textContent.trim() });
    }
    if (window.dataLayer) window.dataLayer.push({ event: 'begin_reservation' });
  });
})();
