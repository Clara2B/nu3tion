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
    setupCepAutofill();
    setupVideoModal();
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

  /* ---------- Video de preparo ---------- */
  function setupVideoModal() {
    var openBtn = document.getElementById('watchVideoBtn');
    var modal = document.getElementById('videoModal');
    var backdrop = document.getElementById('videoBackdrop');
    var closeBtn = document.getElementById('videoModalClose');
    var video = document.getElementById('prepVideo');
    if (!openBtn || !modal) return;

    function openVideo() {
      modal.classList.add('is-open');
      backdrop.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      video.play();
    }
    function closeVideo() {
      modal.classList.remove('is-open');
      backdrop.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      video.pause();
      video.currentTime = 0;
    }

    openBtn.addEventListener('click', openVideo);
    closeBtn.addEventListener('click', closeVideo);
    backdrop.addEventListener('click', closeVideo);
  }

  /* ---------- Preenchimento automatico de endereco por CEP (checkout do WooCommerce) ----------
   * Feito para o checkout classico do WooCommerce (campos #billing_postcode,
   * #billing_address_1, #billing_city, #billing_state, #billing_neighborhood).
   * Se a loja usar o checkout novo em blocos (Cart & Checkout blocks), os campos
   * tem outros seletores e este trecho precisa ser adaptado.
   */
  function setupCepAutofill() {
    if (!document.getElementById('billing_postcode')) return;

    document.addEventListener('input', function (e) {
      if (!e.target || e.target.id !== 'billing_postcode') return;

      var digits = e.target.value.replace(/\D/g, '').slice(0, 8);
      e.target.value = digits.length > 5 ? digits.slice(0, 5) + '-' + digits.slice(5) : digits;

      if (digits.length === 8) lookupCep(digits);
    });
  }

  function lookupCep(cep) {
    fetch('https://viacep.com.br/ws/' + cep + '/json/')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.erro) return;

        setFieldValue('billing_address_1', data.logradouro);
        setFieldValue('billing_city', data.localidade);
        setFieldValue('billing_neighborhood', data.bairro); // campo do plugin "Extra Checkout Fields for Brazil", se instalado
        setStateField('billing_state', data.uf);

        var numberField = document.getElementById('billing_number');
        if (numberField) numberField.focus();
      })
      .catch(function () { /* silencioso: preenchimento manual continua funcionando */ });
  }

  function setFieldValue(id, value) {
    var field = document.getElementById(id);
    if (!field || !value) return;
    field.value = value;
    field.dispatchEvent(new Event('change', { bubbles: true }));
  }

  function setStateField(id, uf) {
    var field = document.getElementById(id);
    if (!field || !uf) return;
    // Campo de estado do WooCommerce costuma ser um <select> (as vezes com select2
    // por cima) — usar jQuery quando disponivel garante que o select2 atualize a UI.
    if (window.jQuery) {
      window.jQuery(field).val(uf).trigger('change');
    } else {
      field.value = uf;
      field.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }
})();
