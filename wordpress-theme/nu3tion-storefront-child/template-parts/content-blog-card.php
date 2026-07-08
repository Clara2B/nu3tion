<?php
/**
 * Card de post usado na listagem do blog (home.php / archive.php).
 */
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<article <?php post_class( 'blog-card reveal' ); ?>>
	<a href="<?php the_permalink(); ?>" class="blog-card-media">
		<?php if ( has_post_thumbnail() ) : ?>
			<?php the_post_thumbnail( 'nu3tion-blog-card', array( 'class' => 'blog-card-img' ) ); ?>
		<?php else : ?>
			<img src="<?php echo esc_url( get_stylesheet_directory_uri() . '/assets/img/Logo.webp' ); ?>" alt="" class="blog-card-img blog-card-img--placeholder">
		<?php endif; ?>
	</a>
	<div class="blog-card-body">
		<?php
		$categories = get_the_category();
		if ( ! empty( $categories ) ) :
			?>
			<p class="blog-card-eyebrow"><?php echo esc_html( $categories[0]->name ); ?></p>
		<?php endif; ?>
		<h3 class="blog-card-title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h3>
		<p class="blog-card-excerpt"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 20 ) ); ?></p>
		<a href="<?php the_permalink(); ?>" class="blog-card-link">
			Ler mais
			<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
		</a>
	</div>
</article>
