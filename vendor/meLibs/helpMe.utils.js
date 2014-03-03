/*
 * HelpMe Utils
 * Dimension Methods
 * */
(function($, window, document, undefined){

	var _scrollbarSize = null;

	var HelpMeUtils = {};

	HelpMeUtils.getScrollbarSize = function() {
		if(!_scrollbarSize) {
			$('body').append('<div id="h-fsb" style="width:50px;height:50px;overflow:hidden;position:absolute;top:-200px;left:-200px;"><div style="height:100px;">&nbsp;</div></div>');
			var $hfsb = $('#h-fsb');
			var w1 = $hfsb.find('div').innerWidth();
			$hfsb.css('overflow-y', 'scroll');
			var w2 = $hfsb.find('div').html('html is required to init new width.').innerWidth();
			$hfsb.remove();
			_scrollbarSize = w1 - w2;
		}
		return _scrollbarSize;
	};

	HelpMeUtils.getScrollOffsets = function($el) {
		var Yoffset = 0;
		var Xoffset = 0;

		if (!$el) {
			if (typeof pageYOffset!= 'undefined') {
				Yoffset = pageYOffset;
			} else {
				var B = document.body; //IE 'quirks'
				var D = document.documentElement; //IE with doctype
				D = (D.clientHeight)? D: B;
				Yoffset = D.scrollTop;
			}

			if (typeof pageXOffset!= 'undefined') {
				Xoffset = pageXOffset;
			} else {
				var B = document.body; //IE 'quirks'
				var D = document.documentElement; //IE with doctype
				D = (D.clientWidth)? D: B;
				Xoffset = D.scrollLeft;
			}
		} else {
			Yoffset = $el.scrollTop();
			Xoffset = $el.scrollLeft();
		}

		return {x:Xoffset, y:Yoffset};
	};

	HelpMeUtils.hasVScroll = function() {
		var _hasVScroll = $(document).height() > $(window).height();
		return _hasVScroll;
	};

	HelpMeUtils.hasHScroll = function() {
		var _hasHScroll = $(document).width() > $(window).width();
		return _hasHScroll;
	};

	HelpMeUtils.getTotalW = function(){
		var total = $(window).width();
		if (this.hasVScroll()) {
			total += this.getScrollbarSize();
		}
		return total;
	};

	HelpMeUtils.getTotalH = function(){
		var total = $(window).height();
		if (this.hasHScroll()) {
			total += this.getScrollbarSize();
		}
		return total;
	};

	if (window.Me && window.Me.help) {
		Me.help = Me.help.extend(Me.help, HelpMeUtils);
	}
}(jQuery, window, document));