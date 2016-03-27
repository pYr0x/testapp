import route from 'can/route/';
import Component from 'can/component/';
import Map from 'can/map/';
import 'can/map/define/';
import './welcome.less';
import template from './welcome.stache';

export const ViewModel = Map.extend({
	next: "up to next page",
	home: "back to home",
	content: "hello on Home",
	goto: function(foo){
		"use strict";

		if(foo === 'next') {
			// progressive loaded content
			System.import('testapp/foo').then( (module) => {
				this.attr('content', module);
			});
		}

		route.attr('page', foo);
		console.log("current page", this.attr('page'));
	}
});

export default Component.extend({
	tag: 'welcome',
	viewModel: ViewModel,
	events: {},
	template
});