(function () {
  'use strict';

  var state = {
    product: null,
    quantity: 1,
    cart: JSON.parse(localStorage.getItem('nu3tion_cart') || '[]'),
    checkoutStep: 1,
    coupon: null
  };

  var COUPONS = {
    'NU10': 0.10,
    'BEMVINDO15': 0.15
  };

  document.addEventListener('DOMContentLoaded', init);

  function init() {
    fetchProduct();
    setupHeaderScroll();
    setupMobileMenu();
    setupReveal();
    setupCounters();
    setupCarousel();
    setupAccordion();
    setupNutritionTabs();
    setupQuantity();
    setupCart();
    setupCoupon();
    setupCheckout();
    setupVideoMute();
    setupStockModal();
    renderCart();
  }

  function formatBRL(value) {
    return 'R$ ' + value.toFixed(2).replace('.', ',');
  }

  function fetchProduct() {
    fetch('/api/product')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        state.product = data;
        var now = document.querySelectorAll('#heroPriceNow, #productPriceNow');
        var old = document.querySelectorAll('#heroPriceOld, #productPriceOld');
        now.forEach(function (el) { el.textContent = formatBRL(data.price); });
        old.forEach(function (el) { el.textContent = formatBRL(data.originalPrice); });
        applyStockState(data);
      })
      .catch(function () {
        state.product = {
          id: 'oraprotein-acai-abacaxi', name: 'OraProtein', flavor: 'Açaí com Abacaxi',
          price: 159.90, originalPrice: 189.90
        };
      });
  }

  /* ---------- Header ---------- */
  function setupHeaderScroll() {
    var header = document.getElementById('siteHeader');
    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    });
  }

  function setupMobileMenu() {
    var btn = document.getElementById('mobileMenuBtn');
    var nav = document.getElementById('mainNav');
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

  /* ---------- Testimonial carousel ---------- */
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

  /* ---------- Quantity selector ---------- */
  function setupQuantity() {
    var minus = document.getElementById('qtyMinus');
    var plus = document.getElementById('qtyPlus');
    var value = document.getElementById('qtyValue');

    minus.addEventListener('click', function () {
      state.quantity = Math.max(1, state.quantity - 1);
      value.textContent = state.quantity;
    });
    plus.addEventListener('click', function () {
      state.quantity = Math.min(10, state.quantity + 1);
      value.textContent = state.quantity;
    });
  }

  /* ---------- Cart ---------- */
  function persistCart() {
    localStorage.setItem('nu3tion_cart', JSON.stringify(state.cart));
  }

  function isOutOfStock(product) {
    return !!product && product.stock !== undefined && product.stock <= 0;
  }

  function applyStockState(product) {
    var btn = document.getElementById('addToCartBtn');
    if (!btn || !isOutOfStock(product)) return;
    btn.classList.add('is-disabled');
    btn.childNodes[0].textContent = 'Produto esgotado';
  }

  function addToCart(quantity) {
    if (!state.product) return;
    if (isOutOfStock(state.product)) {
      openStockModal();
      return;
    }
    var existing = state.cart.find(function (i) { return i.id === state.product.id; });
    if (existing) existing.quantity += quantity;
    else {
      state.cart.push({
        id: state.product.id,
        name: state.product.name,
        flavor: state.product.flavor,
        price: state.product.price,
        quantity: quantity
      });
    }
    persistCart();
    renderCart();
    pulseCartIcon();
    openCartDrawer();
  }

  function updateItemQty(id, delta) {
    var item = state.cart.find(function (i) { return i.id === id; });
    if (!item) return;
    item.quantity += delta;
    if (item.quantity <= 0) state.cart = state.cart.filter(function (i) { return i.id !== id; });
    persistCart();
    renderCart();
  }

  function removeItem(id) {
    state.cart = state.cart.filter(function (i) { return i.id !== id; });
    persistCart();
    renderCart();
  }

  function cartTotal() {
    return state.cart.reduce(function (sum, i) { return sum + i.price * i.quantity; }, 0);
  }

  function couponDiscountValue() {
    if (!state.coupon) return 0;
    return Math.round(cartTotal() * state.coupon.percent * 100) / 100;
  }

  function pulseCartIcon() {
    var count = document.getElementById('cartCount');
    count.classList.remove('pulse');
    void count.offsetWidth;
    count.classList.add('pulse');
  }

  function renderCart() {
    var wrap = document.getElementById('cartItems');
    var countEl = document.getElementById('cartCount');
    var subtotalEl = document.getElementById('cartSubtotal');
    var checkoutBtn = document.getElementById('checkoutOpenBtn');

    var totalItems = state.cart.reduce(function (sum, i) { return sum + i.quantity; }, 0);
    countEl.textContent = totalItems;

    if (!state.cart.length) {
      wrap.innerHTML = '<p class="cart-empty">Seu carrinho está vazio.</p>';
      checkoutBtn.disabled = true;
    } else {
      wrap.innerHTML = '';
      state.cart.forEach(function (item) {
        var el = document.createElement('div');
        el.className = 'cart-item';
        el.innerHTML =
          '<div class="cart-item-media"><img src="img/Nu3tion 3.avif" alt=""></div>' +
          '<div class="cart-item-info">' +
            '<p>' + item.name + '</p>' +
            '<span>' + item.flavor + ' · ' + formatBRL(item.price) + '</span>' +
            '<div class="cart-item-controls">' +
              '<div class="cart-item-qty">' +
                '<button data-action="minus">−</button>' +
                '<span>' + item.quantity + '</span>' +
                '<button data-action="plus">+</button>' +
              '</div>' +
              '<button class="cart-item-remove" data-action="remove">Remover</button>' +
            '</div>' +
          '</div>';
        el.querySelector('[data-action="minus"]').addEventListener('click', function () { updateItemQty(item.id, -1); });
        el.querySelector('[data-action="plus"]').addEventListener('click', function () { updateItemQty(item.id, 1); });
        el.querySelector('[data-action="remove"]').addEventListener('click', function () { removeItem(item.id); });
        wrap.appendChild(el);
      });
      checkoutBtn.disabled = false;
    }

    subtotalEl.textContent = formatBRL(cartTotal());

    var discount = couponDiscountValue();
    var discountRow = document.getElementById('cartDiscountRow');
    var totalRow = document.getElementById('cartTotalRow');
    if (state.coupon && discount > 0) {
      document.getElementById('couponCodeLabel').textContent = state.coupon.code;
      document.getElementById('cartDiscountValue').textContent = '-' + formatBRL(discount);
      document.getElementById('cartTotalValue').textContent = formatBRL(cartTotal() - discount);
      discountRow.hidden = false;
      totalRow.hidden = false;
    } else {
      discountRow.hidden = true;
      totalRow.hidden = true;
    }
  }

  function openCartDrawer() {
    document.getElementById('cartDrawer').classList.add('is-open');
    document.getElementById('cartBackdrop').classList.add('is-open');
    document.getElementById('cartDrawer').setAttribute('aria-hidden', 'false');
  }
  function closeCartDrawer() {
    document.getElementById('cartDrawer').classList.remove('is-open');
    document.getElementById('cartBackdrop').classList.remove('is-open');
    document.getElementById('cartDrawer').setAttribute('aria-hidden', 'true');
  }

  function setupCart() {
    document.getElementById('addToCartBtn').addEventListener('click', function () {
      addToCart(state.quantity);
    });
    document.getElementById('cartToggle').addEventListener('click', openCartDrawer);
    document.getElementById('cartClose').addEventListener('click', closeCartDrawer);
    document.getElementById('cartBackdrop').addEventListener('click', closeCartDrawer);
  }

  /* ---------- Cupom de desconto ---------- */
  function setupCoupon() {
    var input = document.getElementById('couponInput');
    var btn = document.getElementById('couponApplyBtn');
    var message = document.getElementById('couponMessage');

    function showMessage(text, type) {
      message.textContent = text;
      message.className = 'cart-coupon-message' + (type ? ' is-' + type : '');
    }

    function applyOrRemove() {
      if (state.coupon) {
        state.coupon = null;
        input.value = '';
        input.disabled = false;
        btn.textContent = 'Aplicar';
        showMessage('', '');
        renderCart();
        return;
      }

      var code = input.value.trim().toUpperCase();
      if (!code) return;

      if (COUPONS.hasOwnProperty(code)) {
        state.coupon = { code: code, percent: COUPONS[code] };
        input.value = code;
        input.disabled = true;
        btn.textContent = 'Remover';
        showMessage('Cupom aplicado: ' + Math.round(COUPONS[code] * 100) + '% de desconto.', 'success');
      } else {
        showMessage('Cupom inválido ou expirado.', 'error');
      }
      renderCart();
    }

    btn.addEventListener('click', applyOrRemove);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyOrRemove();
      }
    });
  }

  /* ---------- Checkout ---------- */
  function goToStep(step) {
    state.checkoutStep = step;
    document.querySelectorAll('.checkout-step').forEach(function (el) {
      el.classList.toggle('is-active', el.dataset.step == step);
    });
    document.querySelector('.checkout-progress').style.display = step === 'success' ? 'none' : 'flex';
    document.querySelectorAll('.checkout-dot').forEach(function (dot) {
      dot.classList.toggle('is-active', parseInt(dot.dataset.step, 10) <= step);
    });
    if (step === 3) renderSummary();
  }

  function renderSummary() {
    var summary = document.getElementById('checkoutSummary');
    var form = document.getElementById('checkoutForm');
    var payment = form.querySelector('input[name="paymentMethod"]:checked').value;
    var paymentLabels = { pix: 'Pix', cartao: 'Cartão de crédito', boleto: 'Boleto bancário' };
    var couponDiscount = couponDiscountValue();
    var afterCoupon = cartTotal() - couponDiscount;
    var pixDiscount = payment === 'pix' ? Math.round(afterCoupon * 0.05 * 100) / 100 : 0;

    var rows = state.cart.map(function (item) {
      return '<p><span>' + item.quantity + 'x ' + item.name + '</span><span>' + formatBRL(item.price * item.quantity) + '</span></p>';
    }).join('');

    summary.innerHTML =
      rows +
      '<p><span>Forma de pagamento</span><span>' + paymentLabels[payment] + '</span></p>' +
      (couponDiscount > 0 ? '<p><span>Cupom (' + state.coupon.code + ')</span><span>-' + formatBRL(couponDiscount) + '</span></p>' : '') +
      (pixDiscount > 0 ? '<p><span>Desconto Pix</span><span>-' + formatBRL(pixDiscount) + '</span></p>' : '') +
      '<p><span>Total</span><span>' + formatBRL(afterCoupon - pixDiscount) + '</span></p>';
  }

  function openCheckout() {
    if (!state.cart.length) return;
    closeCartDrawer();
    goToStep(1);
    document.getElementById('checkoutModal').classList.add('is-open');
    document.getElementById('checkoutBackdrop').classList.add('is-open');
    document.getElementById('checkoutModal').setAttribute('aria-hidden', 'false');
  }

  function closeCheckout() {
    document.getElementById('checkoutModal').classList.remove('is-open');
    document.getElementById('checkoutBackdrop').classList.remove('is-open');
    document.getElementById('checkoutModal').setAttribute('aria-hidden', 'true');
  }

  /* ---------- Popup de "produto esgotado" ---------- */
  function openStockModal() {
    document.getElementById('stockModal').classList.add('is-open');
    document.getElementById('stockModalBackdrop').classList.add('is-open');
    document.getElementById('stockModal').setAttribute('aria-hidden', 'false');
  }

  function closeStockModal() {
    document.getElementById('stockModal').classList.remove('is-open');
    document.getElementById('stockModalBackdrop').classList.remove('is-open');
    document.getElementById('stockModal').setAttribute('aria-hidden', 'true');
  }

  function setupStockModal() {
    var modal = document.getElementById('stockModal');
    if (!modal) return;
    document.getElementById('stockModalBackdrop').addEventListener('click', closeStockModal);
    document.getElementById('stockModalClose').addEventListener('click', closeStockModal);
    document.getElementById('stockModalOk').addEventListener('click', closeStockModal);
  }

  function setupCheckout() {
    document.getElementById('checkoutOpenBtn').addEventListener('click', openCheckout);
    document.getElementById('checkoutClose').addEventListener('click', closeCheckout);
    document.getElementById('checkoutBackdrop').addEventListener('click', closeCheckout);

    document.querySelectorAll('.checkout-next').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var form = document.getElementById('checkoutForm');
        var current = form.querySelector('.checkout-step.is-active');
        if (!validateStep(current)) return;
        goToStep(parseInt(btn.dataset.next, 10));
      });
    });
    document.querySelectorAll('.checkout-back').forEach(function (btn) {
      btn.addEventListener('click', function () { goToStep(parseInt(btn.dataset.back, 10)); });
    });

    var paymentRadios = document.querySelectorAll('input[name="paymentMethod"]');
    var cardFields = document.getElementById('cardFields');
    paymentRadios.forEach(function (radio) {
      radio.addEventListener('change', function () {
        cardFields.hidden = radio.value !== 'cartao' || !radio.checked;
      });
    });

    var cepInput = document.getElementById('cepInput');
    cepInput.addEventListener('input', function () {
      var digits = cepInput.value.replace(/\D/g, '').slice(0, 8);
      cepInput.value = digits.length > 5 ? digits.slice(0, 5) + '-' + digits.slice(5) : digits;
      if (digits.length === 8) lookupCep(digits);
    });

    document.getElementById('checkoutForm').addEventListener('submit', function (e) {
      e.preventDefault();
      submitOrder();
    });

    document.getElementById('successCloseBtn').addEventListener('click', function () {
      closeCheckout();
      document.getElementById('checkoutForm').reset();
      goToStep(1);
    });
  }

  /* ---------- Mudo/som do vídeo de preparo ---------- */
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

  function lookupCep(cep) {
    fetch('https://viacep.com.br/ws/' + cep + '/json/')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data.erro) return;
        document.getElementById('addressInput').value = data.logradouro || '';
        document.getElementById('cityInput').value = data.localidade || '';
        document.getElementById('stateInput').value = data.uf || '';
      })
      .catch(function () { /* silencioso: CEP manual continua funcionando */ });
  }

  function validateStep(stepEl) {
    var inputs = stepEl.querySelectorAll('input[required]');
    for (var i = 0; i < inputs.length; i++) {
      if (!inputs[i].value.trim()) {
        inputs[i].focus();
        return false;
      }
    }
    return true;
  }

  function submitOrder() {
    var form = document.getElementById('checkoutForm');
    var formData = new FormData(form);
    var customer = {
      name: formData.get('name'),
      email: formData.get('email'),
      cep: formData.get('cep'),
      city: formData.get('city'),
      state: formData.get('state'),
      address: formData.get('address')
    };
    var paymentMethod = formData.get('paymentMethod');
    var confirmBtn = document.getElementById('confirmOrderBtn');
    confirmBtn.disabled = true;
    confirmBtn.textContent = 'Enviando...';

    fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customer: customer, items: state.cart, paymentMethod: paymentMethod })
    })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Confirmar pedido';
        if (!data.success) {
          alert(data.message || 'Não foi possível concluir o pedido.');
          return;
        }
        document.getElementById('successOrderNumber').textContent = data.orderNumber;
        document.getElementById('successDelivery').textContent = data.estimatedDelivery;
        state.cart = [];
        persistCart();
        renderCart();
        goToStep('success');
      })
      .catch(function () {
        confirmBtn.disabled = false;
        confirmBtn.textContent = 'Confirmar pedido';
        alert('Erro de conexão. Tente novamente.');
      });
  }
})();
