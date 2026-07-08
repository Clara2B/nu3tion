<?php
/**
 * Post individual do blog.
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

get_header();

while ( have_posts() ) :
	the_post();
	?>

	<main id="top">
		<article class="section blog-post">
			<div class="container container--narrow">
				<p class="section-eyebrow reveal">
					<?php
					$categories = get_the_category();
					echo esc_html( ! empty( $categories ) ? $categories[0]->name : 'Blog' );
					?>
				</p>
				<h1 class="blog-post-title reveal"><?php the_title(); ?></h1>
				<p class="blog-post-meta reveal">
					<?php echo esc_html( get_the_date() ); ?> · por <?php the_author(); ?>
				</p>

				<?php if ( has_post_thumbnail() ) : ?>
					<div class="blog-post-media reveal">
						<?php the_post_thumbnail( 'large', array( 'class' => 'blog-post-img' ) ); ?>
					</div>
				<?php endif; ?>

				<div class="blog-post-content reveal">
					<?php the_content(); ?>
				</div>

				<a href="<?php echo esc_url( get_permalink( get_option( 'page_for_posts' ) ) ?: home_url( '/blog/' ) ); ?>" class="blog-back-link">
					<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg>
					Voltar para o blog
				</a>
			</div>
		</article>
	</main>

	<?php
endwhile;

get_footer();
?>
