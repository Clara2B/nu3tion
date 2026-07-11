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
				<a class="icon-btn" href="<?php echo esc_url( wc_get_cart_url() ); ?>" aria-label="Ver carrinho">
					<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 4h2l2.4 12.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L21 8H6"/><circle cx="9" cy="21" r="1"/><circle cx="17" cy="21" r="1"/></svg>
					<span class="cart-count"><?php echo esc_html( WC()->cart ? WC()->cart->get_cart_contents_count() : 0 ); ?></span>
				</a>
			<?php endif; ?>
			<a href="<?php echo esc_url( home_url( '/#comprar' ) ); ?>" class="btn btn-primary btn-sm">Comprar</a>
			<button class="icon-btn mobile-menu-btn" id="mobileMenuBtn" aria-label="Abrir menu" aria-expanded="false">
				<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M3 12h18M3 18h18"/></svg>
			</button>
		</div>
	</div>
</header>
