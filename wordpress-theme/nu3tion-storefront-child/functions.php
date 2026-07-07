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

/**
 * Meta tags Open Graph/Twitter + dados estruturados (schema.org) da pagina inicial.
 *
 * So roda se NENHUM plugin de SEO dedicado (Yoast, Rank Math) estiver ativo, para
 * nao duplicar/conflitar com as tags que esses plugins ja geram sozinhos. Se um
 * desses plugins for instalado depois, esta funcao para de rodar automaticamente
 * e o SEO passa a ser configurado por la (recomendado a longo prazo).
 */
function nu3tion_seo_tags() {
	if ( ! is_front_page() ) {
		return;
	}
	if ( defined( 'WPSEO_VERSION' ) || defined( 'RANK_MATH_VERSION' ) ) {
		return;
	}

	$title       = 'OraProtein by NU3TION — Proteína vegetal, sabor açaí com abacaxi';
	$description = 'Proteína vegetal premium com ora-pro-nobis, sabor açaí com abacaxi. Sem lactose, sem glúten, 100% vegana.';
	$url         = home_url( '/' );
	$image       = get_stylesheet_directory_uri() . '/assets/img/Nu3tion 1.png';

	$product_id = function_exists( 'nu3tion_get_main_product_id' ) ? nu3tion_get_main_product_id() : 0;
	$product    = ( $product_id && class_exists( 'WooCommerce' ) ) ? wc_get_product( $product_id ) : null;
	$price      = $product ? $product->get_price() : '159.90';
	if ( $product && $product->get_image_id() ) {
		$image = wp_get_attachment_image_url( $product->get_image_id(), 'large' );
	}
	?>
	<link rel="canonical" href="<?php echo esc_url( $url ); ?>">
	<meta property="og:type" content="website">
	<meta property="og:locale" content="pt_BR">
	<meta property="og:site_name" content="NU3TION">
	<meta property="og:url" content="<?php echo esc_url( $url ); ?>">
	<meta property="og:title" content="<?php echo esc_attr( $title ); ?>">
	<meta property="og:description" content="<?php echo esc_attr( $description ); ?>">
	<meta property="og:image" content="<?php echo esc_url( $image ); ?>">
	<meta name="twitter:card" content="summary_large_image">
	<meta name="twitter:title" content="<?php echo esc_attr( $title ); ?>">
	<meta name="twitter:description" content="<?php echo esc_attr( $description ); ?>">
	<meta name="twitter:image" content="<?php echo esc_url( $image ); ?>">
	<script type="application/ld+json">
	<?php
	echo wp_json_encode(
		array(
			'@context'        => 'https://schema.org',
			'@type'           => 'Product',
			'name'            => 'OraProtein',
			'image'           => $image,
			'description'     => $description,
			'brand'           => array(
				'@type' => 'Brand',
				'name'  => 'NU3TION',
			),
			'sku'             => 'ORAPROTEIN-ACAI-ABACAXI',
			'offers'          => array(
				'@type'         => 'Offer',
				'url'           => home_url( '/#comprar' ),
				'priceCurrency' => 'BRL',
				'price'         => (string) $price,
				'availability'  => 'https://schema.org/InStock',
			),
			'aggregateRating' => array(
				'@type'       => 'AggregateRating',
				'ratingValue' => '4.8',
				'reviewCount' => '127',
			),
		)
	);
	?>
	</script>
	<?php
}
add_action( 'wp_head', 'nu3tion_seo_tags' );
