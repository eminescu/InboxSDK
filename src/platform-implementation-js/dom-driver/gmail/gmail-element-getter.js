import _ from 'lodash';
var RSVP = require('rsvp');
var waitFor = require('../../lib/wait-for');

var GmailElementGetter = {

	waitForGmailModeToSettle: function(){
		return require('./gmail-element-getter/wait-for-gmail-mode-to-settle')();
	},

	getMainContentElementChangedStream: _.once(function(){
		return require('./gmail-element-getter/get-main-content-element-changed-stream')(this);
	}),

	isStandalone: function(){
		return GmailElementGetter.isStandaloneComposeWindow() || GmailElementGetter.isStandaloneThreadWindow();
	},

	isStandaloneComposeWindow: function(){
		return document.body.classList.contains('xE') && document.body.classList.contains('xp');
	},

	isStandaloneThreadWindow: function(){
		return document.body.classList.contains('aAU') && document.body.classList.contains('xE') && document.body.classList.contains('Su');
	},

	getComposeWindowContainer: function(){
		return document.querySelector('.dw .nH > .nH > .no');
	},

	getFullscreenComposeWindowContainer: function(){
		return document.querySelector('.aSs .aSt');
	},

	getContentSectionElement: function(){
		var leftNavContainer = GmailElementGetter.getLeftNavContainerElement();
		if(leftNavContainer){
			return leftNavContainer.nextElementSibling.children[0];
		}
		else{
			return null;
		}
	},

	getMainContentContainer: function(){
		var mainContentElement = GmailElementGetter.getCurrentMainContentElement();

		if(!mainContentElement){
			return null;
		}

		return mainContentElement.parentElement;
	},

	getCurrentMainContentElement: function(){
		return document.querySelector('div[role=main]');
	},

	isPreviewPane: function(){
		return !!document.querySelector('.aia');
	},

	getRowListElements: function(){
		return document.querySelectorAll('[gh=tl]');
	},

	getSearchInput: function() {
		return document.getElementById('gbqfq');
	},

	getSearchSuggestionsBoxParent: function() {
		return document.querySelector('table.gstl_50 > tbody > tr > td.gssb_e');
	},

	getToolbarElementContainer: function(){
		return document.querySelector('[gh=tm]').parentElement;
	},

	getToolbarElement: function(){
		return document.querySelector('[gh=tm]');
	},

	getThreadToolbarElement: function(){
		return document.querySelector('[gh=mtb]');
	},

	getThreadContainerElement: function(){
		return document.querySelector('[role=main] .g.id table.Bs > tr');
	},

	getSidebarContainerElement: function(){
		return document.querySelector('[role=main] table.Bs > tr .y3');
	},

	getComposeButton: function(){
		return document.querySelector('[gh=cm]');
	},

	getLeftNavContainerElement: function(){
		return document.querySelector('.aeN');
	},

	getNavItemMenuInjectionContainer: function(){
		return document.querySelectorAll('.aeN .n3')[0];
	},

	getActiveMoreMenu: function(){
		var elements = document.querySelectorAll('.J-M.aX0.aYO.jQjAxd');

		for(var ii=0; ii<elements.length; ii++){
			if(elements[ii].style.display !== 'none'){
				return elements[ii];
			}
		}

		return null;
	},

	getTopAccountContainer: function(){
		var gPlusMenu = document.getElementById('gbsfw');
		if(!gPlusMenu){
			return null;
		}

		return gPlusMenu.parentElement.parentElement;
	},

	isGplusEnabled: function(){
		var topAccountContainer = GmailElementGetter.getTopAccountContainer();
		if(!topAccountContainer){
			return false;
		}

		return topAccountContainer.querySelectorAll('a[href*="https://plus"][href*="upgrade"]').length === 0;
	}

};

GmailElementGetter.StandaloneCompose = {

	getComposeWindowContainer: function(){
		return document.querySelector('[role=main]');
	}

};

module.exports = GmailElementGetter;
