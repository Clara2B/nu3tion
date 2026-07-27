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
    setupVideoMute();
    setupStockModal();
    setupPhoneMask();
    setupAjaxAddToCart();
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

  /* ---------- Mudo/som do video de preparo ---------- */
  function setupVideoMute() {
    var video = document.getElementById('prepVideo');
    var btn = document.getElementById('videoMuteBtn');
    if (!video || !btn) return;
    var iconMuted = btn.querySelector('.icon-muted');
    var iconUnmuted = btn.querySelector('.icon-unmuted');

    btn.addEventListener('click', function () {
      video.muted = !video.muted;
      btn.setAttribute('aria-pressed', String(!video.muted));
      btn.setAttribute('aria-label', video.muted ? 'Ativar som do vídeo' : 'Silenciar vídeo');
      if (video.muted) {
        iconMuted.removeAttribute('hidden');
        iconUnmuted.setAttribute('hidden', '');
      } else {
        iconMuted.setAttribute('hidden', '');
        iconUnmuted.removeAttribute('hidden');
      }
    });
  }

  /* ---------- Popup de "produto esgotado" (aparece ao clicar no botao desabilitado) ---------- */
  function setupStockModal() {
    var trigger = document.getElementById('outOfStockBtn');
    var modal = document.getElementById('stockModal');
    var backdrop = document.getElementById('stockModalBackdrop');
    var closeBtn = document.getElementById('stockModalClose');
    var okBtn = document.getElementById('stockModalOk');
    if (!trigger || !modal || !backdrop) return;

    function openModal() {
      modal.classList.add('is-open');
      backdrop.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
    }
    function closeModal() {
      modal.classList.remove('is-open');
      backdrop.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
    }

    trigger.addEventListener('click', openModal);
    backdrop.addEventListener('click', closeModal);
    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (okBtn) okBtn.addEventListener('click', closeModal);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeModal();
    });
  }

  /* ---------- Toast de carrinho (sucesso/erro) ---------- */
  var toastTimer = null;

  function dismissToast(toastEl) {
    if (!toastEl || toastEl.classList.contains('is-leaving')) return;
    toastEl.classList.add('is-leaving');
    setTimeout(function () {
      if (toastEl.parentNode) toastEl.parentNode.removeChild(toastEl);
    }, 260);
  }

  function showCartToast(type, message, opts) {
    var region = document.getElementById('cartToastRegion');
    if (!region) return;

    // Nunca duplica: remove qualquer toast ja visivel antes de mostrar o novo.
    clearTimeout(toastTimer);
    Array.prototype.forEach.call(region.querySelectorAll('.toast'), function (t) {
      if (t.parentNode) t.parentNode.removeChild(t);
    });

    opts = opts || {};
    var toast = document.createElement('div');
    toast.className = 'toast toast--' + type;
    toast.setAttribute('role', 'status');

    var iconPath = type === 'success'
      ? '<path d="M20 6 9 17l-5-5"/>'
      : '<circle cx="12" cy="12" r="9"/><path d="M12 8v5M12 16h.01"/>';

    var detailHtml = opts.detail ? '<p class="toast-detail">' + opts.detail + '</p>' : '';
    var actionsHtml = '';
    if (type === 'success') {
      actionsHtml =
        '<div class="toast-actions">' +
          (opts.cartUrl ? '<a href="' + opts.cartUrl + '" class="toast-btn toast-btn--primary">Ver carrinho</a>' : '') +
          '<button type="button" class="toast-btn toast-btn--ghost" data-toast-dismiss>Continuar comprando</button>' +
        '</div>';
    }

    toast.innerHTML =
      '<div class="toast-icon"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2">' + iconPath + '</svg></div>' +
      '<div class="toast-body">' +
        '<p class="toast-title">' + message + '</p>' +
        detailHtml +
        actionsHtml +
      '</div>' +
      '<button type="button" class="toast-close" aria-label="Fechar aviso">×</button>';

    region.appendChild(toast);

    toast.querySelector('.toast-close').addEventListener('click', function () { dismissToast(toast); });
    var dismissBtn = toast.querySelector('[data-toast-dismiss]');
    if (dismissBtn) dismissBtn.addEventListener('click', function () { dismissToast(toast); });

    toastTimer = setTimeout(function () { dismissToast(toast); }, 6000);
  }

  /* ---------- Adicionar ao carrinho via AJAX (sem recarregar a pagina) ----------
   * O formulario nativo do WooCommerce (form.cart) por padrao faz um POST
   * tradicional com reload completo — e essa e a causa real da demora
   * percebida ao clicar em "Adicionar ao carrinho". Aqui interceptamos o
   * submit e chamamos o endpoint AJAX nativo do proprio WooCommerce
   * (wc-ajax=add_to_cart), reaproveitando a resposta (fragments) que ele ja
   * devolve para atualizar so o contador do carrinho, sem tocar no resto da
   * pagina. So mostra o pop-up de sucesso depois da confirmacao real do
   * servidor — nunca antes.
   */
  function setupAjaxAddToCart() {
    var form = document.querySelector('.product-panel form.cart');
    if (!form || typeof wc_add_to_cart_params === 'undefined') return;

    var wrapper = form.closest('[data-product-id]');
    var productId = wrapper ? wrapper.getAttribute('data-product-id') : null;
    if (!productId) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var btn = form.querySelector('.single_add_to_cart_button');
      if (!btn || btn.classList.contains('is-loading')) return; // trava clique duplicado

      var qtyField = form.querySelector('input[name="quantity"]');
      var quantity = qtyField ? qtyField.value : '1';
      var productName = document.querySelector('.product-title');
      productName = productName ? productName.textContent.trim() : '';

      btn.classList.add('is-loading');

      var formData = new FormData(form);
      formData.set('product_id', productId);
      formData.set('quantity', quantity);

      var ajaxUrl = wc_add_to_cart_params.wc_ajax_url.toString().replace('%%endpoint%%', 'add_to_cart');

      fetch(ajaxUrl, { method: 'POST', body: formData, credentials: 'same-origin' })
        .then(function (res) {
          if (!res.ok) throw new Error('Resposta HTTP ' + res.status);
          return res.json();
        })
        .then(function (response) {
          btn.classList.remove('is-loading');

          if (!response || response.error) {
            showCartToast('error', 'Não foi possível adicionar o produto. Tente novamente.');
            return;
          }

          if (response.fragments) {
            Object.keys(response.fragments).forEach(function (selector) {
              document.querySelectorAll(selector).forEach(function (el) {
                el.outerHTML = response.fragments[selector];
              });
            });
          }

          document.body.dispatchEvent(new CustomEvent('wc_fragment_refresh'));

          showCartToast('success', 'Produto adicionado ao carrinho com sucesso.', {
            detail: quantity + 'x ' + productName,
            cartUrl: wc_add_to_cart_params.cart_url
          });
        })
        .catch(function (err) {
          btn.classList.remove('is-loading');
          console.error('Erro ao adicionar ao carrinho:', err); // fica visivel no console pra depuracao, sem esconder do usuario
          showCartToast('error', 'Não foi possível adicionar o produto. Tente novamente.');
        });
    });
  }

  /* ---------- Mascara de telefone: (DDD) 00000-0000 ----------
   * Aplicada via delegacao de evento (funciona em qualquer campo de telefone
   * que exista hoje ou seja adicionado depois via AJAX, sem precisar religar
   * listeners). Cobre:
   *   - #billing_phone: campo nativo do WooCommerce, usado tanto no checkout
   *     classico quanto em Minha Conta > Enderecos (mesmo id nos dois).
   *   - qualquer <input type="tel"> ou com name contendo "phone"/"telefone",
   *     para pegar formularios de contato (ex: WPForms) sem depender de
   *     marcacao especifica de um plugin.
   * So mexe no que o usuario digitou (recalcula a partir dos digitos), entao
   * funciona igual em Android, iPhone, Chrome, Safari e Firefox — nao depende
   * de nenhuma API especifica de teclado, so de value/selectionStart, que sao
   * padrao em qualquer navegador.
   */
  function isPhoneField(el) {
    if (!el || el.tagName !== 'INPUT') return false;
    if (el.id === 'billing_phone') return true;
    if (el.type === 'tel') return true;
    var name = (el.name || '').toLowerCase();
    return name.indexOf('phone') !== -1 || name.indexOf('telefone') !== -1;
  }

  function formatPhoneBR(digits) {
    digits = digits.slice(0, 11);
    if (!digits.length) return '';
    if (digits.length <= 2) return '(' + digits;
    var ddd = digits.slice(0, 2);
    var rest = digits.slice(2);
    if (rest.length <= 5) return '(' + ddd + ') ' + rest;
    return '(' + ddd + ') ' + rest.slice(0, 5) + '-' + rest.slice(5, 9);
  }

  function setupPhoneMask() {
    document.addEventListener('input', function (e) {
      var el = e.target;
      if (!isPhoneField(el)) return;

      var raw = el.value;
      var cursor = el.selectionStart === null ? raw.length : el.selectionStart;
      var digitsBeforeCursor = raw.slice(0, cursor).replace(/\D/g, '').length;

      var digits = raw.replace(/\D/g, '').slice(0, 11);
      var formatted = formatPhoneBR(digits);
      el.value = formatted;

      // Recoloca o cursor logo apos o mesmo numero de digitos que havia antes
      // do cursor, contando dentro do texto ja formatado (evita o cursor
      // "pular" pro fim a cada tecla, que e o que costuma parecer quebrado).
      var seen = 0;
      var pos = formatted.length;
      for (var i = 0; i < formatted.length; i++) {
        if (/\d/.test(formatted[i])) seen++;
        if (seen === digitsBeforeCursor) { pos = i + 1; break; }
      }
      if (digitsBeforeCursor === 0) pos = 0;
      el.setSelectionRange(pos, pos);
    });

    // Cola (paste) tambem passa pelo evento "input" acima na maioria dos
    // navegadores modernos, mas alguns webviews antigos so disparam "paste" —
    // tratamos os dois pra garantir consistencia entre Android/iPhone/desktop.
    document.addEventListener('paste', function (e) {
      if (!isPhoneField(e.target)) return;
      setTimeout(function () {
        var el = e.target;
        var digits = el.value.replace(/\D/g, '').slice(0, 11);
        el.value = formatPhoneBR(digits);
      }, 0);
    });
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
