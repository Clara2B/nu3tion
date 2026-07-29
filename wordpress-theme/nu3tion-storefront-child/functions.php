<?php
/**
 * Funcoes do tema filho Nu3tion (Storefront Child)
 *
 * CONFIGURACAO DE PAGAMENTO
 * Este tema nao processa pagamentos: ele so exibe o formulario nativo do
 * WooCommerce (carrinho, checkout) e usa `wc_get_cart_url()` para o link do
 * carrinho no cabecalho. Para habilitar Pix/cartao/boleto de verdade:
 *   1. Instale e ative o plugin do gateway escolhido (ex: "Mercado Pago para
 *      WooCommerce", Pagar.me, Efi, Asaas etc.).
 *   2. Configure as credenciais e metodos em
 *      WooCommerce > Configuracoes > Pagamentos.
 * Nenhuma alteracao de tema e necessaria para esse passo. So revise o texto
 * de "price-detail" em front-page.php se as condicoes reais (desconto Pix,
 * numero de parcelas) forem diferentes do que esta escrito ali.
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

	// Garante que o script nativo de add-to-cart via AJAX do WooCommerce (e o
	// objeto `wc_add_to_cart_params` que ele localiza) esteja disponivel na
	// front-page, ja que ela nao e uma pagina de produto/loja "de verdade" aos
	// olhos do WooCommerce (por isso ele nao enfileira isso aqui sozinho).
	if ( function_exists( 'WC' ) ) {
		wp_enqueue_script( 'wc-add-to-cart' );
	}
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
 * O WooCommerce, por padrao, processa "?add-to-cart=ID" e depois redireciona
 * de volta pra pagina de onde veio a requisicao (wp_get_referer()) em vez de
 * ficar na URL que foi de fato acessada — entao o botao flutuante do
 * carrinho (mobile-cta-float) adicionava o produto mas devolvia o visitante
 * pra mesma pagina, sem nunca chegar na tela do carrinho. Esse filtro so
 * forca o redirecionamento pro carrinho quando o link tem o marcador
 * "nu3tion-cart-redirect" (adicionado so' no botao flutuante), sem alterar o
 * comportamento padrao (via AJAX) do resto do site.
 */
function nu3tion_redirect_float_cart_to_cart_page( $url ) {
	if ( isset( $_GET['nu3tion-cart-redirect'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
		return wc_get_cart_url();
	}
	return $url;
}
add_filter( 'woocommerce_add_to_cart_redirect', 'nu3tion_redirect_float_cart_to_cart_page' );

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
 * Fragmento do CONTEUDO do carrinho lateral (a lista de itens do
 * woocommerce_mini_cart()). Sem isso, so o numerinho do header atualizava
 * via AJAX — mudar quantidade, aplicar cupom ou adicionar produto de fato
 * alterava o carrinho no servidor, mas a tela do painel lateral nunca era
 * avisada disso (o JS so troca o que aparece no fragment que o servidor
 * manda, e "div.cart-drawer-body" nao existia na resposta ate agora).
 */
function nu3tion_cart_drawer_body_fragment( $fragments ) {
	ob_start();
	woocommerce_mini_cart();
	$mini_cart = ob_get_clean();
	$fragments['div.cart-drawer-body'] = '<div class="cart-drawer-body">' . $mini_cart . '</div>';
	return $fragments;
}
add_filter( 'woocommerce_add_to_cart_fragments', 'nu3tion_cart_drawer_body_fragment' );

/**
 * A imagem/nome do produto dentro do carrinho (lateral e pagina de carrinho)
 * levam por padrao para a pagina avulsa do produto no WooCommerce — que
 * ninguem desenhou, porque o site e' de pagina unica (tudo fica na secao
 * "Comprar" da home). Troca esse link para apontar pra la em vez disso.
 */
function nu3tion_cart_item_permalink() {
	return home_url( '/#comprar' );
}
add_filter( 'woocommerce_cart_item_permalink', 'nu3tion_cart_item_permalink' );

/**
 * Valida o telefone no backend (checkout classico do WooCommerce), alem da
 * mascara no frontend. O campo aceita tanto "DDD + numero" (10-11 digitos)
 * quanto com o codigo do pais na frente, "55 + DDD + numero" (12-13 digitos)
 * — formato usado pela mascara atual do campo (setupPhoneDDDPrefix, em
 * site.js). A mascara visual fica no campo, mas o que importa aqui e a
 * quantidade de digitos reais, entao normalizamos removendo tudo que nao for
 * numero antes de validar.
 */
function nu3tion_validate_billing_phone( $data, $errors ) {
	if ( empty( $data['billing_phone'] ) ) {
		return;
	}
	$digits = preg_replace( '/\D/', '', $data['billing_phone'] );
	$length = strlen( $digits );
	$valid  = ( $length >= 10 && $length <= 11 ) || ( $length >= 12 && $length <= 13 && '55' === substr( $digits, 0, 2 ) );
	if ( ! $valid ) {
		$errors->add( 'billing_phone', __( 'Informe um telefone valido com DDD, no formato (11) 94001-1535.', 'nu3tion' ) );
	}
}
add_action( 'woocommerce_after_checkout_validation', 'nu3tion_validate_billing_phone', 10, 2 );

/**
 * RECONSTRUCAO — funcionalidades avancadas do carrinho lateral / checkout em
 * 3 passos / confirmacao de pagamento na pagina de agradecimento.
 *
 * O front-end (assets/js/site.js) que ja estava no ar depende destes 3
 * endpoints AJAX e destes 2 hooks. O arquivo original que os continha foi
 * sobrescrito sem backup, entao isto foi reconstruido a partir do que o
 * proprio JS chama (nomes de endpoint, parametros esperados, formato de
 * resposta) — nao e uma restauracao literal do codigo antigo, e uma
 * reimplementacao com o mesmo contrato. Teste com atencao, especialmente
 * cupom e confirmacao de pagamento.
 */
define( 'NU3TION_CART_NONCE_ACTION', 'nu3tion_cart_actions' );

/**
 * Endpoint AJAX: aplicar cupom de desconto no carrinho lateral.
 * Chamado pelo JS em POST /?wc-ajax=nu3tion_apply_coupon (nonce, coupon_code).
 */
function nu3tion_ajax_apply_coupon() {
	check_ajax_referer( NU3TION_CART_NONCE_ACTION, 'nonce' );

	$coupon_code = isset( $_POST['coupon_code'] ) ? wc_format_coupon_code( wp_unslash( $_POST['coupon_code'] ) ) : '';

	ob_start();
	if ( $coupon_code && ! WC()->cart->has_discount( $coupon_code ) ) {
		WC()->cart->add_discount( $coupon_code );
	}
	wc_print_notices();
	$notices_html = ob_get_clean();

	wp_send_json(
		array(
			'fragments'    => apply_filters( 'woocommerce_add_to_cart_fragments', array() ),
			'notices_html' => $notices_html,
		)
	);
}
add_action( 'wc_ajax_nu3tion_apply_coupon', 'nu3tion_ajax_apply_coupon' );

/**
 * Endpoint AJAX: alterar a quantidade de um item do carrinho lateral.
 * Chamado pelo JS em POST /?wc-ajax=nu3tion_update_cart_qty (nonce, cart_item_key, quantity).
 */
function nu3tion_ajax_update_cart_qty() {
	check_ajax_referer( NU3TION_CART_NONCE_ACTION, 'nonce' );

	$cart_item_key = isset( $_POST['cart_item_key'] ) ? sanitize_text_field( wp_unslash( $_POST['cart_item_key'] ) ) : '';
	$quantity      = isset( $_POST['quantity'] ) ? wc_stock_amount( wp_unslash( $_POST['quantity'] ) ) : 0;

	if ( $cart_item_key && $quantity > 0 ) {
		WC()->cart->set_quantity( $cart_item_key, $quantity, true );
	}

	wp_send_json(
		array(
			'fragments' => apply_filters( 'woocommerce_add_to_cart_fragments', array() ),
		)
	);
}
add_action( 'wc_ajax_nu3tion_update_cart_qty', 'nu3tion_ajax_update_cart_qty' );

/**
 * Endpoint AJAX: consultar se um pedido ja foi pago. Usado na pagina de
 * agradecimento para exibir o popup assim que a confirmacao chegar (ex: Pix).
 * Chamado pelo JS em GET /?wc-ajax=nu3tion_check_order_payment (order_id, order_key).
 */
function nu3tion_ajax_check_order_payment() {
	$order_id  = isset( $_GET['order_id'] ) ? absint( $_GET['order_id'] ) : 0;
	$order_key = isset( $_GET['order_key'] ) ? sanitize_text_field( wp_unslash( $_GET['order_key'] ) ) : '';
	$order     = $order_id ? wc_get_order( $order_id ) : false;

	$paid = $order && hash_equals( $order->get_order_key(), $order_key ) && $order->is_paid();

	wp_send_json( array( 'paid' => (bool) $paid ) );
}
add_action( 'wc_ajax_nu3tion_check_order_payment', 'nu3tion_ajax_check_order_payment' );

/**
 * Envolve o formulario de checkout numa div ".wc-checkout-card", que o JS
 * (setupWooCheckoutSteps) usa para transformar o checkout nativo num
 * assistente de 3 passos (Dados de entrega / Pagamento / Revisar).
 */
add_action(
	'woocommerce_before_checkout_form',
	function () {
		echo '<div class="wc-checkout-card">';
	},
	5
);
add_action(
	'woocommerce_after_checkout_form',
	function () {
		echo '</div>';
	},
	100
);

/**
 * Elemento lido pelo JS (setupOrderPaymentWatcher) na pagina de agradecimento,
 * com os dados do pedido pra saber quando o pagamento (ex: Pix) confirmar.
 */
add_action(
	'woocommerce_thankyou',
	function ( $order_id ) {
		$order = $order_id ? wc_get_order( $order_id ) : false;
		if ( ! $order ) {
			return;
		}
		printf(
			'<div id="orderPaymentWatcher" style="display:none" data-order-id="%1$d" data-order-key="%2$s" data-home-url="%3$s" data-paid="%4$s"></div>',
			esc_attr( $order_id ),
			esc_attr( $order->get_order_key() ),
			esc_url( home_url( '/' ) ),
			$order->is_paid() ? '1' : '0'
		);
	}
);
