/**
 * InfiniteMe from the MeLibs
 * Library to enable infinite scrolling easily
 *
 * Version :
 *  - 1.1.0
 *
 * Dependencies :
 *  - jQuery     (http://jquery.com/download/)
 *  - HelpMe     (https://github.com/QuatreCentQuatre/helpMe)
 *  - DispatchMe (https://github.com/QuatreCentQuatre/dispatchMe)
 *
 * Public Methods :
 *  - setOptions
 *  - getOptions
 *  - reset
 *  - getPage
 *  - pageLoaded
 *  - togglerClickHandler
 *  - resizeHandler
 *  - scrollHandler
 *
 * Private Methods :
 *  -
 *
 * Updates Needed :
 *  -
 */

(function($, window, document, undefined) {
    "use strict";

    /* Private Variables */
    var instanceID      = 1;
    var instanceName    = "InfiniteMe";
    var defaults        = {
        debug: false,
        item_per_page: 9,
        page_current: 1,
        page_total: null,
        toggler_enabled: true,
        toggler_button: null,
        toggler_page_offset: 3,
        infinite_offset: -100,
        infinite_params: {},
        infinite_context: null, // null, relative, scroll
        infinite_loader: null,  // element
        event_onload: null
    };
    var overwriteKeys   = [
        'debug'
    ];

    /* Private Methods */
    var privatesMethods = {};

    /* Builder Method */
    var InfiniteMe = function($element, options) {
        this.__construct($element, options);
    };

    var proto = InfiniteMe.prototype;

    /* Private Variables */
    proto.__id          = null;
    proto.__name        = null;
    proto.__debugName   = null;

    /* Publics Variables */
    proto.debug         = null;
    proto.options       = null;
    proto.$el           = null;

    /**
     *
     * __construct
     * the first method that will be executed.
     *
     * @param   options     all the options that you need
     * @return  object      null || scope
     * @access  private
     *
     */
    proto.__construct = function($element, options) {
        this.__id        = instanceID;
        this.__name      = instanceName;
        this.__debugName = this.__name + " :: ";

        this.$el         = $element;

        this.setOptions(options);

        if (!this.__validateDependencies()) {return null;}
        if (!this.__validateArguments()) {return null;}

        instanceID ++;
        this.__initialize();

        return this;
    };

    /**
     *
     * __validateDependencies
     * Will check if you got all the dependencies needed to use that plugins
     *
     * @return  boolean
     * @access  private
     *
     */
    proto.__validateDependencies = function() {
        var isValid = true;

        if (!window.jQuery) {
            isValid = false;
            if (this.debug) {console.warn(this.__debugName + "required jQuery (http://jquery.com/download/)");}
        }

        if (!Me.help) {
            isValid = false;
            if (this.debug) {console.warn(this.__debugName + "required HelpMe (https://github.com/QuatreCentQuatre/helpMe)");}
        }

        if (!Me.dispatch) {
            isValid = false;
            if (this.debug) {console.warn(this.__debugName + "required DispatchMe (https://github.com/QuatreCentQuatre/dispatchMe)");}
        }

        return isValid;
    };

    /**
     *
     * __validateArguments
     * Will check if you got all the required options needed to use that plugins
     *
     * @return  boolean
     * @access  private
     *
     */
    proto.__validateArguments = function() {
        var isValid = true;

        if (!this.$el.length > 0) {
            isValid = false;
            if (this.debug) {console.warn(this.__debugName + "couldn't find associated element", this.$el);}
        }

        if (this.options.toggler_enabled && !this.options.toggler_button) {
            isValid = false;
            if (this.debug) {console.warn(this.__debugName + "need to set a 'toggler_button'");}
        } else if (this.options.toggler_enabled && !this.options.toggler_button.length > 0) {
            isValid = false;
            if (this.debug) {console.warn(this.__debugName + "need to set a valid 'toggler_button'");}
        }

        if (typeof this.options.event_onload != "function") {
            isValid = false;
            if (this.debug) {console.warn(this.__debugName + "need to set event_onload and dispatch 'InfiniteMe.onload'");}
        }

        return isValid;
    };

    /**
     *
     * __initialize
     * set the basics
     *
     * @return  object scope
     * @access  private
     *
     */
    proto.__initialize = function() {
        this.loadLock = false;

        if(this.options.toggler_enabled) {
            this.toggler_display = this.options.toggler_button.css('display');
            this.options.toggler_button.css({display: 'none'});
        }

        Me.dispatch.subscribe("InfiniteMe.onload", this.pageLoaded, this);

        $(window).resize($.proxy(this.resizeHandler, this));

        (this.options.infinite_context == "scroll") ? this.$el.scroll($.proxy(this.scrollHandler, this)) : $(window).scroll($.proxy(this.scrollHandler, this));

        this.reset();

        return this;
    };

    /**
     *
     * setOptions
     * will merge options to the plugin defaultKeys and the rest will be set as additionnal options
     *
     * @param   options
     * @return  object      scope
     * @access  public
     *
     */
    proto.setOptions = function(options) {
        var scope    = this;
        var settings = (this.options) ? $.extend({}, this.options, options) : $.extend({}, defaults, options);

        $.each(settings, function(index, value) {
            if ($.inArray(index, overwriteKeys) != -1) {
                scope[index] = value;
                delete settings[index];
            }
        });

        this.options = settings;

        return this;
    };

    /**
     *
     * getOptions
     * return the additional options that left
     *
     * @return  object options
     * @access  public
     *
     */
    proto.getOptions = function() {
        return this.options;
    };

    /**
     *
     * reset
     *
     * @access  public
     *
     */
    proto.reset = function() {
        this.scrollLock   = false;
        this.scrollOffset = null;

        if (this.options.toggler_enabled) {
            this.options.toggler_button.on('click', $.proxy(this.togglerClickHandler, this));

            if (this.options.toggler_page_offset == -1 && this.options.page_current < this.options.page_total) {
                this.scrollLock = false;
                this.options.toggler_button.css({display: this.toggler_display});
            }
        }

        this.resizeHandler();
        this.scrollHandler();
    };

    /**
     *
     * getPage
     *
     * @access  public
     *
     */
    proto.getPage = function() {
        if (this.debug) {console.info(this.__debugName + "getPage : " + this.options.page_current);}

        this.loadLock = true;

        if (this.options.infinite_loader && this.options.infinite_loader.length > 0) {
            this.options.infinite_loader.css({display:'block'});
        }

        this.data = $.extend({}, this.options.infinite_params, {page:this.options.page_current, max:this.options.page_total});

        this.options.event_onload.call(this, this);
    };

    /**
     *
     * pageLoaded
     *
     * @access  public
     *
     */
    proto.pageLoaded = function() {
        if (this.options.infinite_loader && this.options.infinite_loader.length > 0) {
            this.options.infinite_loader.css({display:'none'});
        }

        this.loadLock = false;

        if (this.options.toggler_enabled) {
            if (this.options.page_current < this.options.toggler_page_offset) {
                this.scrollLock = false;
            } else {
                if (this.options.page_current < this.options.page_total) {
                    this.options.toggler_button.css({display: this.toggler_display});
                }
            }
        } else {
            this.scrollLock = false;
        }

        this.resizeHandler();
    };

    /**
     *
     * togglerClickHandler
     *
     * @param   e           event
     * @access  public
     *
     */
    proto.togglerClickHandler = function(e) {
        e.preventDefault();

        if (!this.loadLock && this.options.page_current < this.options.page_total) {
            this.options.page_current ++;

            if (this.options.toggler_enabled) {
                this.options.toggler_button.css({display:'none'});
            }

            this.getPage();
        }
    };

    /**
     *
     * resizeHandler
     *
     * @access  public
     *
     */
    proto.resizeHandler = function() {
        if (this.options.infinite_context == "scroll") {
            this.scrollOffset = this.$el[0].scrollHeight - this.$el.outerHeight();
        } else if (this.options.infinite_context == "relative") {
            this.scrollOffset = this.$el.offset().top + this.$el.outerHeight() - Me.help.dimension.getTotalH();
        } else {
            this.scrollOffset = $(document).height() - Me.help.dimension.getTotalH();
        }
    };

    /**
     *
     * scrollHandler
     *
     * @access  public
     *
     */
    proto.scrollHandler = function(){
        var scrollY = (this.options.infinite_context == "scroll") ? Me.help.dimension.getScrollOffsets(this.$el).y : Me.help.dimension.getScrollOffsets().y;

        if (!this.loadLock && !this.scrollLock && scrollY > (this.scrollOffset + this.options.infinite_offset) && this.options.page_current < this.options.page_total) {
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

    proto.toString = function() {
        return "[" + this.__name + "]";
    };

    /* Create Me reference if does'nt exist */
    if (!window.Me) {window.Me = {};}

    /*  */
    Me.infinite = InfiniteMe;
}(jQuery, window, document));