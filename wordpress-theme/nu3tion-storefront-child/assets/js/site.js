(function () {
  'use strict';

  /* ---------- Bloqueia o evento automatico indesejado "SubscribedButtonClick" ----------
   * O recurso de deteccao automatica de eventos do proprio Meta Pixel insiste
   * em disparar "SubscribedButtonClick" em varios cliques do site, mesmo
   * depois de desativado nas configuracoes da conta (Events Manager > Site
   * Nu3tion WP > Configuracoes > "Rastrear eventos automaticamente sem
   * codigo") — o toggle nao teve efeito pratico, mesmo horas depois de
   * desativado. Como isso e' um recurso interno do proprio SDK da Meta, fora
   * do nosso controle direto, intercepta aqui a funcao fbq() e bloqueia
   * especificamente qualquer chamada relacionada a esse evento antes dela
   * seguir pro pixel de verdade — sem afetar nenhum outro evento (AddToCart,
   * ViewContent, Lead etc. continuam passando normalmente).
   *
   * Roda imediatamente (fora do DOMContentLoaded) pra interceptar o quanto
   * antes, com algumas tentativas caso o script do pixel demore um pouco
   * pra definir "window.fbq".
   */
  function setupBlockUnwantedFbqEvent() {
    var blocked = ['SubscribedButtonClick'];
    var attempts = 0;

    function tryWrap() {
      attempts++;
      if (typeof window.fbq === 'function' && !window.fbq.__nu3tionBlocklist) {
        var original = window.fbq;

        var wrapped = function () {
          var args = Array.prototype.slice.call(arguments);
          var isBlocked = args.some(function (arg) {
            return typeof arg === 'string' && blocked.indexOf(arg) !== -1;
          });
          if (isBlocked) return;
          return original.apply(this, args);
        };

        wrapped.__nu3tionBlocklist = true;
        // Preserva propriedades do fbq original (queue, callMethod, etc.)
        // que o proprio SDK do Meta usa internamente.
        for (var key in original) {
          if (Object.prototype.hasOwnProperty.call(original, key)) wrapped[key] = original[key];
        }
        window.fbq = wrapped;
        return;
      }
      if (attempts < 20) setTimeout(tryWrap, 250); // tenta por ate 5s
    }

    tryWrap();
  }
  setupBlockUnwantedFbqEvent();

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
    setupPhoneDDDPrefix();
    setupVideoMute();
    setupProductQuantityStepper();
    setupAddToCartIcon();
    setupAjaxAddToCart();
    setupMobileCartFloat();
    setupCartDrawer();
    setupCartDrawerEnhancements();
    setupWooCheckoutSteps();
    setupOrderPaymentWatcher();
    setupStockModal();
    setupViewContentTracking();
  }

  /* ---------- Dispara ViewContent (Meta Pixel) nos CTAs que levam ao produto ----------
   * O produto nao tem pagina propria nesse site — fica todo na secao
   * "Comprar" da home, acessada por ancora (#comprar). Entao "ver o
   * produto" = clicar em qualquer CTA que leva pra essa secao (o "Compre
   * Agora" do header, e os varios "Experimentar/Quero o OraProtein®"
   * espalhados pela pagina). Um unico listener delegado no documento cobre
   * todos eles de uma vez, sem precisar de uma regra por botao na
   * ferramenta visual do Meta (que se mostrou pouco confiavel nesse site —
   * ver ViewCart e Lead, que tambem foram resolvidos assim).
   */
  function setupViewContentTracking() {
    document.addEventListener('click', function (e) {
      var link = e.target.closest('a[href$="#comprar"]');
      if (!link) return;
      if (typeof window.fbq !== 'function') return;
      window.fbq('track', 'ViewContent');
    });
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

  /* ---------- Botoes -/+ no campo de quantidade do WooCommerce (visual do prototipo) ----------
   * O WooCommerce ja' renderiza um <label class="screen-reader-text"> escondido (so' pra leitor
   * de tela) antes do input. Aproveitamos ele como o texto visivel "Quantidade" e agrupamos
   * so' os botoes -/+ e o input numa pilula separada, pra bater com o layout do prototipo
   * (rotulo a esquerda, controles a direita).
   */
  function setupProductQuantityStepper() {
    var qtyWrap = document.querySelector('.product-panel .quantity');
    if (!qtyWrap || qtyWrap.querySelector('.qty-stepper-btn')) return;
    var input = qtyWrap.querySelector('input.qty');
    if (!input) return;

    var pill = document.createElement('div');
    pill.className = 'qty-control-pill';

    var minusBtn = document.createElement('button');
    minusBtn.type = 'button';
    minusBtn.className = 'qty-stepper-btn';
    minusBtn.setAttribute('aria-label', 'Diminuir quantidade');
    minusBtn.textContent = '−';

    var plusBtn = document.createElement('button');
    plusBtn.type = 'button';
    plusBtn.className = 'qty-stepper-btn';
    plusBtn.setAttribute('aria-label', 'Aumentar quantidade');
    plusBtn.textContent = '+';

    qtyWrap.insertBefore(pill, input);
    pill.appendChild(minusBtn);
    pill.appendChild(input);
    pill.appendChild(plusBtn);

    function changeQty(delta) {
      var min = parseInt(input.min, 10) || 1;
      var value = parseInt(input.value, 10) || min;
      value = Math.max(min, value + delta);
      input.value = value;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    }

    minusBtn.addEventListener('click', function () { changeQty(-1); });
    plusBtn.addEventListener('click', function () { changeQty(1); });
  }

  /* ---------- Icone de carrinho no botao "Adicionar ao carrinho" (visual do prototipo) ---------- */
  function setupAddToCartIcon() {
    var btn = document.querySelector('.product-panel .single_add_to_cart_button');
    if (!btn || btn.querySelector('svg')) return;
    btn.insertAdjacentHTML(
      'beforeend',
      ' <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6"/></svg>'
    );
  }

  /* ---------- Dispara o evento nativo do WooCommerce apos add-to-cart via AJAX customizado ----------
   * O script nativo do WooCommerce (wc-add-to-cart.js) dispara "added_to_cart"
   * no <body> via jQuery sempre que um produto entra no carrinho — e' esse
   * evento que os plugins de pixel/rastreamento (Meta, Google, TikTok, Reddit,
   * Snapchat...) escutam pra contar a conversao de "adicionar ao carrinho".
   * Como nosso caminho rapido de add-to-cart (fetch direto pro endpoint,
   * sem carregar o script nativo) nunca disparava esse evento, esses pixels
   * nunca registravam a adicao ao carrinho. Reproduz o disparo aqui, com a
   * mesma assinatura que o WooCommerce usa (fragments, cart_hash, botao).
   */
  function triggerAddedToCartEvent(fragments, cartHash, buttonEl) {
    if (!window.jQuery) return;
    window.jQuery(document.body).trigger('added_to_cart', [
      fragments || {},
      cartHash || '',
      buttonEl ? window.jQuery(buttonEl) : window.jQuery()
    ]);
  }

  /* ---------- Adicionar ao carrinho sem sair da pagina inicial ----------
   * Caminho rapido: chama direto o endpoint nativo de add-to-cart do
   * WooCommerce via fetch (resposta leve em JSON). So' cai pro metodo de
   * reserva (enviar o formulario de verdade dentro de um iframe escondido —
   * mais lento, porque carrega a pagina inteira do produto, com todos os
   * scripts, mas sempre funciona) se o caminho rapido falhar — por exemplo
   * se algum plugin de pixel de rastreamento (Reddit, Snapchat, etc.)
   * corromper a resposta AJAX. Ao final, mostramos o popup de confirmacao
   * (so' depois da resposta real do servidor, nunca antes).
   */
  function setupAjaxAddToCart() {
    var form = document.querySelector('.product-panel form.cart');
    var frame = document.querySelector('iframe[name="nu3tion-cart-frame"]');
    if (!form) return;

    var wrapper = form.closest('[data-product-id]');
    var productId = wrapper ? wrapper.getAttribute('data-product-id') : null;

    var iframeSubmitted = false;
    var pendingQty = 1;

    if (frame) {
      frame.addEventListener('load', function () {
        if (!iframeSubmitted) return; // ignora o load inicial (iframe em branco)
        iframeSubmitted = false;
        refreshCartFragments(pendingQty);
      });
    }

    form.addEventListener('submit', function (e) {
      var btn = form.querySelector('.single_add_to_cart_button');
      if (btn && btn.classList.contains('is-loading')) {
        e.preventDefault(); // trava clique duplicado
        return;
      }
      if (!productId) return; // sem o id do produto, deixa o formulario seguir do jeito antigo

      e.preventDefault();
      var qtyField = form.querySelector('input[name="quantity"]');
      var quantity = qtyField ? qtyField.value : '1';
      if (btn) btn.classList.add('is-loading');

      var formData = new FormData(form);
      formData.set('product_id', productId);
      formData.set('quantity', quantity);

      fetch('/?wc-ajax=add_to_cart', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin',
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Resposta HTTP ' + res.status);
          return res.json();
        })
        .then(function (response) {
          if (!response || response.error) throw new Error('Resposta invalida do add_to_cart');
          if (btn) btn.classList.remove('is-loading');
          applyCartUpdate(response.fragments, quantity);
          triggerAddedToCartEvent(response.fragments, response.cart_hash, btn);
        })
        .catch(function (err) {
          // Caminho rapido falhou (ex: pixel de rastreamento interferindo na
          // resposta) — usa o metodo de reserva, mais lento mas confiavel.
          console.warn('Add-to-cart rapido falhou, usando metodo de reserva:', err);
          submitViaIframe(quantity);
        });
    });

    function submitViaIframe(quantity) {
      if (!frame) {
        HTMLFormElement.prototype.submit.call(form); // sem iframe disponivel: deixa navegar normal
        return;
      }
      pendingQty = quantity;
      form.target = frame.getAttribute('name');
      iframeSubmitted = true;
      HTMLFormElement.prototype.submit.call(form); // bypassa o listener de submit acima, evita loop
    }

    function refreshCartFragments(qty) {
      fetch('/?wc-ajax=get_refreshed_fragments', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      })
        .then(function (res) { return res.json(); })
        .then(function (response) {
          if (!response || !response.fragments) return;
          applyCartUpdate(response.fragments, qty);
          triggerAddedToCartEvent(response.fragments, response.cart_hash, btn);
        })
        .catch(function (err) {
          console.error('Erro ao adicionar ao carrinho:', err);
          showCartToast('error', 'Não foi possível adicionar o produto. Tente novamente.');
        });
    }

    function applyCartUpdate(fragments, qty) {
      if (fragments) {
        Object.keys(fragments).forEach(function (selector) {
          document.querySelectorAll(selector).forEach(function (el) {
            el.outerHTML = fragments[selector];
          });
        });
      }
      var cartCount = document.querySelector('.cart-count');
      if (cartCount) {
        cartCount.classList.remove('pulse');
        void cartCount.offsetWidth;
        cartCount.classList.add('pulse');
      }

      var productNameEl = document.querySelector('.product-title');
      var productName = productNameEl ? productNameEl.textContent.trim() : '';
      showCartToast('success', 'Produto adicionado ao carrinho com sucesso.', {
        detail: qty + 'x ' + productName
      });
    }
  }

  /* ---------- Botao flutuante de carrinho (mobile) ----------
   * Mesmo caminho rapido do formulario de compra (fetch em /?wc-ajax=add_to_cart,
   * sem recarregar a pagina), mas sem depender do formulario da secao
   * "Comprar" estar na tela — usa o "data-product-id" do proprio botao.
   * Ao terminar, abre o painel lateral do carrinho (o mesmo elemento que o
   * icone do header abre) simulando um clique nele — igual o botao "Ver
   * carrinho" do toast de sucesso ja faz mais abaixo neste arquivo. Se o
   * fetch falhar por qualquer motivo, cai pro href normal do botao (que
   * adiciona via URL e manda pra pagina padrao do carrinho).
   */
  function setupMobileCartFloat() {
    var btn = document.getElementById('mobileCartFloat');
    if (!btn) return;
    var productId = btn.getAttribute('data-product-id');
    if (!productId) return; // sem produto configurado: deixa o link normal (ancora #comprar)

    btn.addEventListener('click', function (e) {
      if (btn.classList.contains('is-loading')) {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      btn.classList.add('is-loading');

      var formData = new FormData();
      formData.set('product_id', productId);
      formData.set('quantity', '1');

      fetch('/?wc-ajax=add_to_cart', {
        method: 'POST',
        body: formData,
        credentials: 'same-origin',
        headers: { 'X-Requested-With': 'XMLHttpRequest' }
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Resposta HTTP ' + res.status);
          return res.json();
        })
        .then(function (response) {
          if (!response || response.error) throw new Error('Resposta invalida do add_to_cart');
          btn.classList.remove('is-loading');
          if (response.fragments) {
            Object.keys(response.fragments).forEach(function (selector) {
              document.querySelectorAll(selector).forEach(function (el) {
                el.outerHTML = response.fragments[selector];
              });
            });
          }
          triggerAddedToCartEvent(response.fragments, response.cart_hash, btn);
          var cartToggle = document.getElementById('cartToggle');
          if (cartToggle) cartToggle.click();
        })
        .catch(function (err) {
          console.warn('Botao flutuante: add-to-cart via AJAX falhou, navegando direto.', err);
          btn.classList.remove('is-loading');
          window.location.href = btn.getAttribute('href');
        });
    });
  }

  /* ---------- Painel lateral do carrinho (dados reais do WooCommerce) ----------
   * O icone de carrinho do header abre esse painel em vez de navegar pra
   * pagina de carrinho padrao. O conteudo (itens, remover, subtotal, botao de
   * finalizar compra) e' o proprio mini-carrinho nativo do WooCommerce
   * (woocommerce_mini_cart(), renderizado no footer.php), entao "Remover" e
   * "Finalizar compra" ja' funcionam de verdade sem nenhum JS extra nosso.
   */
  function setupCartDrawer() {
    var toggle = document.getElementById('cartToggle');
    var drawer = document.getElementById('cartDrawer');
    var backdrop = document.getElementById('cartBackdrop');
    var closeBtn = document.getElementById('cartClose');
    if (!toggle || !drawer || !backdrop) return;

    function openDrawer() {
      drawer.classList.add('is-open');
      backdrop.classList.add('is-open');
      drawer.setAttribute('aria-hidden', 'false');

      /* O carrinho e' um painel lateral (nunca uma navegacao de verdade pra
       * uma pagina de carrinho), entao nenhum rastreamento baseado em
       * "carregou a pagina X" consegue ver isso acontecer. Como o Meta nao
       * tem um evento padrao pra "visualizou o carrinho", disparamos um
       * evento customizado aqui — o unico lugar por onde passam TODOS os
       * caminhos que abrem o painel (icone do header, botao flutuante do
       * mobile, botao "Ver carrinho" do toast de confirmacao). */
      if (typeof window.fbq === 'function') {
        window.fbq('trackCustom', 'ViewCart');
      }
    }

    function closeDrawer() {
      drawer.classList.remove('is-open');
      backdrop.classList.remove('is-open');
      drawer.setAttribute('aria-hidden', 'true');
    }

    toggle.addEventListener('click', function (e) {
      e.preventDefault();
      openDrawer();
    });
    closeBtn && closeBtn.addEventListener('click', closeDrawer);
    backdrop.addEventListener('click', closeDrawer);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeDrawer();
    });
  }

  /* ---------- Quantidade editavel e cupom reais dentro do carrinho lateral ----------
   * O widget nativo do WooCommerce (woocommerce_mini_cart()) so' mostra a
   * quantidade como texto e nao tem campo de cupom. Adicionamos os dois por
   * cima, chamando endpoints AJAX proprios em functions.php que so' delegam
   * pra logica real do WooCommerce (WC()->cart->set_quantity() e
   * WC()->cart->add_discount()) e devolvem os mesmos "fragments" que o
   * WooCommerce ja usa — o carrinho lateral sempre reflete o carrinho real.
   *
   * Como o conteudo do carrinho e' recarregado via fragments toda vez que
   * algo muda (adicionar, remover, mudar quantidade, aplicar cupom), essa
   * montagem e' idempotente e refeita sempre que os fragments atualizam —
   * inclusive quando quem atualiza e' o proprio JS nativo do WooCommerce
   * (ex: clicar em "Remover", que ja' funciona via wc-cart-fragments.js).
   */
  function setupCartDrawerEnhancements() {
    var drawer = document.getElementById('cartDrawer');
    if (!drawer) return;
    var nonce = drawer.getAttribute('data-nonce') || '';

    ensureCouponForm();
    enhanceQuantities();

    if (window.jQuery) {
      window.jQuery(document.body).on(
        'wc_fragments_refreshed wc_fragment_refresh added_to_cart removed_from_cart',
        function () {
          ensureCouponForm();
          enhanceQuantities();
        }
      );
    }

    /* O carrinho nativo do WooCommerce (wc-cart-fragments.js) as vezes
     * substitui o conteudo do mini-carrinho (ex: fragments em cache no
     * sessionStorage, aplicados logo no carregamento da pagina, ou o nosso
     * proprio fragmento "div.cart-drawer-body" apos adicionar um produto)
     * sem disparar "wc_fragments_refreshed" a tempo do nosso listener acima
     * ja' estar pronto — deixando a quantidade sem os botoes -/+ ate a
     * proxima mudanca no carrinho. Um MutationObserver garante que a pilula
     * de quantidade e o campo de cupom sejam re-inseridos sempre que o
     * conteudo mudar, seja qual for a causa.
     *
     * Observamos o proprio #cartDrawer (nao o ".cart-drawer-body" de dentro
     * dele), porque nosso fragmento troca ".cart-drawer-body" inteiro via
     * outerHTML — isso desconecta o elemento observado do DOM e o
     * MutationObserver para de disparar. O #cartDrawer em si nunca e'
     * substituido, so' o que tem dentro dele, entao ele continua vendo
     * qualquer mudanca.
     */
    if (window.MutationObserver) {
      var observer = new MutationObserver(function () {
        ensureCouponForm();
        enhanceQuantities();
      });
      observer.observe(drawer, { childList: true, subtree: true });
    }

    function ensureCouponForm() {
      var body = drawer.querySelector('.cart-drawer-body');
      if (!body || body.querySelector('.cart-drawer-coupon')) return;
      var form = document.createElement('form');
      form.className = 'cart-drawer-coupon';
      form.innerHTML =
        '<input type="text" class="cart-drawer-coupon-input" placeholder="Cupom de desconto" autocomplete="off">' +
        '<button type="submit" class="btn btn-secondary btn-sm">Aplicar</button>';
      body.appendChild(form);

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        var input = form.querySelector('.cart-drawer-coupon-input');
        var code = input.value.trim();
        if (!code) return;
        var btn = form.querySelector('button');
        btn.disabled = true;

        fetch('/?wc-ajax=nu3tion_apply_coupon', {
          method: 'POST',
          credentials: 'same-origin',
          headers: { 'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/x-www-form-urlencoded' },
          body: 'nonce=' + encodeURIComponent(nonce) + '&coupon_code=' + encodeURIComponent(code)
        })
          .then(function (res) { return res.json(); })
          .then(function (response) {
            btn.disabled = false;
            if (!response || !response.fragments) return;
            applyFragments(response.fragments);
            showCartNotice(response.notices_html);
          })
          .catch(function () { btn.disabled = false; });
      });
    }

    function enhanceQuantities() {
      drawer.querySelectorAll('.mini_cart_item').forEach(function (item) {
        if (item.querySelector('.cart-qty-pill')) return;
        var qtySpan = item.querySelector('.quantity');
        var removeLink = item.querySelector('a.remove');
        if (!qtySpan || !removeLink) return;
        var cartItemKey = removeLink.getAttribute('data-cart_item_key');
        var match = qtySpan.textContent.match(/(\d+)/);
        var qty = match ? parseInt(match[1], 10) : 1;
        var priceEl = qtySpan.querySelector('.woocommerce-Price-amount');
        var priceOuter = priceEl ? priceEl.outerHTML : '';

        var pill = document.createElement('div');
        pill.className = 'cart-qty-pill';
        pill.innerHTML =
          '<button type="button" class="cart-qty-btn" data-delta="-1" aria-label="Diminuir quantidade">−</button>' +
          '<span class="cart-qty-value">' + qty + '</span>' +
          '<button type="button" class="cart-qty-btn" data-delta="1" aria-label="Aumentar quantidade">+</button>';

        qtySpan.innerHTML = '';
        qtySpan.appendChild(pill);
        if (priceOuter) {
          var priceWrap = document.createElement('span');
          priceWrap.className = 'cart-qty-price';
          priceWrap.innerHTML = '× ' + priceOuter;
          qtySpan.appendChild(priceWrap);
        }

        pill.querySelectorAll('.cart-qty-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var delta = parseInt(btn.getAttribute('data-delta'), 10);
            var newQty = Math.max(1, qty + delta);
            if (newQty === qty) return;
            updateQuantity(cartItemKey, newQty);
          });
        });
      });
    }

    function updateQuantity(cartItemKey, quantity) {
      fetch('/?wc-ajax=nu3tion_update_cart_qty', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'X-Requested-With': 'XMLHttpRequest', 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'nonce=' + encodeURIComponent(nonce) + '&cart_item_key=' + encodeURIComponent(cartItemKey) + '&quantity=' + quantity
      })
        .then(function (res) { return res.json(); })
        .then(function (response) {
          if (!response || !response.fragments) return;
          applyFragments(response.fragments);
        })
        .catch(function (err) { console.error('Erro ao atualizar quantidade do carrinho:', err); });
    }

    function applyFragments(fragments) {
      Object.keys(fragments).forEach(function (selector) {
        document.querySelectorAll(selector).forEach(function (el) {
          el.outerHTML = fragments[selector];
        });
      });
      if (window.jQuery) {
        window.jQuery(document.body).trigger('wc_fragments_refreshed');
      } else {
        ensureCouponForm();
        enhanceQuantities();
      }
    }

    function showCartNotice(html) {
      if (!html) return;
      var body = drawer.querySelector('.cart-drawer-body');
      if (!body) return;
      var existing = body.querySelector('.cart-drawer-notice');
      if (existing) existing.remove();
      var wrap = document.createElement('div');
      wrap.className = 'cart-drawer-notice';
      wrap.innerHTML = html;
      body.insertBefore(wrap, body.firstChild);
      setTimeout(function () { wrap.remove(); }, 5000);
    }
  }

  /* ---------- Checkout real do WooCommerce como assistente de 3 passos ----------
   * Reproduz o fluxo do checkout-modal do prototipo (Dados de entrega > Forma de
   * pagamento > Revisar e confirmar, com bolinhas de progresso) usando os
   * elementos REAIS do formulario de checkout do WooCommerce. Nao criamos nenhum
   * campo novo nem duplicamos logica de pedido/pagamento: so' organizamos a
   * exibicao (mostrar/esconder secoes) e inserimos os botoes de navegacao entre
   * passos. O envio final continua sendo o proprio #place_order do WooCommerce.
   *
   * O WooCommerce atualiza a revisao do pedido (tabela + metodos de pagamento)
   * via AJAX sempre que o endereco muda (evento jQuery "updated_checkout"). Por
   * isso a montagem dos passos 2 e 3 e' idempotente e re-executada nesse evento,
   * caso o WooCommerce tenha recriado esses elementos.
   */
  function setupWooCheckoutSteps() {
    var card = document.querySelector('.wc-checkout-card');
    if (!card) return;
    var form = card.querySelector('form.woocommerce-checkout');
    if (!form) return;

    ensureStepMarkup();
    bindStepNav();
    bindSubmitGuard();
    goToStep(1);

    if (window.jQuery) {
      window.jQuery(document.body).on('updated_checkout', function () {
        ensureStepMarkup();
        goToStep(parseInt(card.getAttribute('data-current-step'), 10) || 1);
      });
    }

    function ensureStepMarkup() {
      if (!card.querySelector('.checkout-progress')) {
        var progress = document.createElement('div');
        progress.className = 'checkout-progress';
        progress.innerHTML =
          '<span class="checkout-dot is-active" data-step="1"></span>' +
          '<span class="checkout-dot" data-step="2"></span>' +
          '<span class="checkout-dot" data-step="3"></span>';
        form.parentNode.insertBefore(progress, form);
      }

      var col2set = form.querySelector('.col2-set');
      var orderReview = form.querySelector('#order_review');
      if (!col2set || !orderReview) return;

      if (!col2set.classList.contains('checkout-step')) {
        col2set.classList.add('checkout-step');
        col2set.setAttribute('data-step', '1');
        var heading1 = document.createElement('h3');
        heading1.textContent = 'Dados de entrega';
        col2set.insertBefore(heading1, col2set.firstChild);
        var next1 = document.createElement('button');
        next1.type = 'button';
        next1.className = 'btn btn-primary btn-block checkout-next';
        next1.setAttribute('data-next', '2');
        next1.textContent = 'Continuar';
        col2set.appendChild(next1);
      }

      var paymentDiv = orderReview.querySelector('#payment');
      var paymentUl = orderReview.querySelector('ul.wc_payment_methods');
      var placeOrderRow = orderReview.querySelector('.place-order');
      var table = orderReview.querySelector('table.shop_table');

      if (paymentDiv && paymentUl && !paymentDiv.querySelector('.checkout-step-heading-2')) {
        var heading2 = document.createElement('h3');
        heading2.className = 'checkout-step-heading-2';
        heading2.textContent = 'Forma de pagamento';
        paymentDiv.insertBefore(heading2, paymentDiv.firstChild);

        var nav2 = document.createElement('div');
        nav2.className = 'checkout-nav checkout-nav-2';
        nav2.innerHTML =
          '<button type="button" class="btn btn-secondary checkout-back" data-back="1">Voltar</button>' +
          '<button type="button" class="btn btn-primary checkout-next" data-next="3">Revisar pedido</button>';
        paymentUl.parentNode.insertBefore(nav2, paymentUl.nextSibling);
      }

      if (table && !orderReview.querySelector('.checkout-step-heading-3')) {
        var heading3 = document.createElement('h3');
        heading3.className = 'checkout-step-heading-3';
        heading3.textContent = 'Revisar e confirmar';
        orderReview.insertBefore(heading3, table);

        var summary = document.createElement('div');
        summary.className = 'checkout-summary';
        orderReview.insertBefore(summary, table);
      }

      if (placeOrderRow && !placeOrderRow.querySelector('.checkout-back-3')) {
        var back3 = document.createElement('button');
        back3.type = 'button';
        back3.className = 'btn btn-secondary checkout-back-3';
        back3.setAttribute('data-back', '2');
        back3.textContent = 'Voltar';
        placeOrderRow.insertBefore(back3, placeOrderRow.firstChild);
      }
    }

    /* Dispara o evento "Lead" do Meta Pixel no momento exato em que os dados
     * da etapa 1 (nome, telefone, endereco etc.) passam pela nossa propria
     * validacao e o cliente avanca de verdade pro passo 2 — nunca antes
     * disso (ex: clique que a validacao bloqueia por campo vazio nao conta).
     * So dispara saindo do passo 1; nos passos 2 e 3 nao se aplica.
     */
    function maybeFireLead(fromStep) {
      if (fromStep !== 1) return;
      if (typeof window.fbq !== 'function') return;
      window.fbq('track', 'Lead');
    }

    function bindStepNav() {
      form.addEventListener('click', function (e) {
        var nextBtn = e.target.closest('.checkout-next');
        var backBtn = e.target.closest('.checkout-back, .checkout-back-3');
        if (nextBtn) {
          e.preventDefault();
          var currentStep = parseInt(card.getAttribute('data-current-step'), 10) || 1;
          if (!validateStep(currentStep)) return;
          maybeFireLead(currentStep);
          goToStep(parseInt(nextBtn.getAttribute('data-next'), 10));
        } else if (backBtn) {
          e.preventDefault();
          goToStep(parseInt(backBtn.getAttribute('data-back'), 10));
        }
      });
    }

    /* Enviar o formulario nativamente antes do passo 3 (ex: apertando Enter
     * num campo do passo 1 ou 2) pularia o assistente direto pro envio real
     * do pedido no WooCommerce. Bloqueamos isso e, em vez de enviar, avancamos
     * pro proximo passo normalmente (com a mesma validacao do botao Continuar).
     * No passo 3, o envio segue normal — e' o "Finalizar pedido" de verdade.
     */
    function bindSubmitGuard() {
      form.addEventListener('submit', function (e) {
        var currentStep = parseInt(card.getAttribute('data-current-step'), 10) || 1;
        if (currentStep >= 3) return;
        e.preventDefault();
        e.stopPropagation();
        if (!validateStep(currentStep)) return;
        maybeFireLead(currentStep);
        goToStep(currentStep + 1);
      }, true);
    }

    function stepContainer(step) {
      var orderReview = form.querySelector('#order_review');
      if (step === 1) return form.querySelector('.col2-set');
      if (step === 2) return orderReview ? orderReview.querySelector('#payment') : null;
      return orderReview;
    }

    function markFieldError(field) {
      form.querySelectorAll('.has-error').forEach(function (el) { el.classList.remove('has-error'); });
      var row = field.closest('.form-row') || field.parentElement;
      if (row) row.classList.add('has-error');
      field.focus();
    }

    function validateStep(step) {
      var container = stepContainer(step);
      if (!container) return true;
      // O WooCommerce marca campo obrigatorio com a classe "validate-required"
      // no ".form-row" (nao usa o atributo HTML required no input).
      var rows = container.querySelectorAll('.form-row.validate-required');
      for (var i = 0; i < rows.length; i++) {
        if (rows[i].closest('.payment_box')) continue; // formulario proprio do gateway, tem validacao dele
        var field = rows[i].querySelector('input, select, textarea');
        if (!field) continue;
        if (field.offsetParent === null) continue; // campo escondido (ex: select nativo por baixo do select2)
        if (!field.value || !field.value.trim()) {
          markFieldError(field);
          return false;
        }
      }
      // Campos com o atributo required nativo, fora dos formularios proprios
      // de gateway (ex: cartao, boleto) — esses tem validacao/preenchimento
      // proprio (ex: "Sem numero" do endereco do Mercado Pago) que nosso
      // checador generico nao entende, e acabava bloqueando o avanco a toa.
      var required = container.querySelectorAll('input[required], select[required]');
      for (var j = 0; j < required.length; j++) {
        var reqField = required[j];
        if (reqField.closest('.payment_box')) continue;
        if (reqField.offsetParent === null) continue;
        if (!reqField.value || !reqField.value.trim()) {
          markFieldError(reqField);
          return false;
        }
      }
      form.querySelectorAll('.has-error').forEach(function (el) { el.classList.remove('has-error'); });
      return true;
    }

    /* Monta a caixa de resumo (etapa 3) a partir dos dados reais que o
     * WooCommerce ja' calculou na tabela de revisao do pedido (escondida
     * visualmente, mas continua no DOM e e' a fonte de verdade dos valores).
     */
    function renderSummary() {
      var orderReview = form.querySelector('#order_review');
      var table = orderReview ? orderReview.querySelector('table.shop_table') : null;
      var summary = orderReview ? orderReview.querySelector('.checkout-summary') : null;
      if (!table || !summary) return;

      var rows = [];
      table.querySelectorAll('tbody tr.cart_item').forEach(function (tr) {
        var nameCell = tr.querySelector('.product-name');
        var totalCell = tr.querySelector('.product-total');
        if (!nameCell || !totalCell) return;
        var qtyEl = nameCell.querySelector('.product-quantity');
        var qtyMatch = qtyEl ? qtyEl.textContent.replace(/\D/g, '') : '';
        var name = nameCell.childNodes[0] ? nameCell.childNodes[0].textContent.trim() : nameCell.textContent.trim();
        var label = qtyMatch ? qtyMatch + 'x ' + name : name;
        rows.push('<p><span>' + label + '</span><span>' + totalCell.innerHTML.trim() + '</span></p>');
      });

      // Taxas/descontos condicionais (ex: desconto de 5% no Pix) aparecem
      // como linhas ".fee" na tabela nativa do WooCommerce.
      table.querySelectorAll('tbody tr.fee').forEach(function (tr) {
        var label = tr.querySelector('th');
        var value = tr.querySelector('td');
        if (!label || !value) return;
        rows.push('<p><span>' + label.textContent.trim() + '</span><span>' + value.innerHTML.trim() + '</span></p>');
      });

      var checkedPayment = orderReview.querySelector('input[name="payment_method"]:checked');
      var paymentLabel = checkedPayment ? checkedPayment.closest('li').querySelector('label') : null;
      var paymentText = paymentLabel ? paymentLabel.textContent.trim().replace(/\s+/g, ' ') : '';
      if (paymentText) {
        rows.push('<p><span>Forma de pagamento</span><span>' + paymentText + '</span></p>');
      }

      var totalRow = table.querySelector('tfoot tr.order-total td');
      // A celula do WooCommerce ja' vem com <strong> em volta do valor.
      var totalHtml = totalRow ? totalRow.innerHTML.trim() : '';
      rows.push('<p><strong>Total</strong>' + totalHtml + '</p>');

      summary.innerHTML = rows.join('');
    }

    function goToStep(step) {
      card.setAttribute('data-current-step', String(step));
      var orderReview = form.querySelector('#order_review');
      var col2set = form.querySelector('.col2-set');
      var paymentUl = orderReview ? orderReview.querySelector('ul.wc_payment_methods') : null;
      var heading2 = orderReview ? orderReview.querySelector('.checkout-step-heading-2') : null;
      var nav2 = orderReview ? orderReview.querySelector('.checkout-nav-2') : null;
      var heading3 = orderReview ? orderReview.querySelector('.checkout-step-heading-3') : null;
      var summary = orderReview ? orderReview.querySelector('.checkout-summary') : null;
      var placeOrderRow = orderReview ? orderReview.querySelector('.place-order') : null;

      toggleStepVisibility(col2set, step === 1);
      toggleStepVisibility(orderReview, step !== 1);

      [paymentUl, heading2, nav2].forEach(function (el) {
        toggleStepVisibility(el, step === 2);
      });
      [heading3, summary, placeOrderRow].forEach(function (el) {
        toggleStepVisibility(el, step === 3);
      });
      if (step === 3) renderSummary();

      card.querySelectorAll('.checkout-dot').forEach(function (dot) {
        dot.classList.toggle('is-active', parseInt(dot.getAttribute('data-step'), 10) <= step);
      });

      var top = card.getBoundingClientRect().top + window.scrollY - 24;
      window.scrollTo({ top: top, behavior: 'smooth' });
    }

    /* O script do Mercado Pago (cartao e boleto) tenta se conectar aos
     * campos de pagamento logo que a pagina carrega, e desiste de vez se
     * nao encontrar ("No checkout form found after 10 attempts"). Como o
     * "display: none" esconde os campos completamente de scripts de
     * terceiros (nao so' visualmente), passos escondidos usam uma classe
     * que so' tira da vista/interacao (posicionamento fora do fluxo +
     * visibility: hidden), mantendo os campos "presentes" pro Mercado Pago
     * conseguir se conectar mesmo antes do cliente chegar na etapa certa.
     */
    function toggleStepVisibility(el, visible) {
      if (!el) return;
      el.classList.toggle('checkout-step-hidden', !visible);
    }
  }

  /* ---------- Popup de "pagamento confirmado" na pagina de agradecimento ----------
   * Sempre que o cliente chega nessa pagina com o pedido ja' pago, mostramos
   * o popup na hora. Pedidos pagos de forma assincrona (ex: Pix, que muitas
   * vezes so' confirma enquanto o cliente ainda esta' na tela do QR Code do
   * proprio gateway) podem chegar aqui ja' pagos — nesse caso mostramos
   * direto, sem esperar. Se ainda estiver pendente, consultamos
   * periodicamente (a cada 4s) ate' o status mudar pra pago.
   */
  function setupOrderPaymentWatcher() {
    var watcher = document.getElementById('orderPaymentWatcher');
    if (!watcher) return;

    var orderId = watcher.getAttribute('data-order-id');
    var orderKey = watcher.getAttribute('data-order-key');
    var homeUrl = watcher.getAttribute('data-home-url');

    if (watcher.getAttribute('data-paid') === '1') {
      showPaymentSuccessPopup();
      return;
    }

    var interval = setInterval(check, 4000);

    function check() {
      fetch(
        '/?wc-ajax=nu3tion_check_order_payment&order_id=' + encodeURIComponent(orderId) +
        '&order_key=' + encodeURIComponent(orderKey)
      )
        .then(function (res) { return res.json(); })
        .then(function (response) {
          if (response && response.paid) {
            clearInterval(interval);
            showPaymentSuccessPopup();
          }
        });
    }

    function showPaymentSuccessPopup() {
      var overlay = document.createElement('div');
      overlay.className = 'payment-success-overlay';
      overlay.innerHTML =
        '<div class="payment-success-card">' +
        '<svg viewBox="0 0 24 24" width="52" height="52" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12.5l2.5 2.5L16 9"/></svg>' +
        '<h3>Pagamento confirmado!</h3>' +
        '<p>Redirecionando para a página inicial...</p>' +
        '</div>';
      document.body.appendChild(overlay);
      setTimeout(function () { overlay.classList.add('is-open'); }, 10);
      setTimeout(function () { window.location.href = homeUrl; }, 2500);
    }
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

  /* ---------- Toast de carrinho (sucesso/erro) ----------
   * Usado pelo setupAjaxAddToCart acima, so' depois da confirmacao real do
   * servidor (nunca antes). Elemento #cartToastRegion fica no footer.php.
   */
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
          '<button type="button" class="toast-btn toast-btn--primary" data-toast-view-cart>Ver carrinho</button>' +
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
    var viewCartBtn = toast.querySelector('[data-toast-view-cart]');
    if (viewCartBtn) {
      viewCartBtn.addEventListener('click', function () {
        dismissToast(toast);
        var cartToggle = document.getElementById('cartToggle');
        if (cartToggle) cartToggle.click();
      });
    }

    toastTimer = setTimeout(function () { dismissToast(toast); }, 6000);
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

  /* ---------- Mascara de telefone: (DDD) 00000-0000 (sem "55" na frente) ----------
   * O campo continua sendo o mesmo #billing_phone de sempre. Recalcula os
   * digitos a cada tecla e reformata no padrao "(DDD) 00000-0000",
   * reposicionando o cursor pelo numero de digitos que havia antes dele
   * (evita o cursor "pular" pro fim a cada tecla).
   *
   * O plugin "Brazilian Market on WooCommerce" ja' aplica sua propria
   * mascara nesse campo — por isso desligamos essa mascara antes (se
   * existir) e aplicamos a nossa por cima, sempre com setTimeout(0) pra
   * garantir que nossa formatacao seja a ultima a rodar em cada tecla.
   */
  function setupPhoneDDDPrefix() {
    var field = document.getElementById('billing_phone');
    if (!field || field.dataset.dddMaskReady) return;
    field.dataset.dddMaskReady = '1';

    function formatPhone(digits) {
      digits = digits.slice(0, 11);
      if (!digits.length) return '';
      if (digits.length <= 2) return '(' + digits;
      var ddd = digits.slice(0, 2);
      var rest = digits.slice(2);
      if (rest.length <= 5) return '(' + ddd + ') ' + rest;
      return '(' + ddd + ') ' + rest.slice(0, 5) + '-' + rest.slice(5, 9);
    }

    function applyCursor(formatted, digitsBeforeCursor) {
      try {
        var seen = 0;
        var pos = formatted.length;
        for (var i = 0; i < formatted.length; i++) {
          if (/\d/.test(formatted[i])) seen++;
          if (seen === digitsBeforeCursor) { pos = i + 1; break; }
        }
        if (digitsBeforeCursor === 0) pos = 0;
        field.setSelectionRange(pos, pos);
      } catch (err) {
        // Alguns navegadores nao suportam setSelectionRange em certos
        // momentos — ignora e deixa o cursor onde o proprio navegador colocou.
      }
    }

    function reformat() {
      var raw = field.value;
      var cursor = ( field.selectionStart === null || field.selectionStart === undefined ) ? raw.length : field.selectionStart;
      var digitsBeforeCursor = raw.slice(0, cursor).replace(/\D/g, '').length;

      var digits = raw.replace(/\D/g, '').slice(0, 11);
      var formatted = formatPhone(digits);
      if (field.value === formatted) return; // ja esta formatado, nao mexe no cursor a toa

      field.value = formatted;

      /* No iOS Safari, mudar o "value" e mexer no cursor de forma sincrona
       * dentro do mesmo evento "input" e' um bug conhecido do WebKit: o
       * teclado/autocorretor do iPhone ainda esta processando o toque que
       * gerou esse evento, e a troca de cursor entra em conflito com isso
       * (o cursor pula ou o teclado trava). No desktop isso nunca aparece
       * porque nao tem teclado virtual por tras. Adiar o reposicionamento
       * pra proxima animation frame da tempo do WebKit terminar o que
       * estava fazendo — mesma tecnica usada por bibliotecas de mascara
       * conhecidas (ex: Cleave.js) especificamente pra esse problema no iOS.
       */
      if (window.requestAnimationFrame) {
        window.requestAnimationFrame(function () { applyCursor(formatted, digitsBeforeCursor); });
      } else {
        applyCursor(formatted, digitsBeforeCursor);
      }
    }

    setTimeout(function () {
      if (window.jQuery && window.jQuery.fn && window.jQuery.fn.unmask) {
        window.jQuery(field).unmask();
      }
      field.value = formatPhone(field.value.replace(/\D/g, ''));
    }, 400);

    field.addEventListener('input', reformat);
    field.addEventListener('paste', function () {
      setTimeout(reformat, 0);
    });
    // Alguns fluxos de autopreenchimento no iOS (sugestao de contato/QuickType)
    // disparam "change" sem um "input" padrao antes — reformata aqui tambem;
    // e' seguro chamar de novo, a funcao ja sai cedo se o valor ja esta certo.
    field.addEventListener('change', reformat);
  }
})();
