<?php
/**
 * Cabecalho do site.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="icon" type="image/webp" href="<?php echo esc_url( get_stylesheet_directory_uri() . '/assets/img/Logo.webp' ); ?>">
<?php wp_head(); ?>
</head>
<body <?php body_class( 'nu3tion-page nu3tion' ); ?>>
<?php wp_body_open(); ?>

<div class="announce-bar">
	<p>Aniversário de 2 anos da OraProtein®: frete grátis para todo o Brasil!</p>
</div>

<header class="site-header" id="siteHeader">
	<div class="container header-inner">
		<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="logo">
			<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/assets/img/Logo.webp' ); ?>" alt="" class="logo-img" onerror="this.remove()">
			Nu3tioN<span class="logo-dot">.</span>
		</a>

		<nav class="main-nav" id="mainNav" aria-label="Navegação principal">
			<?php if ( has_nav_menu( 'principal' ) ) : ?>
				<?php
				wp_nav_menu(
					array(
						'theme_location' => 'principal',
						'container'      => false,
						'items_wrap'     => '%3$s',
					)
				);
				?>
			<?php else : ?>
				<a href="<?php echo esc_url( home_url( '/#para-quem' ) ); ?>">Para quem é</a>
				<a href="<?php echo esc_url( home_url( '/#beneficios' ) ); ?>">Benefícios</a>
				<a href="<?php echo esc_url( home_url( '/#comprar' ) ); ?>">Produto</a>
				<a href="<?php echo esc_url( home_url( '/#nutricional' ) ); ?>">Nutrição</a>
				<a href="<?php echo esc_url( home_url( '/#depoimentos' ) ); ?>">Depoimentos</a>
				<a href="<?php echo esc_url( home_url( '/#faq' ) ); ?>">Dúvidas</a>
				<a href="<?php echo esc_url( get_permalink( get_option( 'page_for_posts' ) ) ?: home_url( '/blog/' ) ); ?>">Blog</a>
			<?php endif; ?>
		</nav>

		<div class="header-actions">
			<?php if ( class_exists( 'WooCommerce' ) ) : ?>
				<a class="icon-btn" id="cartToggle" href="<?php echo esc_url( wc_get_cart_url() ); ?>" aria-label="Ver carrinho">
					<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6"/><circle cx="9" cy="21" r="1"/><circle cx="17" cy="21" r="1"/></svg>
					<span class="cart-count"><?php echo esc_html( WC()->cart ? WC()->cart->get_cart_contents_count() : 0 ); ?></span>
				</a>
			<?php endif; ?>
			<a href="<?php echo esc_url( home_url( '/#comprar' ) ); ?>" class="btn btn-primary btn-sm header-cta">Compre Agora</a>
			<?php
			/*
			 * A causa real do icone sumido nunca foi posicao/z-index --
			 * era o <svg> encolhendo pra "width: 0" dentro do flexbox do
			 * botao, por faltar "flex-shrink: 0" (ver "#mobileMenuBtn svg"
			 * no CSS). Confirmado isso, o botao volta pro lugar original,
			 * do lado do carrinho.
			 */
			?>
			<button class="icon-btn mobile-menu-btn" id="mobileMenuBtn" aria-label="Abrir menu" aria-expanded="false">
				<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
			</button>
		</div>
	</div>
</header>

<?php
/*
 * Botao flutuante de compra, so' pro mobile, fora do <header>.
 * Precisa ficar fora porque o <header> tem backdrop-filter (efeito de
 * desfoque), e isso faz qualquer position:fixed dentro dele ficar preso
 * ao proprio header em vez de grudar na tela toda (limitacao do CSS,
 * nao bug de codigo). Escondido por padrao; so aparece via CSS abaixo
 * de 900px, como um botao circular (FAB) com icone de carrinho, centralizado
 * na lateral direita da tela — longe do indicador de conta no topo e do
 * toast de "adicionado ao carrinho" no rodape.
 *
 * Quando o WooCommerce esta ativo e o produto principal existe, o link usa
 * o padrao nativo ?add-to-cart=ID na URL do carrinho: o WooCommerce adiciona
 * o produto e ja carrega a tela do carrinho, sem JS extra. Sem WooCommerce
 * ou produto configurado, cai de volta para a ancora da secao de compra.
 */
$nu3tion_float_product_id = function_exists( 'nu3tion_get_main_product_id' ) ? nu3tion_get_main_product_id() : 0;
if ( class_exists( 'WooCommerce' ) && $nu3tion_float_product_id ) {
	// Href serve so' de reserva pra quando o JS nao roda: adiciona o produto
	// e manda pra pagina padrao do carrinho. Com JS ativo (site.js,
	// setupMobileCartFloat), o clique e' interceptado e usa o mesmo caminho
	// AJAX + painel lateral que o resto do site ja usa (visual customizado,
	// sem recarregar a pagina).
	$nu3tion_float_cart_url = add_query_arg(
		array(
			'add-to-cart'           => $nu3tion_float_product_id,
			'nu3tion-cart-redirect' => 1,
		),
		wc_get_cart_url()
	);
} else {
	$nu3tion_float_cart_url = home_url( '/#comprar' );
}
?>
<a
	href="<?php echo esc_url( $nu3tion_float_cart_url ); ?>"
	class="mobile-cta-float"
	id="mobileCartFloat"
	aria-label="Adicionar ao carrinho e ver carrinho"
	<?php echo $nu3tion_float_product_id ? ' data-product-id="' . esc_attr( $nu3tion_float_product_id ) . '"' : ''; ?>
>
	<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6"/><circle cx="9" cy="21" r="1"/><circle cx="17" cy="21" r="1"/></svg>
</a>
