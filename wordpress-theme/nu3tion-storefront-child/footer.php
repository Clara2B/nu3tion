<?php
/**
 * Rodape do site.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
	<footer class="site-footer">
		<div class="container footer-inner">
			<div class="footer-brand">
				<p class="logo">
					<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/assets/img/Logo.webp' ); ?>" alt="" class="logo-img" onerror="this.remove()">
					nu3tion<span class="logo-dot">.</span>
				</p>
				<p>Proteína vegetal premium, feita para todas as fases da vida.</p>
				<div class="footer-social">
					<a href="https://www.instagram.com/nu3tion.brasil/" target="_blank" rel="noopener" aria-label="NU3TION no Instagram">
						<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4.2"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>
					</a>
					<a href="https://www.facebook.com/share/1HwfTxbSvk/" target="_blank" rel="noopener" aria-label="NU3TION no Facebook">
						<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M13.5 21v-8.5h2.9l.4-3.4h-3.3V7c0-1 .3-1.6 1.7-1.6h1.8V2.3C16.7 2.2 15.6 2 14.3 2c-2.7 0-4.6 1.7-4.6 4.7v2.4H7v3.4h2.7V21h3.8Z"/></svg>
					</a>
				</div>
			</div>
			<div class="footer-col">
				<h4>Navegação</h4>
				<a href="<?php echo esc_url( home_url( '/#para-quem' ) ); ?>">Para quem é</a>
				<a href="<?php echo esc_url( home_url( '/#beneficios' ) ); ?>">Benefícios</a>
				<a href="<?php echo esc_url( home_url( '/#comprar' ) ); ?>">Produto</a>
				<a href="<?php echo esc_url( home_url( '/#faq' ) ); ?>">Dúvidas</a>
			</div>
			<div class="footer-col">
				<h4>Pagamento</h4>
				<div class="payment-icons">
					<span>Pix</span>
					<span>Cartão</span>
					<span>Boleto</span>
				</div>
			</div>
		</div>

		<div class="container footer-trust">
			<div class="footer-trust-item">
				<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
				<span>Compra segura</span>
			</div>
			<div class="footer-trust-item">
				<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3Z"/></svg>
				<span>Site protegido por SSL</span>
			</div>
			<div class="footer-trust-item">
				<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 10h18"/></svg>
				<span>Pagamento processado em ambiente seguro</span>
			</div>
		</div>

		<div class="container footer-bottom">
			<p>
				nu3tion · CNPJ 55.664.335/0001-04
				<?php if ( function_exists( 'get_privacy_policy_url' ) && get_privacy_policy_url() ) : ?>
					· <a href="<?php echo esc_url( get_privacy_policy_url() ); ?>">Política de Privacidade</a>
				<?php endif; ?>
			</p>
		</div>
	</footer>

	<div class="toast-region" id="cartToastRegion" aria-live="polite" aria-atomic="true"></div>

	<?php if ( class_exists( 'WooCommerce' ) ) : ?>
	<div class="cart-backdrop" id="cartBackdrop"></div>
	<aside class="cart-drawer" id="cartDrawer" aria-hidden="true" data-nonce="<?php echo esc_attr( wp_create_nonce( 'nu3tion_cart_actions' ) ); ?>">
		<div class="cart-drawer-head">
			<h3>Seu carrinho</h3>
			<button class="icon-btn" id="cartClose" aria-label="Fechar carrinho">
				<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6 6 18"/></svg>
			</button>
		</div>
		<div class="cart-drawer-body">
			<?php woocommerce_mini_cart(); ?>
		</div>
	</aside>

	<iframe name="nu3tion-cart-frame" title="Processamento do carrinho" style="display:none;" aria-hidden="true"></iframe>
	<?php endif; ?>

<?php wp_footer(); ?>
</body>
</html>
