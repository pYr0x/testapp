//import route from 'can/route/';
import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import './next.less!';
import template from './next.stache';

export const ViewModel = Map.extend({
	define: {
		message: {
			value: 'NEXT!'
		}
	}
});

export default Component.extend({
	tag: 'x-next',
	viewModel: ViewModel,
	events: {
	},
	template
});