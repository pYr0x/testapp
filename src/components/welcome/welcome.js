import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import './welcome.less!';
import template from './welcome.stache!';

export const ViewModel = Map.extend({
	define: {
		message: {
			value: 'Welcome there!'
		}
	}
});

export default Component.extend({
	tag: 'welcome',
	viewModel: ViewModel,
	events: {
		'click': function(){
			System.import('src/foo').then(function(module){
				alert(module)
			});
		}
	},
	template
});