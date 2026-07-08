<?php
/**
 * Modelo de fallback obrigatorio do WordPress. Na pratica, quem
 * atende a maioria das paginas e front-page.php (inicio) e home.php
 * (blog) -- este arquivo so entra em cena em situacoes incomuns.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();
?>

<main id="top">
	<section class="section section--tinted">
		<div class="container">
			<?php if ( have_posts() ) : ?>
				<div class="blog-grid">
					<?php
					while ( have_posts() ) :
						the_post();
						get_template_part( 'template-parts/content', 'blog-card' );
					endwhile;
					?>
				</div>
			<?php else : ?>
				<p class="blog-empty">Nada encontrado.</p>
			<?php endif; ?>
		</div>
	</section>
</main>

<?php get_footer(); ?>
