<?php
/**
 * Funcoes do tema filho Nu3tion (Storefront Child)
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Acesso direto nao permitido.
}

/**
 * Carrega os estilos e scripts do site.
 */
function nu3tion_enqueue_assets() {
	// Estilo do tema pai (Storefront) + nossa folha de estilo por cima.
	wp_enqueue_style( 'storefront-style', get_template_directory_uri() . '/style.css' );
	wp_enqueue_style(
		'nu3tion-google-fonts',
		'https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Poppins:wght@400;500;600;700;800&display=swap',
		array(),
		null
	);
	wp_enqueue_style(
		'nu3tion-child-style',
		get_stylesheet_uri(),
		array( 'storefront-style' ),
		wp_get_theme()->get( 'Version' )
	);

	wp_enqueue_script(
		'nu3tion-site',
		get_stylesheet_directory_uri() . '/assets/js/site.js',
		array(),
		wp_get_theme()->get( 'Version' ),
		true
	);
}
add_action( 'wp_enqueue_scripts', 'nu3tion_enqueue_assets', 20 );

/**
 * Garante suporte ao WooCommerce (o Storefront ja declara isso, mas nao custa reforcar).
 */
function nu3tion_theme_setup() {
	add_theme_support( 'woocommerce' );
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_image_size( 'nu3tion-blog-card', 480, 320, true );
}
add_action( 'after_setup_theme', 'nu3tion_theme_setup' );

/**
 * Registra o menu de navegacao usado no header.
 * Ir em Aparencia > Menus no wp-admin para montar o menu "Menu principal".
 */
function nu3tion_register_menus() {
	register_nav_menus(
		array(
			'principal' => __( 'Menu principal', 'nu3tion' ),
		)
	);
}
add_action( 'init', 'nu3tion_register_menus' );

/**
 * ID/SKU do produto principal (OraProtein).
 *
 * IMPORTANTE: depois de criar o produto de verdade no WooCommerce,
 * atualize o SKU abaixo para bater com o cadastro real (ou troque
 * essa funcao para retornar o ID direto, ex: return 123;).
 */
function nu3tion_get_main_product_id() {
	$product_id = wc_get_product_id_by_sku( 'ORAPROTEIN-ACAI-ABACAXI' );
	return $product_id ? $product_id : 0;
}

/**
 * Atualiza o numerinho do carrinho no header via AJAX (sem recarregar a
 * pagina) quando o cliente clica em "Adicionar ao carrinho".
 */
function nu3tion_cart_count_fragment( $fragments ) {
	ob_start();
	?>
	<span class="cart-count"><?php echo esc_html( WC()->cart->get_cart_contents_count() ); ?></span>
	<?php
	$fragments['span.cart-count'] = ob_get_clean();
	return $fragments;
}
add_filter( 'woocommerce_add_to_cart_fragments', 'nu3tion_cart_count_fragment' );
