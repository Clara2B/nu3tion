(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    setupHeaderScroll();
    setupMobileMenu();
    setupReveal();
    setupCounters();
    setupCarousel();
    setupAccordion();
    setupNutritionTabs();
  }

  /* ---------- Header ---------- */
  function setupHeaderScroll() {
    var header = document.getElementById('siteHeader');
    if (!header) return;
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    });
  }

  function setupMobileMenu() {
    var btn = document.getElementById('mobileMenuBtn');
    var nav = document.getElementById('mainNav');
    if (!btn || !nav) return;
    btn.addEventListener('click', function () {
      var isOpen = nav.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', isOpen);
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') {
        nav.classList.remove('is-open');
        btn.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- Reveal on scroll ---------- */
  function setupReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!items.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    items.forEach(function (item) { observer.observe(item); });
  }

  /* ---------- Animated counters ---------- */
  function setupCounters() {
    var counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { observer.observe(el); });
  }

  function animateCounter(el) {
    var target = parseFloat(el.dataset.target);
    var suffix = el.dataset.suffix || '';
    var decimals = el.dataset.decimal ? parseInt(el.dataset.decimal, 10) : 0;
    var duration = 900;
    var start = null;

    function step(timestamp) {
      if (!start) start = timestamp;
      var progress = Math.min((timestamp - start) / duration, 1);
      var current = target * progress;
      el.textContent = current.toFixed(decimals) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target.toFixed(decimals) + suffix;
    }
    requestAnimationFrame(step);
  }

  /* ---------- Testimonial carousel (scroll nativo com snap) ---------- */
  function setupCarousel() {
    var track = document.getElementById('carouselTrack');
    var prevBtn = document.getElementById('carouselPrev');
    var nextBtn = document.getElementById('carouselNext');
    var dotsWrap = document.getElementById('carouselDots');
    if (!track) return;

    var cards = Array.from(track.children);
    var scrollTimer = null;

    function perView() {
      if (window.innerWidth <= 640) return 1;
      if (window.innerWidth <= 960) return 2;
      return 3;
    }

    function maxIndex() { return Math.max(0, cards.length - perView()); }

    function cardStep() {
      return cards.length > 1 ? (cards[1].offsetLeft - cards[0].offsetLeft) : cards[0].offsetWidth;
    }

    function currentIndex() {
      return Math.round(track.scrollLeft / cardStep());
    }

    function renderDots() {
      var idx = Math.max(0, Math.min(currentIndex(), maxIndex()));
      dotsWrap.innerHTML = '';
      for (var i = 0; i <= maxIndex(); i++) {
        var dot = document.createElement('span');
        if (i === idx) dot.classList.add('is-active');
        dot.addEventListener('click', function (i) {
          return function () { goTo(i); };
        }(i));
        dotsWrap.appendChild(dot);
      }
    }

    function goTo(newIndex) {
      var idx = Math.max(0, Math.min(newIndex, maxIndex()));
      track.scrollTo({ left: idx * cardStep(), behavior: 'smooth' });
    }

    prevBtn.addEventListener('click', function () { goTo(currentIndex() - 1); });
    nextBtn.addEventListener('click', function () { goTo(currentIndex() + 1); });
    track.addEventListener('scroll', function () {
      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(renderDots, 100);
    }, { passive: true });
    window.addEventListener('resize', renderDots);

    var auto = setInterval(function () {
      var idx = currentIndex();
      goTo(idx + 1 > maxIndex() ? 0 : idx + 1);
    }, 5000);
    function stopAuto() { clearInterval(auto); }
    track.closest('.carousel').addEventListener('mouseenter', stopAuto);
    track.addEventListener('touchstart', stopAuto, { passive: true });

    renderDots();
  }

  /* ---------- FAQ accordion ---------- */
  function setupAccordion() {
    var triggers = document.querySelectorAll('.accordion-trigger');
    triggers.forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        var panel = trigger.nextElementSibling;
        var isOpen = trigger.getAttribute('aria-expanded') === 'true';

        triggers.forEach(function (t) {
          t.setAttribute('aria-expanded', 'false');
          t.nextElementSibling.style.maxHeight = null;
        });

        if (!isOpen) {
          trigger.setAttribute('aria-expanded', 'true');
          panel.style.maxHeight = panel.scrollHeight + 'px';
        }
      });
    });
  }

  /* ---------- Nutrition tabs ---------- */
  function setupNutritionTabs() {
    var buttons = document.querySelectorAll('.nutrition-tab-btn');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var target = btn.getAttribute('data-nutrition-tab');
        buttons.forEach(function (b) { b.classList.toggle('is-active', b === btn); });
        document.querySelectorAll('.nutrition-tab-panel').forEach(function (panel) {
          panel.classList.toggle('is-active', panel.getAttribute('data-nutrition-panel') === target);
        });
      });
    });
  }
})();
