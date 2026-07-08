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
		<div class="container footer-bottom">
			<p>nu3tion · CNPJ 55.664.335/0001-04</p>
		</div>
	</footer>

<?php wp_footer(); ?>
</body>
</html>
