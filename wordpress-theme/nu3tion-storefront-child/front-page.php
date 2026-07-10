<?php
/**
 * Template da pagina inicial (site de uma pagina so).
 *
 * O conteudo de marketing (textos, beneficios, depoimentos, FAQ) esta
 * fixo aqui no template, igual ao prototipo aprovado. A secao "Comprar"
 * puxa dados reais do produto no WooCommerce.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();

$product_id = function_exists( 'nu3tion_get_main_product_id' ) ? nu3tion_get_main_product_id() : 0;
$product    = ( $product_id && class_exists( 'WooCommerce' ) ) ? wc_get_product( $product_id ) : null;
?>

<main id="top">

	<section class="hero">
		<div class="hero-blob hero-blob--1" aria-hidden="true"></div>
		<div class="hero-blob hero-blob--2" aria-hidden="true"></div>
		<div class="hero-blob hero-blob--3" aria-hidden="true"></div>

		<svg class="brand-leaf brand-leaf--1" viewBox="0 0 100 140" aria-hidden="true">
			<path d="M50 4C74 24 90 54 90 82c0 30-18 54-40 54S10 112 10 82C10 54 26 24 50 4Z"/>
			<path class="brand-leaf-vein" d="M50 12v112M50 45 30 35M50 45 70 35M50 75 28 63M50 75 72 63M50 103 30 92M50 103 70 92" fill="none" stroke-width="2"/>
		</svg>
		<svg class="brand-leaf brand-leaf--2" viewBox="0 0 100 160" aria-hidden="true">
			<path class="brand-leaf-stem" d="M50 156C50 120 50 40 50 4" fill="none" stroke-width="3" stroke-linecap="round"/>
			<ellipse cx="38" cy="28" rx="16" ry="5" transform="rotate(-25 38 28)"/>
			<ellipse cx="62" cy="28" rx="16" ry="5" transform="rotate(25 62 28)"/>
			<ellipse cx="35" cy="54" rx="19" ry="5.5" transform="rotate(-22 35 54)"/>
			<ellipse cx="65" cy="54" rx="19" ry="5.5" transform="rotate(22 65 54)"/>
			<ellipse cx="33" cy="82" rx="21" ry="6" transform="rotate(-20 33 82)"/>
			<ellipse cx="67" cy="82" rx="21" ry="6" transform="rotate(20 67 82)"/>
			<ellipse cx="32" cy="110" rx="22" ry="6" transform="rotate(-16 32 110)"/>
			<ellipse cx="68" cy="110" rx="22" ry="6" transform="rotate(16 68 110)"/>
		</svg>
		<svg class="brand-leaf brand-leaf--3" viewBox="0 0 100 140" aria-hidden="true">
			<path d="M50 4C74 24 90 54 90 82c0 30-18 54-40 54S10 112 10 82C10 54 26 24 50 4Z"/>
			<path class="brand-leaf-vein" d="M50 12v112M50 45 30 35M50 45 70 35M50 75 28 63M50 75 72 63" fill="none" stroke-width="2"/>
		</svg>

		<div class="container hero-inner">
			<div class="hero-copy">
				<p class="eyebrow">Proteína vegetal · sabor açaí com abacaxi</p>
				<h1>A proteína vegetal inspirada na biodiversidade brasileira.</h1>
				<p class="hero-sub">Da corrida de domingo à caminhada dos 60 anos, o OraProtein rende energia e ajuda na recuperação do corpo — feito com ora-pro-nobis, sem lactose e sem glúten.</p>
				<p class="hero-sub">23g de proteína por porção, contém todos os aminoácidos essenciais, fonte de fibras e ômega 3 em uma fórmula exclusiva desenvolvida ao longo de dois anos.</p>

				<div class="hero-cta-row">
					<a href="#comprar" class="btn btn-primary btn-lg">Experimento OraProtein®</a>
				</div>

				<ul class="hero-trust">
					<li><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 6 9 17l-5-5"/></svg>Fonte de fibras</li>
					<li><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 6 9 17l-5-5"/></svg>Fonte de ômega 3</li>
					<li class="hero-trust-break" aria-hidden="true"></li>
					<li><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 6 9 17l-5-5"/></svg>Clean label</li>
					<li><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 6 9 17l-5-5"/></svg>Sem lactose</li>
					<li><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M20 6 9 17l-5-5"/></svg>Sem glúten</li>
				</ul>
			</div>

			<div class="hero-media">
				<div class="hero-media-frame">
					<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/assets/img/Nu3tion 2.png' ); ?>" alt="OraProtein sendo servido em um copo, pronto para beber" class="hero-media-img">
				</div>
				<div class="floating-card floating-card--rating">
					<span class="stars" aria-hidden="true">★★★★★</span>
					<span>4.8 · 127 avaliações</span>
				</div>
				<div class="floating-card floating-card--flavor">
					<span class="flavor-dot"></span>
					Açaí com abacaxi
				</div>
			</div>
		</div>
	</section>

	<section class="trust-strip">
		<div class="trust-marquee">
			<div class="trust-marquee-track">
				<?php for ( $i = 0; $i < 2; $i++ ) : ?>
				<div class="trust-item"<?php echo $i > 0 ? ' aria-hidden="true"' : ''; ?>><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2c4 3 7 5 7 10a7 7 0 0 1-14 0c0-5 3-7 7-10Z"/></svg>Fonte de 13 vitaminas e minerais</div>
				<div class="trust-item"<?php echo $i > 0 ? ' aria-hidden="true"' : ''; ?>><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12h16M4 12a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4M4 12a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4"/></svg>Sem lactose</div>
				<div class="trust-item"<?php echo $i > 0 ? ' aria-hidden="true"' : ''; ?>><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="m8 8 8 8"/></svg>Sem glúten</div>
				<div class="trust-item"<?php echo $i > 0 ? ' aria-hidden="true"' : ''; ?>><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 16V7a1 1 0 0 1 1-1h9v10M3 16h10M3 16v2a1 1 0 0 0 1 1h1m8-3v3m0-3h5a1 1 0 0 0 1-1v-3l-3-4h-3v7"/><circle cx="7" cy="19" r="1.6"/><circle cx="17" cy="19" r="1.6"/></svg>Entrega em todo o Brasil</div>
				<div class="trust-item"<?php echo $i > 0 ? ' aria-hidden="true"' : ''; ?>><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 17.75 5.8 21l1.2-7-5-4.9 6.9-1L12 2l3.1 6.1 6.9 1-5 4.9 1.2 7Z"/></svg>4.8 · 127 avaliações</div>
				<div class="trust-item"<?php echo $i > 0 ? ' aria-hidden="true"' : ''; ?>><svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2c4 3 7 5 7 10a7 7 0 0 1-14 0c0-5 3-7 7-10Z"/></svg>100% ora-pro-nobis natural</div>
				<?php endfor; ?>
			</div>
		</div>
	</section>

	<section class="section" id="para-quem">
		<div class="container">
			<p class="section-eyebrow reveal">Para quem é</p>
			<h2 class="section-title reveal">OraProtein acompanha diferentes estilos de vida</h2>
			<p class="section-sub reveal">Nutrição Brasileira e Inteligente</p>

			<div class="persona-grid">
				<div class="persona-card reveal">
					<div class="persona-icon persona-icon--a"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"/></svg></div>
					<h3>Do primeiro treino ao alto rendimento</h3>
					<p>Uma forma prática de consumir proteína para quem busca evoluir, seja treinando por saúde, qualidade de vida ou performance.</p>
				</div>
				<div class="persona-card reveal" data-reveal-delay="1">
					<div class="persona-icon persona-icon--d"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2c4 3 7 5 7 10a7 7 0 0 1-14 0c0-5 3-7 7-10Z"/></svg></div>
					<h3>Pra quem prefere proteína clean label</h3>
					<p>Ingredientes 100% vegetais, apto para veganos</p>
				</div>
				<div class="persona-card reveal" data-reveal-delay="2">
					<div class="persona-icon persona-icon--b"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg></div>
					<h3>Para uma rotina prática e nutritiva</h3>
					<p>Preparo em menos de 2 minutos.</p>
				</div>
				<div class="persona-card reveal" data-reveal-delay="3">
					<div class="persona-icon persona-icon--c"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21s-7-4.35-9.5-8.5C.7 9 2 5 6 5c2 0 3.5 1 4 2 .5-1 2-2 4-2 4 0 5.3 4 3.5 7.5C19.5 16.65 12 21 12 21Z"/></svg></div>
					<h3>Pra quem busca envelhecer com mais qualidade</h3>
					<p>Ajuda a manter a massa muscular com uma digestão leve, sem lactose.</p>
				</div>
			</div>
		</div>
	</section>

	<section class="section section--tinted" id="beneficios">
		<div class="container">
			<p class="section-eyebrow reveal">Benefícios</p>
			<h2 class="section-title reveal">Por que o OraProtein é diferente</h2>

			<div class="benefits-grid">
				<div class="benefit-card reveal">
					<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 3v18M6 3c4 0 4 4 8 4M6 11c4 0 4 4 8 4"/></svg>
					<h3>Fórmula exclusiva</h3>
					<p>Desenvolvida durante mais de dois anos. Feito com ora-pro-nóbis, um superalimento fonte de proteína, vitaminas e fibras.</p>
				</div>
				<div class="benefit-card reveal" data-reveal-delay="1">
					<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12h16M4 12a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4M4 12a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4"/></svg>
					<h3>Nutrição completa, digestão leve</h3>
					<p>Sem lactose e sem glúten, pensado pra quem tem sensibilidade alimentar.</p>
				</div>
				<div class="benefit-card reveal" data-reveal-delay="2">
					<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 21.5s-8-5-8-11.5a5 5 0 0 1 9-3 5 5 0 0 1 9 3c0 6.5-8 11.5-10 11.5Z"/></svg>
					<h3>Sabor que conquista</h3>
					<p>Açaí com abacaxi: um sabor genuinamente brasileiro, leve e nada artificial.</p>
				</div>
				<div class="benefit-card reveal" data-reveal-delay="3">
					<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2c4 3 7 5 7 10a7 7 0 0 1-14 0c0-5 3-7 7-10Z"/></svg>
					<h3>Origem sustentável</h3>
					<p>Desenvolvido com ingredientes de origem vegetal, cuidadosamente combinados para oferecer qualidade nutricional.</p>
				</div>
				<div class="benefit-card reveal" data-reveal-delay="4">
					<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20 6 9 17l-5-5"/></svg>
					<h3>Para quem prefere proteína clean label</h3>
					<p>O OraProtein não possui aditivos - como corantes, conservantes, açúcares ou gorduras - provenientes de fontes artificiais.</p>
				</div>
			</div>

			<div class="stats-bar reveal" id="statsBar">
				<div class="stat-item">
					<span class="stat-value" data-counter data-target="23" data-suffix="g">0g</span>
					<span class="stat-label">proteína por porção</span>
				</div>
				<div class="stat-item">
					<span class="stat-value">0</span>
					<span class="stat-label">lactose e glúten</span>
				</div>
				<div class="stat-item">
					<span class="stat-value" data-counter data-target="2" data-suffix=" min">0 min</span>
					<span class="stat-label">de preparo</span>
				</div>
				<div class="stat-item">
					<span class="stat-value" data-counter data-target="4.8" data-decimal="1">0</span>
					<span class="stat-label">nota média</span>
				</div>
			</div>

			<div class="mid-cta">
				<a href="#comprar" class="btn btn-primary btn-lg">Quero experimentar o OraProtein®</a>
			</div>
		</div>
	</section>

	<section class="section" id="historia">
		<div class="container container--narrow">
			<p class="section-eyebrow reveal">Nossa história</p>
			<h2 class="section-title reveal">Uma história que começou em família.</h2>
			<p class="section-sub reveal">A ideia nasceu de uma conversa entre dois primos: como criar um alimento proteico de origem vegetal que unisse qualidade, praticidade e ingredientes brasileiros? Depois de mais de dois anos de desenvolvimento, nasceu o OraProtein.</p>

			<div class="story-founders">
				<div class="story-founder-card reveal">
					<div class="story-founder-photo">
						<svg class="story-founder-placeholder" viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.5-7 8-7s8 3 8 7"/></svg>
						<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/assets/img/Lucas.avif' ); ?>" alt="Foto de Lucas, um dos fundadores da OraProtein" class="story-founder-img" onerror="this.remove()">
					</div>
					<p class="story-founder-name">Lucas</p>
				</div>
				<div class="story-founder-card reveal" data-reveal-delay="1">
					<div class="story-founder-photo">
						<svg class="story-founder-placeholder" viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.5-7 8-7s8 3 8 7"/></svg>
						<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/assets/img/Pedro.avif' ); ?>" alt="Foto de Pedro, um dos fundadores da OraProtein" class="story-founder-img" onerror="this.remove()">
					</div>
					<p class="story-founder-name">Pedro</p>
				</div>
			</div>
		</div>
	</section>

	<section class="section" id="como-usar">
		<div class="container">
			<p class="section-eyebrow reveal">Como consumir</p>
			<h2 class="section-title reveal">Pronto em 3 passos</h2>

			<div class="steps-row">
				<div class="step-item reveal">
					<div class="step-visual step-visual--a">
						<span class="step-number">1</span>
						<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 11h12a1 1 0 0 1 1 1 7 7 0 0 1-14 0 1 1 0 0 1 1-1Z"/><path d="M16 12h4"/><circle cx="6" cy="6" r="0.9" fill="currentColor" stroke="none"/><circle cx="9.5" cy="3.8" r="0.9" fill="currentColor" stroke="none"/><circle cx="12.5" cy="6.3" r="0.9" fill="currentColor" stroke="none"/></svg>
					</div>
					<div class="step-text">
						<h3>Uma dose (scoop)</h3>
						<p>Adicione uma medida de OraProtein no seu shaker.</p>
					</div>
				</div>
				<div class="step-connector" aria-hidden="true"></div>
				<div class="step-item reveal" data-reveal-delay="1">
					<div class="step-visual step-visual--b">
						<span class="step-number">2</span>
						<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 3h10l-1.3 15.2A2 2 0 0 1 13.7 20h-3.4a2 2 0 0 1-2-1.8L7 3Z"/><path d="M6 3h12"/><path d="M8.1 10.5h7.8"/></svg>
					</div>
					<div class="step-text">
						<h3>200ml de líquido</h3>
						<p>Água, leite vegetal ou a bebida da sua preferência.</p>
					</div>
				</div>
				<div class="step-connector" aria-hidden="true"></div>
				<div class="step-item reveal" data-reveal-delay="2">
					<div class="step-visual step-visual--c">
						<span class="step-number">3</span>
						<svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="8" y="7" width="8" height="13" rx="2"/><path d="M10 7V4h4v3"/><path d="M4 9.5 5.8 11M4 15l1.8-1.5M20 9.5 18.2 11M20 15l-1.8-1.5"/></svg>
					</div>
					<div class="step-text">
						<h3>Agite e aproveite</h3>
						<p>Pronto em menos de 2 minutos, a qualquer hora do dia.</p>
					</div>
				</div>
			</div>
		</div>
		<div class="steps-tip">
			<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2v20M4.5 6l15 12M19.5 6l-15 12M4.5 6l2.5.5M4.5 6l.5-2.5M19.5 6l-2.5.5M19.5 6l-.5-2.5M4.5 18l2.5-.5M4.5 18l.5 2.5M19.5 18l-2.5-.5M19.5 18l-.5 2.5"/></svg>
			<span><strong>Dica da casa:</strong> Fica bem mais gostoso gelado ou com gelo!</span>
		</div>
		<div class="steps-video">
			<video class="steps-video-player" id="prepVideo" autoplay muted loop playsinline>
				<source src="<?php echo esc_url( get_stylesheet_directory_uri() . '/assets/video/Preparo OraProtein.mp4' ); ?>" type="video/mp4">
			</video>
			<button type="button" class="steps-video-mute" id="videoMuteBtn" aria-label="Ativar som do vídeo" aria-pressed="false">
				<svg class="icon-muted" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M16.5 9 22 14.5M22 9l-5.5 5.5"/></svg>
				<svg class="icon-unmuted" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" hidden><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.3 5.7a9 9 0 0 1 0 12.6"/></svg>
			</button>
		</div>

		<div class="mid-cta">
			<a href="#comprar" class="btn btn-primary btn-lg">Quero experimentar o OraProtein®</a>
		</div>
	</section>

	<section class="section section--tinted" id="comprar">
		<div class="container">
			<div class="product-panel">
				<div class="product-visual reveal">
					<div class="product-visual-frame">
						<?php if ( $product && $product->get_image_id() ) : ?>
							<?php echo wp_get_attachment_image( $product->get_image_id(), 'large', false, array( 'class' => 'product-media-img' ) ); ?>
						<?php else : ?>
							<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/assets/img/Nu3tion 3.avif' ); ?>" alt="Pacote de OraProtein, sabor açaí com abacaxi, 500g" class="product-media-img">
						<?php endif; ?>
					</div>
					<div class="product-badges">
						<span>Sem lactose</span>
						<span>Sem glúten</span>
						<span>Sem açúcar adicionado</span>
						<span>Sem gordura adicionada</span>
					</div>
				</div>

				<div class="product-info reveal" data-reveal-delay="1">
					<p class="product-flavor">Açaí com abacaxi · 500g · aprox. 16 doses de 30g</p>
					<h2 class="product-title">OraProtein</h2>
					<div class="product-rating">
						<span class="stars" aria-hidden="true">★★★★★</span>
						<span>4.8 (127 avaliações)</span>
					</div>

					<?php if ( $product ) : ?>
						<div class="product-price-block">
							<div class="price-row"><?php echo $product->get_price_html(); // phpcs:ignore ?></div>
							<?php
							/*
							 * Texto generico de proposito: nao cita desconto Pix nem numero
							 * de parcelas, pois isso depende do gateway configurado em
							 * WooCommerce > Configuracoes > Pagamentos. Depois de ativar o
							 * gateway (Mercado Pago, Pagar.me, Efi, etc.), ajuste esta frase
							 * para refletir as condicoes reais (ex: "5% de desconto no Pix").
							 */
							?>
							<p class="price-detail">Pix, cartão ou boleto no checkout</p>
						</div>

						<?php
						// Formulario nativo de compra do WooCommerce (carrinho/quantidade/AJAX).
						global $post;
						$post = get_post( $product_id ); // phpcs:ignore
						setup_postdata( $post );
						woocommerce_template_single_add_to_cart();
						wp_reset_postdata();
						?>
					<?php else : ?>
						<div class="product-price-block">
							<div class="price-row">
								<span class="price-now">R$ 159,90</span>
								<span class="price-old">R$ 189,90</span>
							</div>
							<p class="price-detail">ou <strong>R$ 155,10 no Pix</strong> · 3x de R$ 58,29 sem juros</p>
						</div>
						<p style="color:#a11; font-weight:600;">⚠ Produto ainda não encontrado no WooCommerce (confira o SKU em <code>functions.php → nu3tion_get_main_product_id()</code>).</p>
					<?php endif; ?>

					<p class="coupon-note">
						<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 .59 1.41l9 9a2 2 0 0 0 2.82 0l8-8a2 2 0 0 0 0-2.82l-9-9A2 2 0 0 0 12 2Z"/><circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" stroke="none"/></svg>
						Adicione seu cupom na finalização da compra!
					</p>

					<ul class="product-guarantees">
						<li><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 16V7a1 1 0 0 1 1-1h9v10M3 16h10M3 16v2a1 1 0 0 0 1 1h1m8-3v3m0-3h5a1 1 0 0 0 1-1v-3l-3-4h-3v7"/><circle cx="7" cy="19" r="1.6"/><circle cx="17" cy="19" r="1.6"/></svg>Frete grátis acima de R$ 150</li>
						<li><svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></svg>Pix, cartão ou boleto</li>
					</ul>
				</div>
			</div>
		</div>
	</section>

	<section class="section" id="entenda">
		<div class="container">
			<p class="section-eyebrow reveal">Entenda nosso produto</p>
			<h2 class="section-title reveal">Por dentro do OraProtein</h2>

			<div class="explain-panel">
				<div class="explain-list">
					<div class="explain-item reveal">
						<div class="explain-icon"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2 4 7v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V7l-8-5Z"/><path d="M9 12l2 2 4-4"/></svg></div>
						<div>
							<h3>Proteínas de alto valor biológico</h3>
							<p>Acreditamos que proteína não precisa ser complicada.</p>
						</div>
					</div>
					<div class="explain-item reveal" data-reveal-delay="1">
						<div class="explain-icon"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 2c4 3 7 5 7 10a7 7 0 0 1-14 0c0-5 3-7 7-10Z"/></svg></div>
						<div>
							<h3>Ingredientes naturais</h3>
							<p>Nem que ingredientes naturais precisam abrir mão da praticidade.</p>
						</div>
					</div>
					<div class="explain-item reveal" data-reveal-delay="2">
						<div class="explain-icon"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M20.5 8.5c0 5-8.5 11-8.5 11S3.5 13.5 3.5 8.5a4.5 4.5 0 0 1 8.5-2 4.5 4.5 0 0 1 8.5 2Z"/><path d="M7 10h2.5l1.5-3 2 6 1.5-3H17"/></svg></div>
						<div>
							<h3>Saúde e performance</h3>
							<p>Criamos alimentos proteicos de origem vegetal inspirados na biodiversidade brasileira para possibilitar uma alimentação rica mais simples no dia a dia.</p>
						</div>
					</div>

					<div class="ingredient-grid">
						<a href="https://www.tuasaude.com/ora-pro-nobis/" target="_blank" rel="noopener" class="ingredient-card reveal">
							<div class="ingredient-icon"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2c4 3 7 5 7 10a7 7 0 0 1-14 0c0-5 3-7 7-10Z"/><circle cx="12" cy="11" r="2.5"/></svg></div>
							<h3>Ora-pro-nobis</h3>
							<p>Descubra os benefícios desta planta brasileira para a sua saúde.</p>
							<span class="ingredient-more">Saiba mais</span>
						</a>
						<a href="https://www.tuasaude.com/beneficios-da-chia/" target="_blank" rel="noopener" class="ingredient-card reveal" data-reveal-delay="1">
							<div class="ingredient-icon"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="8" cy="9" r="1.4"/><circle cx="14" cy="7" r="1.4"/><circle cx="17" cy="13" r="1.4"/><circle cx="10" cy="15" r="1.4"/><circle cx="6" cy="15" r="1.4"/><circle cx="15" cy="18" r="1.4"/></svg></div>
							<h3>Chia</h3>
							<p>Conheça os benefícios desta semente para a sua saúde.</p>
							<span class="ingredient-more">Saiba mais</span>
						</a>
						<a href="https://www.tuasaude.com/acai/" target="_blank" rel="noopener" class="ingredient-card reveal" data-reveal-delay="2">
							<div class="ingredient-icon"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="9" cy="9" r="3"/><circle cx="15" cy="9" r="3"/><circle cx="12" cy="15" r="3"/><path d="M12 2v2M9 4l1 2M15 4l-1 2"/></svg></div>
							<h3>Açaí</h3>
							<p>Afinal, você conhece o poder do açaí?</p>
							<span class="ingredient-more">Saiba mais</span>
						</a>
						<a href="https://www.tuasaude.com/ervilha/" target="_blank" rel="noopener" class="ingredient-card reveal" data-reveal-delay="3">
							<div class="ingredient-icon"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 3c3 0 5.5 2.5 5.5 6v6a5.5 5.5 0 0 1-11 0V9C6.5 5.5 9 3 12 3Z"/><path d="M6.5 10h11M6.5 13.5h11"/></svg></div>
							<h3>Ervilha</h3>
							<p>Descubra os benefícios da proteína de ervilha.</p>
							<span class="ingredient-more">Saiba mais</span>
						</a>
					</div>
				</div>

				<div class="explain-media reveal" data-reveal-delay="1">
					<div class="explain-media-frame">
						<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/assets/img/Entenda.avif' ); ?>" alt="OraProtein sendo preparado" class="explain-media-img">
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="section" id="nutricional">
		<div class="container">
			<p class="section-eyebrow reveal">Transparência total</p>
			<h2 class="section-title reveal">Tabela nutricional</h2>
			<p class="section-sub reveal">Informação nutricional oficial do OraProtein, direto do laudo do fabricante.</p>

			<div class="nutrition-tabs reveal">
				<div class="nutrition-tab-buttons">
					<button type="button" class="nutrition-tab-btn is-active" data-nutrition-tab="macro">Informação nutricional</button>
					<button type="button" class="nutrition-tab-btn" data-nutrition-tab="vitaminas">Vitaminas e minerais</button>
				</div>
				<div class="nutrition-tab-panel is-active" data-nutrition-panel="macro">
					<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/assets/img/Tabela-nutricional.webp' ); ?>" alt="Tabela de informação nutricional do OraProtein" class="nutrition-table-img">
				</div>
				<div class="nutrition-tab-panel" data-nutrition-panel="vitaminas">
					<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/assets/img/Tabela-nutricional-2.webp' ); ?>" alt="Tabela de vitaminas e minerais do OraProtein" class="nutrition-table-img">
				</div>
			</div>
		</div>
	</section>

	<section class="section" id="depoimentos">
		<div class="container">
			<p class="section-eyebrow reveal">Depoimentos</p>
			<h2 class="section-title reveal">Quem usa, aprova</h2>

			<div class="carousel" id="testimonialCarousel">
				<div class="carousel-track" id="carouselTrack">
					<article class="testimonial-card">
						<div class="testimonial-photo">
							<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/assets/img/Prancha-Jesus.webp' ); ?>" alt="Saulo Lyra" style="object-position: 50% 30%;">
						</div>
						<div class="testimonial-body">
							<p class="testimonial-name">Saulo Lyra</p>
							<p class="testimonial-role">Surfista Tricampeão Brasileiro</p>
							<p class="testimonial-text">"Tenho 62 anos, sou atleta há 43, nos últimos 12 sou vegetariano, OraProtein é uma forma saudável, prática e natural que proporciona alta performance com o corpo leve e muita energia!"</p>
							<span class="stars stars--sm" aria-hidden="true">★★★★★</span>
						</div>
					</article>
					<article class="testimonial-card">
						<div class="testimonial-photo">
							<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/assets/img/MAri-Otimizada-scaled.webp' ); ?>" alt="Mariana Dorigatti" style="object-position: 50% 20%;">
						</div>
						<div class="testimonial-body">
							<p class="testimonial-name">Mariana Dorigatti</p>
							<p class="testimonial-role">Mestre e atleta competidora Karatê</p>
							<p class="testimonial-text">"OraProtein é uma fonte de proteína vegetal que, além de ser muito bem absorvida pelo meu corpo, não causa nenhum desconforto gástrico, também traz saciedade, sendo uma ótima opção de café da manhã. O sabor também é muito agradável e eu gosto de misturar com leite vegetal e frutas."</p>
							<span class="stars stars--sm" aria-hidden="true">★★★★★</span>
						</div>
					</article>
					<article class="testimonial-card">
						<div class="testimonial-photo">
							<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/assets/img/Paulinho-Otimizada.webp' ); ?>" alt="Paulinho Franzen" style="object-position: 50% 15%;">
						</div>
						<div class="testimonial-body">
							<p class="testimonial-name">Paulinho Franzen</p>
							<p class="testimonial-role">Atleta corredor</p>
							<p class="testimonial-text">"ORAPROTEIN: sabor top, leve pra digerir e pesado na energia pros treinos e correria do dia-a-dia."</p>
							<span class="stars stars--sm" aria-hidden="true">★★★★★</span>
						</div>
					</article>
				</div>
				<div class="carousel-controls">
					<button type="button" id="carouselPrev" aria-label="Depoimento anterior">
						<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
					</button>
					<div class="carousel-dots" id="carouselDots"></div>
					<button type="button" id="carouselNext" aria-label="Próximo depoimento">
						<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg>
					</button>
				</div>
			</div>

			<div class="mid-cta">
				<a href="#comprar" class="btn btn-primary btn-lg">Quero experimentar o OraProtein®</a>
			</div>
		</div>
	</section>

	<section class="section section--tinted" id="faq">
		<div class="container container--narrow">
			<p class="section-eyebrow reveal">Dúvidas frequentes</p>
			<h2 class="section-title reveal">Perguntas frequentes</h2>

			<div class="accordion" id="faqAccordion">
				<div class="accordion-item reveal">
					<button class="accordion-trigger" aria-expanded="false">
						Tem açúcar?
						<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
					</button>
					<div class="accordion-panel">
						<p>Somente açúcares naturais dos ingredientes, o equivalente a 1 uva.</p>
					</div>
				</div>
				<div class="accordion-item reveal">
					<button class="accordion-trigger" aria-expanded="false">
						Quanto rende?
						<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
					</button>
					<div class="accordion-panel">
						<p>Cada pote de 500g rende aproximadamente 16 doses de 30g.</p>
					</div>
				</div>
				<div class="accordion-item reveal">
					<button class="accordion-trigger" aria-expanded="false">
						Como preparar?
						<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
					</button>
					<div class="accordion-panel">
						<p>Basta bater ou misturar uma dose (30g) com 200ml de água, leite vegetal ou a bebida da sua preferência. Pronto em menos de 2 minutos.</p>
					</div>
				</div>
				<div class="accordion-item reveal">
					<button class="accordion-trigger" aria-expanded="false">
						Qual o prazo de entrega?
						<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
					</button>
					<div class="accordion-panel">
						<p>Envio rápido de 2 a 10 dias, dependendo da região.</p>
					</div>
				</div>
				<div class="accordion-item reveal">
					<button class="accordion-trigger" aria-expanded="false">
						Posso substituir o whey?
						<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
					</button>
					<div class="accordion-panel">
						<p>Sim. O OraProtein entrega 23g de proteína por porção, de origem 100% vegetal, sem lactose e sem glúten.</p>
					</div>
				</div>
				<div class="accordion-item reveal">
					<button class="accordion-trigger" aria-expanded="false">
						Posso tomar todos os dias?
						<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
					</button>
					<div class="accordion-panel">
						<p>Sim, idealmente 1 vez por dia ou conforme orientação médica.</p>
					</div>
				</div>
				<div class="accordion-item reveal">
					<button class="accordion-trigger" aria-expanded="false">
						Pode substituir refeições?
						<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
					</button>
					<div class="accordion-panel">
						<p>Sim, OraProtein é um superalimento e vai te manter nutrido e saciado até a próxima refeição. Dica: experimente substituir o café da manhã.</p>
					</div>
				</div>
				<div class="accordion-item reveal">
					<button class="accordion-trigger" aria-expanded="false">
						Tem gosto de ora-pro-nóbis?
						<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
					</button>
					<div class="accordion-panel">
						<p>Não. O sabor é mascarado pelo açaí com abacaxi — o que você sente é a fruta, não a folha.</p>
					</div>
				</div>
				<div class="accordion-item reveal">
					<button class="accordion-trigger" aria-expanded="false">
						Posso tomar em qualquer idade?
						<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
					</button>
					<div class="accordion-panel">
						<p>O produto é indicado para adultos em geral. Se você tem alguma condição de saúde específica, converse com seu médico ou nutricionista antes de incluir qualquer alimento novo na rotina.</p>
					</div>
				</div>
				<div class="accordion-item reveal">
					<button class="accordion-trigger" aria-expanded="false">
						Qual a quantidade de proteína?
						<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
					</button>
					<div class="accordion-panel">
						<p>23g por dose.</p>
					</div>
				</div>
				<div class="accordion-item reveal">
					<button class="accordion-trigger" aria-expanded="false">
						Serve para quem tem intolerância à lactose?
						<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
					</button>
					<div class="accordion-panel">
						<p>Sim. O OraProtein é 100% vegetal, sem lactose e sem glúten na formulação.</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="guarantee-band reveal">
		<div class="container guarantee-inner">
			<div class="guarantee-icon">
				<svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z"/><path d="m9 12 2 2 4-4"/></svg>
			</div>
			<div>
				<h3>Garantia de satisfação</h3>
				<p>Se a experiência não atender às suas expectativas, fale conosco. Queremos entender o motivo e encontrar a melhor solução.</p>
			</div>
		</div>
	</section>

	<section class="closing-band">
		<div class="closing-glow" aria-hidden="true"></div>
		<svg class="brand-leaf closing-leaf closing-leaf--1" viewBox="0 0 100 140" aria-hidden="true">
			<path d="M50 4C74 24 90 54 90 82c0 30-18 54-40 54S10 112 10 82C10 54 26 24 50 4Z"/>
		</svg>
		<svg class="brand-leaf closing-leaf closing-leaf--2" viewBox="0 0 100 140" aria-hidden="true">
			<path d="M50 4C74 24 90 54 90 82c0 30-18 54-40 54S10 112 10 82C10 54 26 24 50 4Z"/>
		</svg>
		<div class="container closing-inner">
			<p class="closing-text">
				<span class="closing-line reveal" data-reveal-delay="1">Você não está comprando apenas uma proteína.</span>
				<span class="closing-line reveal" data-reveal-delay="2">Está escolhendo uma nova forma de consumir proteína vegetal.</span>
				<span class="closing-line closing-line--accent reveal" data-reveal-delay="3">Mais natural.</span>
				<span class="closing-line closing-line--accent reveal" data-reveal-delay="4">Mais completa.</span>
				<span class="closing-line closing-line--soft reveal" data-reveal-delay="5">Inspirada em um ingrediente brasileiro extraordinário.</span>
			</p>
			<a href="#comprar" class="btn btn-primary btn-lg reveal" data-reveal-delay="5">
				Quero experimentar o OraProtein
				<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
			</a>
		</div>
	</section>

</main>

<?php get_footer(); ?>
