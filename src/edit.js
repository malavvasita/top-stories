import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { RawHTML, useState, useEffect } from '@wordpress/element';
import {
	PanelBody,
	PanelRow,
	ToggleControl,
	RangeControl,
	SelectControl,
} from '@wordpress/components';

import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { apiFetch } = wp;

	const { taxonomy, numberOfStories, displayExcerpt, columns } = attributes;
	const [ categories, setCategories ] = useState( [] );

	useEffect( () => {
		// Fetch the categories list
		apiFetch( { path: 'wp/v2/categories?hide_empty=true' } ).then(
			( fetchedCategories ) => {
				// Update the state with the retrieved categories
				setCategories( fetchedCategories );
			}
		);
	} );

	const options = categories.map( ( category ) => ( {
		label: category.name,
		value: category.id.toString(),
	} ) );

	useEffect( () => {
		if ( taxonomy || numberOfStories ) {
			apiFetch( {
				path: `wp/v2/posts?per_page=${ numberOfStories }&categories=${ taxonomy }`,
			} ).then( ( rec ) => {
				setAttributes( { posts: rec } );
			} );
		}
	}, [ taxonomy, numberOfStories ] );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Taxonomy Settings', 'top-stories' ) }>
					<PanelRow>
						<SelectControl
							label={ __( 'Taxonomy', 'top-stories' ) }
							options={ options }
							onChange={ ( val ) =>
								setAttributes( { taxonomy: val } )
							}
						/>
					</PanelRow>
				</PanelBody>
				<PanelBody title={ __( 'Content Settings', 'top-stories' ) }>
					<PanelRow>
						<RangeControl
							label={ __( 'Number of Stories', 'top-stories' ) }
							value={ numberOfStories }
							onChange={ ( value ) =>
								setAttributes( { numberOfStories: value } )
							}
							min={ 1 }
							max={ 10 }
							required
						/>
					</PanelRow>
					<PanelRow>
						<RangeControl
							label={ __( 'Number of Columns', 'top-stories' ) }
							value={ columns }
							onChange={ ( value ) =>
								setAttributes( { columns: value } )
							}
							min={ 1 }
							max={ 4 }
							required
						/>
					</PanelRow>
					<PanelRow>
						<ToggleControl
							label={ __( 'Display Excerpt', 'top-stories' ) }
							checked={ displayExcerpt }
							onChange={ () =>
								setAttributes( {
									displayExcerpt: ! displayExcerpt,
								} )
							}
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<ul
					className={ `wp-block-top-stories__story-items columns-${ columns }` }
				>
					{ attributes.posts && attributes.posts.length
						? attributes.posts.map( ( post ) => {
								return (
									<li key={ post.id }>
										<div className="wp-block-top-stories__stories-list">
											<h5>
												<a href={ post.link }>
													{ post.title.rendered ? (
														<RawHTML>
															{
																post.title
																	.rendered
															}
														</RawHTML>
													) : (
														__(
															'No Title',
															'top-stories'
														)
													) }
												</a>
											</h5>
											{ displayExcerpt &&
												post.excerpt.rendered && (
													<p>
														<RawHTML>
															{
																post.excerpt
																	.rendered
															}
														</RawHTML>
													</p>
												) }
										</div>
									</li>
								);
						  } )
						: __(
								'Select Category From the Settings Panel.',
								'top-stories'
						  ) }
				</ul>
			</div>
		</>
	);
}
