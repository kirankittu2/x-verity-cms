/**
 * @license Copyright (c) 2014-2024, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

import { ClassicEditor } from '@ckeditor/ckeditor5-editor-classic';

import { Autoformat } from '@ckeditor/ckeditor5-autoformat';
import { Bold, Italic } from '@ckeditor/ckeditor5-basic-styles';
import { BlockQuote } from '@ckeditor/ckeditor5-block-quote';
import { CKBox } from '@ckeditor/ckeditor5-ckbox';
import { CloudServices } from '@ckeditor/ckeditor5-cloud-services';
import type { EditorConfig } from '@ckeditor/ckeditor5-core';
import { Essentials } from '@ckeditor/ckeditor5-essentials';
import { Heading } from '@ckeditor/ckeditor5-heading';
import { SourceEditing } from '@ckeditor/ckeditor5-source-editing';
import {
	Image,
	ImageCaption,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	ImageResize,
	PictureEditing,

} from '@ckeditor/ckeditor5-image';
import { Indent } from '@ckeditor/ckeditor5-indent';
import { Link, LinkImage } from '@ckeditor/ckeditor5-link';
import { List } from '@ckeditor/ckeditor5-list';
import { MediaEmbed } from '@ckeditor/ckeditor5-media-embed';
import { Paragraph } from '@ckeditor/ckeditor5-paragraph';
import { PasteFromOffice } from '@ckeditor/ckeditor5-paste-from-office';
import { Table, TableToolbar } from '@ckeditor/ckeditor5-table';
import { TextTransformation } from '@ckeditor/ckeditor5-typing';
import { Undo } from '@ckeditor/ckeditor5-undo';
import { ImageInsert } from '@ckeditor/ckeditor5-image';

// You can read more about extending the build with additional plugins in the "Installing plugins" guide.
// See https://ckeditor.com/docs/ckeditor5/latest/installation/plugins/installing-plugins.html for details.

class Editor extends ClassicEditor {
	public static override builtinPlugins = [
		Autoformat,
		BlockQuote,
		Bold,
		CKBox,
		CloudServices,
		Essentials,
		Heading,
		Image,
		ImageCaption,
		ImageStyle,
		ImageToolbar,
		ImageUpload,
		ImageInsert,
		ImageResize,
		Indent,
		Italic,
		Link,
		List,
		MediaEmbed,
		Paragraph,
		PasteFromOffice,
		PictureEditing,
		Table,
		TableToolbar,
		TextTransformation,
		Undo,
		SourceEditing,
		LinkImage,

	];

	public static override defaultConfig: EditorConfig = {
		toolbar: {
			items: [
				'heading',
				'|',
				'bold',
				'italic',
				'link',
				'bulletedList',
				'numberedList',
				'|',
				'outdent',
				'indent',
				'|',
				'insertImage',
				'blockQuote',
				'insertTable',
				'mediaEmbed',
				'undo',
				'redo',
				'sourceEditing',
			]
		},
		language: 'en',
		image: {
			styles: {
				options: [{
					name: 'margin-left',
					icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5m7-7l-7 7 7 7" />
        </svg>`,
					title: 'Image on left margin',
					className: 'image-style-align-left',
					modelElements: ['imageInline']
				},
				{
					name: 'margin-right',
					icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M5 12h14m-7-7l7 7-7 7"/>
        </svg>`,
					title: 'Image on right margin',
					className: 'image-style-align-right',
					modelElements: ['imageInline']
				},
				{
					name: 'margin-right-block',
					icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="4" y="4" width="16" height="16" />
</svg>`,
					title: 'Image on right margin block',
					className: 'image-style-block-align-right',
					modelElements: ['imageBlock']
				},
				{
					name: 'margin-left-block',
					icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <rect x="4" y="4" width="16" height="16" />
</svg>`,
					title: 'Image on left margin ',
					className: 'image-style-block-align-left',
					modelElements: ['imageBlock']
				},]
			},
			resizeOptions: [
				{
					name: 'resizeImage:original',
					value: null,
					label: '100%'
				},
				{
					name: 'resizeImage:40',
					value: '40',
					label: '40%'
				},
				{
					name: 'resizeImage:60',
					value: '60',
					label: '60%'
				}
			],
			toolbar: [
				'imageTextAlternative',
				'toggleImageCaption',
				'resizeImage',
				{
					name: 'imageStyle:inline',
					title: 'Alignment Inline',
					items: [
						'imageStyle:margin-left',
						'imageStyle:margin-right',
					],
					defaultItem: 'imageStyle:margin-left'
				}, {
					name: 'imageStyle:block',
					title: 'Alignment Block',
					items: [
						'imageStyle:margin-left-block',
						'imageStyle:margin-right-block',
					],
					defaultItem: 'imageStyle:margin-left-block'
				}, 'linkImage'

			],
		},
		table: {
			contentToolbar: [
				'tableColumn',
				'tableRow',
				'mergeTableCells'
			]
		}
	};

}

export default Editor;
