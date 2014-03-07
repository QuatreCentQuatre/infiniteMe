/*
 * infiniteMe
 * Library to enable infinite scrolling easily
 * */
(function($, window, document, undefined){
	var InfiniteMe = function(options){
		this.__construct(options);
	};

	var proto = InfiniteMe.prototype;

	proto.options  = null;
	proto.defaults = {
		debug: false,
		item_per_page: 9,
		page_current: 1,
		page_total: null,
		toggler_enabled: true,
		toggler_container: null,
		toggler_page_offset: 3,
		infinite_offset: -100,
		infinite_scope: proto,
		infinite_params: {},
		infinite_context: null, // null, relative, scroll
		infinite_container: null,
		infinite_loader: null, // element
		event_onload: null
	};

	//--------Methods--------//
	proto.__construct = function(options) {
		if (!Me.help) {
			console.warn("infiniteMe :: required helpMe", "https://github.com/QuatreCentQuatre/helpMe");
			return;
		}

		if (!Me.dispatch) {
			console.warn("infiniteMe :: required dispatchMe", "https://github.com/QuatreCentQuatre/dispatchMe");
			return;
		}

		this.options = Me.help.extend({}, this.defaults);
		this.setOptions(options);

		if (!this.options.infinite_container) {
			console.warn("InfiniteMe :: need to set a 'infinite_container'");
			return;
		} else if (!this.options.infinite_container.length > 0) {
			console.warn("InfiniteMe :: need to set a valid 'infinite_container'");
			return;
		}

		if (this.options.toggler_enabled && !this.options.toggler_container) {
			console.warn("InfiniteMe :: need to set a 'toggler_container'");
			return;
		} else if (this.options.toggler_enabled && !this.options.toggler_container.length > 0) {
			console.warn("InfiniteMe :: need to set a valid 'toggler_container'");
			return;
		}

		this.$el = this.options.infinite_container;

		this.loadLock     = false;
		this.scrollLock   = false;
		this.scrollOffset = null;

		if (this.options.toggler_enabled) {
			this.options.toggler_container.find('a').on('click', Me.help.proxy(this.togglerClickHandler, this));
			if (this.options.toggler_page_offset == -1) {
				this.scrollLock = false;
				this.options.toggler_container.css({display:'block'});
			}
		}

		Me.dispatch.addEventListener("infiniteMe.onload", this.pageLoaded, this);

		$(window).resize(Me.help.proxy(this.resizeHandler, this));
		this.resizeHandler();

		if (this.options.infinite_context == "scroll") {
			this.$el.scroll(Me.help.proxy(this.scrollHandler, this));
		} else {
			$(window).scroll(Me.help.proxy(this.scrollHandler, this));
		}
		this.scrollHandler();
	};

	proto.setOptions = function(options) {
		this.options = Me.help.extend(this.options, options);
	};

	proto.addEvents = function() {

	};

	proto.reset = function() {
	};

	proto.getPage = function() {
		if (this.options.debug) {
			console.info("InfiniteMe :: getPage : " + this.options.page_current);
		}

		this.loadLock = true;

		if (this.options.infinite_loader && this.options.infinite_loader.length > 0) {
			this.options.infinite_loader.css({display:'block'});
		}

		this.data = Me.help.extend({}, this.options.infinite_params, {page:this.options.page_current, max:this.options.page_total});

		if (typeof this.options.event_onload == "function") {
			this.options.event_onload.call(this, this);
		} else {
			console.warn("infiniteMe :: need to set event_onload and dispatch 'infinite.onload'");
		}
	};

	proto.pageLoaded = function() {
		if (this.options.infinite_loader && this.options.infinite_loader.length > 0) {
			this.options.infinite_loader.css({display:'none'});
		}

		this.loadLock = false;
		if(this.options.toggler_enabled) {
			if (this.options.page_current < this.options.toggler_page_offset) {
				this.scrollLock = false;
			} else {
				if (this.options.page_current < this.options.page_total) {
					this.options.toggler_container.css({display:'block'});
				}
			}
		} else {
			this.scrollLock = false;
		}
		this.resizeHandler();
	};

	proto.togglerClickHandler = function(e) {
		e.preventDefault();
		if(!this.loadLock && this.options.page_current < this.options.page_total){
			this.options.page_current ++;
			if (this.options.toggler_enabled) {
				this.options.toggler_container.css({display:'none'});
			}
			this.getPage();
		}
	};

	proto.resizeHandler = function(){
		if (this.options.infinite_context == "scroll") {
			this.scrollOffset = this.$el[0].scrollHeight - this.$el.outerHeight();
		} else if (this.options.infinite_context == "relative") {
			this.scrollOffset = this.$el.offset().top - Me.help.getTotalH() + this.$el.outerHeight();
		} else {
			this.scrollOffset = $(document).height() - Me.help.getTotalH();
		}
	};

	proto.scrollHandler = function(){
		var scrollY;
		if (this.options.infinite_context == "scroll") {
			scrollY = Me.help.getScrollOffsets(this.$el).y;
		} else {
			scrollY = Me.help.getScrollOffsets().y;
		}

		if (!this.loadLock && !this.scrollLock && scrollY > this.scrollOffset + this.options.infinite_offset && this.options.page_current < this.options.page_total) {
			if (this.options.toggler_enabled) {
				if (this.options.page_current < this.options.toggler_page_offset) {
					this.options.page_current ++;
					this.scrollLock = true;
					this.getPage();
				}
			} else {
				this.options.page_current ++;
				this.scrollLock = true;
				this.getPage();
			}
		}
	};

	var privateMethods = {
	};

	if(!window.Me) {
		window.Me = {};
	}
	Me.infinite = InfiniteMe;
}(jQuery, window, document));