/*
 * Scrollbar plugin for jQuery UI
 *
 * Originally adapted from the jQuery UI Slider example for implementing a horizontal scrollbar.
 *
 * Author: Jillian Ada Burrows.
 * Version: 1.0.0
 * Date: 27 February 2012
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 *	jquery.ui.slider.js
 */

(function ($) {
	// Register the scrollbar widget.
	$.widget("ui.scrollbar", {
		options: {
			orientation: "horizontal",
			scrollFactor: 15,
			easing: 'linear',
			animationDuration: 20
		},
		/**
		 * Create the scrollpane out of nothing.
 		 */
		_create: function () {
			var
				self	= this,
				o			= this.options,
				el		= this.element;

			// Scrollbar needed?
			this.scrollbarActive = false;

			// Grab the container element and remove the child element(s).
			this.containerElement = $(el);
			this.containerChildren = this.containerElement.children();
			this.containerChildren.detach();

			// Make scrollpane parts
			this.scrollPane = $( '<div class="scroll-pane scroll-pane-'+ o.orientation + '"></div>' );
			this.scrollContent	= $( '<div class="scroll-content scroll-content-' + o.orientation  + '"></div>' );

			// Append children back into the container div.
			this.scrollContent.append(this.containerChildren);
			this.scrollContent.appendTo(this.scrollPane);
			this.scrollContent.show();

			// Build the main slider
			this.scrollbarWrapper = $('<div class="scroll-bar-wrap scroll-bar-wrap-' + o.orientation + ' ui-corner-all"></div>');
			this.scrollbarWrapper.appendTo(this.scrollPane).hide();
			this.scrollbar = $( '<div class="scroll-bar scroll-bar-' + o.orientation + '"></div>' ).slider({
				orientation: o.orientation,
				value: o.orientation == 'horizontal' ? 0 : 100,
				slide: function( event, ui ) {
					if(o.orientation == "horizontal") {
						self._horizontalScrollHandler(event, ui);
					} else {
						// Vertical Orientation
						self._verticalScrollHandler(event, ui);
					}
				}
			});
			// Make handle look better and feel right for a scrollbar
			this._makeHandleHelper();
			// Append to the scrollbar wrapper
			this.scrollbar.appendTo(this.scrollbarWrapper);
			// Append to the container
			this.scrollPane.appendTo(this.containerElement);

			// Handler for the mouse wheel
			this.containerElement.bind('mousewheel', function(event, delta) {
				if (self.scrollbarActive === true) {
					event.stopPropagation();
					// Handle mousewheel event only if delta is defined (jquery.mousewheel.js is loaded).
					if(delta !== undefined) {
						return self._mousewheelHandler(event, delta);
					}
				}
			});

			// Show the scrollbar if needed (i.e.: content is large enough)
			this._showScrollbar();
		},

		/**
		 * Handle Helper: helps keep the scrollbar handle inside the scrollpane
		 *   (the default behaviour is the slider handle extending into the margins)
		 */
		_makeHandleHelper: function () {
			var self = this;
			if(this.options.orientation == "horizontal") {
				this.handleHelper = this.scrollbar.find( ".ui-slider-handle" )
					.mousedown(function () {
						self.scrollbar.width( self.handleHelper.width() );
					})
					.mouseup(function () {
						self.scrollbar.width( "100%" );
					})
					.wrap( "<div class='ui-handle-helper-parent'></div>" ).parent();
			} else {
				this.handleHelper = this.scrollbar.find( ".ui-slider-handle" )
					.mousedown(function () {
						self.scrollbar.height( self.handleHelper.height() );
					})
					.mouseup(function () {
						self.scrollbar.height( "100%" );
					})
					.wrap( "<div class='ui-handle-helper-parent'></div>" ).parent();
			}

			//change overflow to hidden now that slider handles the scrolling
			this.scrollPane.css( "overflow", "hidden" );
		},

		/**
		 * Horizontal scroll handler
		 */
		_horizontalScrollHandler: function (event, ui) {
			this._scrollHorizontal(ui.value, this.options.animationDuration);
		},

		/**
		 * Vertical scroll handler
		 */
		_verticalScrollHandler: function (event, ui) {
			this._scrollVertical(ui.value, this.options.animationDuration);
		},

		/**
		 * Mousewheel handler: handles computing scroll animation
		 */
		_mousewheelHandler: function (event, delta) {
			var scrollScreen = false;
			var duration = this.options.animationDuration;
			var scrollAmount = delta * this.options.scrollFactor;
			if(this.options.orientation == "horizontal") {
				var scroll = this._adjustScrollAmount(-scrollAmount);
				this._scrollHorizontal(scroll.amount, duration);
			} else {
				var scroll = this._adjustScrollAmount(scrollAmount);
				this._scrollVertical(scroll.amount, duration);
			}
			return scroll.scroll;
		},

		/**
		 * Adjusts the scroll amount based on the bounds of the slider values
		 */
		_adjustScrollAmount: function (scrollAmount) {
			var scrollScreen = false;
			var scrollbarValue = parseInt(this.scrollbar.slider('value')) + scrollAmount;
			if (scrollbarValue < 0) {
				scrollbarValue = 0;
				scrollScreen = true;
			}
			if (scrollbarValue > 100) {
				scrollbarValue = 100;
				scrollScreen = true;
			}
			this.scrollbar.slider('value', scrollbarValue);
			return {amount: scrollbarValue, scroll: scrollScreen };
		},

		/**
		 * Scrolls content horizontally by percentage
		 */
		_scrollHorizontal: function(scrollbarValue, duration) {
			if ( this.scrollContent.width() > this.scrollPane.width() ) {
				var distance = Math.round(
					scrollbarValue / 100 * ( this.scrollPane.width() - this.scrollContent.width() )
				);
				this._scrollHorizontalDistance(distance, duration);
			} else {
				this.scrollContent.css( "margin-left", 0 );
			}
		},

		/**
		 * Scrolls content vertically by percentage
		 */
		_scrollVertical: function (scrollbarValue, duration) {
			if ( this.scrollContent.height() > this.scrollPane.height() ) {
				var distance = Math.round(
					(100 - scrollbarValue) / 100 * ( this.scrollPane.height() - this.scrollContent.height() )
				);
				this._scrollVerticalDistance(distance, duration);
			} else {
				this.scrollContent.css( "margin-top", 0 );
			}
		},

		/**
		 * Scrolls content horizontally by a certain distance
		 * @param distance
		 * @param duration
		 */
		_scrollHorizontalDistance: function (distance, duration) {
			this.scrollContent.animate(
				{
					"margin-left":  distance + "px"
				}, {
					duration: duration/distance,
					easing: this.options.easing
				});
		},

		/**
		 * Scrolls content vertically by a certain distance
		 * @param distance
		 * @param duration
		 */
		_scrollVerticalDistance: function (distance, duration) {
			this.scrollContent.animate(
				{
					"margin-top": distance + "px"
				}, {
					duration: duration/distance,
					easing: this.options.easing
				});
		},

		/**
		 * Shows the scrollbar when needed
		 */
		_showScrollbar: function () {
			// Calculate offsets to determine if we need the scrollbar
			var widthOffset = this.containerElement.width() - this.scrollContent.width();
			var heightOffset = this.containerElement.height() - this.scrollContent.height();

			// If the content is larger than the allowed width or height, make the scrollbar
			if( ( (this.options.orientation == "horizontal") && (widthOffset < 0) ) || ( (this.options.orientation == "vertical") && ( heightOffset < 0) ) ) {
				// Set the active value to true so we know we've attached the scrollbar
				this.scrollbarActive = true;
				this.scrollbarWrapper.show();
				this.scrollContent.addClass('with-scrollbar');
				//init scrollbar size
				var self = this;
				setTimeout( function () { self._sizeScrollbar()} , 10 );//safari wants a timeout
			} else {
				if (this.scrollbarActive === true) {
					this.scrollbarActive = false;
					this.scrollbarWrapper.hide();
					this.scrollContent.removeClass('.with-scrollbar');
				}
			}
			// Size the content so there's space for the slider, or remove space for the slider
			this._sizeContent();
		},

		/**
		 * Resizes content based on the width of the vertical scrollbar
		 * TODO: Give me feed back on resizing a horizontal slider.
		 *       I think most designs will take that height in the design,
		 *       but this could be more convenient.
		 */
		_sizeContent: function () {
			if(this.options.orientation == "horizontal") {
				// TODO: yeah, maybe I'll add this... not strictly necessary
			} else {
				if (this.scrollbarActive === true) {
					this.scrollContent.css("width", this.scrollPane.width() - (this.scrollbarWrapper.outerWidth(true)));
				} else {
					this.scrollContent.css("width", "100%");
				}
			}
		},

		/**
		 * Size scrollbar and handle proportionally to content size
		 */
		_sizeScrollbar: function () {
			if(this.options.orientation == "horizontal") {
				var handleSize = this._calcScrollBarSize(this.scrollContent.width(), this.scrollPane.width());
				this.scrollbar.find( ".ui-slider-handle" ).css({
					width: handleSize,
					"margin-left": -handleSize / 2
				});
				this.handleHelper.width( "" ).width( this.scrollbar.width() - handleSize );
			} else {
				var handleSize = this._calcScrollBarSize(this.scrollContent.height(), this.scrollPane.height());
				this.scrollbar.find( ".ui-slider-handle" ).css({
					height: handleSize,
					"margin-top": -(handleSize / 2)
				});
				this.handleHelper.height( "" ).height( this.scrollbar.height() - handleSize ).css("margin-top", handleSize+'px');
			}
		},

		/**
		 * Calculation for handle size.
		 */
		_calcScrollBarSize: function (content, pane) {
			var remainder = content - pane;
			var proportion = remainder / content;
			var handleSize = pane - ( proportion * pane );
			return handleSize;
		},

		/**
		 * Reset slider value based on scroll content position
		 */
		_resetValue: function () {
			if(this.options.orientation == "horizontal"){
				var remainder = this.scrollPane.width() - this.scrollContent.width();
				var leftVal = this.scrollContent.css( "margin-left" ) === "auto" ? 0 :
					parseInt( this.scrollContent.css( "margin-left" ) );
				var percentage = Math.round( leftVal / remainder * 100 );
				this.scrollbar.slider( "value", percentage );
			} else {
				var remainder = this.scrollPane.height() - this.scrollContent.height();
				var topVal = this.scrollContent.css( "margin-top" ) === "auto" ? 0 :
					parseInt( this.scrollContent.css( "margin-top" ) );
				var percentage = Math.round( topVal / remainder * 100 );
				this.scrollbar.slider( "value", 100 - percentage );
			}
		},

		/**
		 * Reveal more content if the container gets larger
		 */
		_reflowContent: function () {
			if(this.options.orientation == "horizontal"){
				var showing = this.scrollContent.width() + parseInt( this.scrollContent.css( "margin-left" ), 10 );
				var gap = this.scrollPane.width() - showing;
				if ( gap > 0 ) {
					this.scrollContent.css( "margin-left", parseInt( this.scrollContent.css( "margin-left" ), 10 ) + gap );
				}
			} else {
				var showing = this.scrollContent.height() + parseInt( this.scrollContent.css( "margin-top" ), 10 );
				var gap = this.scrollPane.height() - showing;
				if ( gap > 0 ) {
					this.scrollContent.css( "margin-top", parseInt( this.scrollContent.css( "margin-top" ), 10 ) + gap );
				}
			}
		},

		/**
		 * Take care of all the cares that come with resizng the content or container
		 */
		resize: function () {
			this._showScrollbar();
			if(this.scrollbarActive) {
				this._resetValue();
				this._reflowContent();
			}
		},

		/**
		 * Scroll to a particular offset
		 */
		scrollToOffset: function (offset) {
			if(this.options.orientation == "horizontal") {
				// Calculate how much content is outside of the view
				var distance = this.calcDistanceToOffset( offset, this.scrollContent.width(), this.containerElement.width());
				this._scrollHorizontalDistance(distance, this.options.animationDuration);
			} else {
				// Calculate how much content is outside of the view
				var distance = this.calcDistanceToOffset( offset, this.scrollContent.height(), this.containerElement.height());
				this._scrollVerticalDistance(distance, this.options.animationDuration);
			}
		},

		/**
		 *
		 * @param viewSize
		 * @param contentSize
		 */
		calcDistanceToOffset: function (distance, contentSize, viewSize) {
			var contentRemainder = contentSize - distance;
			var remainder = viewSize - contentRemainder;
			var actualDistance = distance;
			if ( remainder < 0 ) {
				actualDistance = distance + remainder;
			}
			return actualDistance;
		},

		/**
		 * Restore the DOM to what it was before using the scrollbar
		 */
		destroy: function () {
			this.containerChildren.detach();
			this.containerElement.empty();
			this.containerElement.append(this.containerChildren);
		},

		/**
		 * Allow setting options after initialization
		 */
		_setOption: function (option, value) {
			// Apply default behaviour
			$.Widget.prototype._setOption.apply(this, arguments);
			// Apply specific behaviour
			switch(option) {
				case 'contentHeight':
					this.scrollContent.css("height", value);
					this._sizeScrollbar();
					break;
			}
		}
	})
})(jQuery);