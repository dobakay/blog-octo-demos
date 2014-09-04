var navigation = (function ( $ ){
	'use strict';
	var navModule = {},
		pageTransitions = {
			'slideRightToLeft': {
				'outDirection': 'page-move-to-left',
				'inDirection': 'page-move-from-right'
			},
			'slideLeftToRight': {
				'outDirection': 'page-move-to-right',
				'inDirection': 'page-move-from-left'
			}
		},
		animEndEventNames = {
			'WebkitAnimation' : 'webkitAnimationEnd',
			'OAnimation' : 'oAnimationEnd',
			'msAnimation' : 'MSAnimationEnd',
			'animation' : 'animationend'
		},
		// general css classes for the animation
		currentPageClass = 'current-page',
		transitionPageClass = 'transition-page';

	navModule.init = function () {
		var _this = this;
		$( document ).on( 'click', '.page-link' , function( e ) {
			e.preventDefault();
			e.stopPropagation();

			var $this = $( this ),
				$currentPage = $this.closest( '.page' ),
				destinationPageId = $this.data( 'pageLinkDest' ),
				$destinationPage = $( '#' + destinationPageId ),
				pageTransition = $this.data( 'pageTransition' );

			var	isPageChangeStartEventSuccessful = _this.triggerEvent( 'pagechangestart', {
					$currentPage: $currentPage,
					$destinationPage: $destinationPage,
					$link: $this
				});


			// If the event returns false it will wait for a 'pagechangecontinue' event to trigger the page change
			if( isPageChangeStartEventSuccessful ) {
				_this.changePage({
					$currentPage: $currentPage,
					$destinationPage: $destinationPage,
					pageTransition: pageTransition
				});
			}
			else {
				_this.addEventListener( 'pagechangecontinue', function () {
					_this.changePage({
						$currentPage: $currentPage,
						$destinationPage: $destinationPage,
						pageTransition: pageTransition
					});
				});
			}
		});
	}

	/**
	 * Changes the page from the current to the destination one with specified transition
	 * @param  {jQuery} options.$currentPage  the current page
	 * @param  {jQuery} options.$destinationPage  the destination page
	 * @param  {String} options.pageTransition  the transition of the page change
	 */
	navModule.changePage = function ( options ) {
		// animation classes
		var animationEndEvent = animEndEventNames[ 'WebkitAnimation' ],
			_this = this,
			outClass,
			inClass;

		if( options.pageTransition === undefined ) {
			// default transition
			options.pageTransition = 'slideRightToLeft';
		}

		outClass = transitionPageClass + ' ' + pageTransitions[ options.pageTransition ].outDirection;
		inClass = transitionPageClass + ' ' + pageTransitions[ options.pageTransition ].inDirection;

		// _this.triggerEvent( 'navigationstart' );

		options.$currentPage.removeClass( currentPageClass )
			.addClass( outClass );

		options.$destinationPage.addClass( currentPageClass )
				.addClass( inClass );

		options.$currentPage.on( animationEndEvent, function() {
			options.$currentPage.removeClass( outClass );
		});

		options.$destinationPage.on( animationEndEvent, function() {
			options.$destinationPage.removeClass( inClass );
			_this.triggerEvent( 'pagechangeend' );
		});
	}

	eventy.eventEnable( navModule );

	return navModule;
})( jQuery );
