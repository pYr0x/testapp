import { Component } from 'can';
import './next.less!';
import view from './next.stache';

export default Component.extend({
	tag: 'x-next',
	ViewModel: {
		message: {
			default: 'NEXT!'
		}
	},
	view
});
