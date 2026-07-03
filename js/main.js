(function () {
  'use strict';

  var state = {
    product: null,
    quantity: 1,
    cart: JSON.parse(localStorage.getItem('nu3tion_cart') || '[]'),
    checkoutStep: 1
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
    setupCheckout();
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
    var index = 0;

    function perView() {
      if (window.innerWidth <= 640) return 1;
      if (window.innerWidth <= 960) return 2;
      return 3;
    }

    function maxIndex() { return Math.max(0, cards.length - perView()); }

    function renderDots() {
      dotsWrap.innerHTML = '';
      for (var i = 0; i <= maxIndex(); i++) {
        var dot = document.createElement('span');
        if (i === index) dot.classList.add('is-active');
        dot.addEventListener('click', function (i) {
          return function () { goTo(i); };
        }(i));
        dotsWrap.appendChild(dot);
      }
    }

    function goTo(newIndex) {
      index = Math.max(0, Math.min(newIndex, maxIndex()));
      var cardWidth = cards[0].getBoundingClientRect().width + 20;
      track.style.transform = 'translateX(-' + (index * cardWidth) + 'px)';
      renderDots();
    }

    prevBtn.addEventListener('click', function () { goTo(index - 1); });
    nextBtn.addEventListener('click', function () { goTo(index + 1); });
    window.addEventListener('resize', function () { goTo(index); });

    var auto = setInterval(function () {
      goTo(index + 1 > maxIndex() ? 0 : index + 1);
    }, 5000);
    track.closest('.carousel').addEventListener('mouseenter', function () { clearInterval(auto); });

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

  function addToCart(quantity) {
    if (!state.product) return;
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
          '<div class="cart-item-media"></div>' +
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
    var total = cartTotal();
    var discount = payment === 'pix' ? Math.round(total * 0.05 * 100) / 100 : 0;

    var rows = state.cart.map(function (item) {
      return '<p><span>' + item.quantity + 'x ' + item.name + '</span><span>' + formatBRL(item.price * item.quantity) + '</span></p>';
    }).join('');

    summary.innerHTML =
      rows +
      '<p><span>Forma de pagamento</span><span>' + paymentLabels[payment] + '</span></p>' +
      (discount > 0 ? '<p><span>Desconto Pix</span><span>-' + formatBRL(discount) + '</span></p>' : '') +
      '<p><span>Total</span><span>' + formatBRL(total - discount) + '</span></p>';
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
