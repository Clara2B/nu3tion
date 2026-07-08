<?php
/**
 * Listagem de posts por categoria, tag ou data.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();
?>

<main id="top">
	<section class="section blog-hero">
		<div class="container">
			<p class="section-eyebrow reveal">Blog</p>
			<h1 class="section-title reveal"><?php the_archive_title(); ?></h1>
		</div>
	</section>

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
				<div class="blog-pagination">
					<?php
					echo paginate_links( // phpcs:ignore
						array(
							'prev_text' => '← Anteriores',
							'next_text' => 'Próximos →',
						)
					);
					?>
				</div>
			<?php else : ?>
				<p class="blog-empty">Nenhum post encontrado.</p>
			<?php endif; ?>
		</div>
	</section>
</main>

<?php get_footer(); ?>
