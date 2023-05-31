<?php
/**
 * Plugin Name:       Top Stories
 * Description:       Pull Top Stories from Specific Category.
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Version:           1.0.0
 * Author:            Malav Vasita
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       top-stories
 *
 * @package           top-stories
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function top_stories_top_stories_block_init() {
	register_block_type( __DIR__ . '/build', array(
		'render_callback' => 'render_top_stories'
	) );
}
add_action( 'init', 'top_stories_top_stories_block_init' );

function render_top_stories( $attr ){
	$args = array(
		'numberposts'	=> $attr['numberOfStories'],
	);
	$my_posts = get_posts( $args );
	
	if( ! empty( $my_posts ) ){
		$output = '<div ' . get_block_wrapper_attributes() . '>';

		$num_cols = $attr['columns'] > 1 ? strval( $attr['columns'] ) : '1';
		$output .= '<ul class="wp-block-top-stories__story-items columns-' . $num_cols . '">';

		foreach ( $my_posts as $p ){
			
			$title = $p->post_title ? $p->post_title : 'Default title';
			$url = esc_url( get_permalink( $p->ID ) );

			$output .= '<li><h5><a href="' . $url . '">' . $title . '</a></h5>';
			if( get_the_excerpt( $p ) && $attr['displayExcerpt'] ){
				$output .= '<p>' . get_the_excerpt( $p ) . '</p>';
			}
			$output .= '</li>';
		}
		$output .= '</ul>';
		$output .= '</div>';
	}
	return $output ?? '<strong>Sorry. No posts matching your criteria!</strong>';
}
