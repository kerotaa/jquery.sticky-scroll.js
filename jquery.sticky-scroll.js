/*!
 * jquery.sticky-scroll.js - v0.0.3 - https://github.com/kerotaa/jquery.sticky-scroll.js
 * Make elements stick to the top of your page as you scroll
 * 
 * 
 * Copyright (c) 2013 kerotaa (http://kerotaa.hateblo.jp/)
 * Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php).
 * 2013-05-17
 **/
;(function($, window) {
  var StickyScroll;

  StickyScroll = (function() {
    var _$win;

    _$win = $(window);

    function StickyScroll(_configs) {
      var _$clone, _$elem, _$wrap, _defaultStyle, _fixed, _fromTop, _getClone, _insid, _nowFixed, _pause, _rangeCheck, _ref, _ref1, _ref2, _ref3, _ref4, _wrapWidth;

      _insid = ".StickyScroll" + new Date().getTime();
      _$elem = _configs.target;
      _$wrap = (_ref = _configs.container) != null ? _ref : _$elem.parent();
      _wrapWidth = _$wrap.outerWidth();
      _pause = false;
      _fromTop = false;
      _nowFixed = false;
      _getClone = function() {
        var _ref1, _ref2, _ref3;

        return $('<div />').css({
          visibility: 'hidden',
          width: _$elem.outerWidth(),
          height: _$elem.outerHeight(),
          position: (_ref1 = _$elem.css('position')) != null ? _ref1 : 'static',
          left: (_ref2 = _$elem.css('left')) != null ? _ref2 : '',
          right: (_ref3 = _$elem.css('right')) != null ? _ref3 : '',
          margin: _$elem.css('margin'),
          float: _$elem.css('float')
        }).insertAfter(_$elem);
      };
      _$clone = _getClone();
      _defaultStyle = {
        position: (_ref1 = _$elem.css('position')) != null ? _ref1 : '',
        top: (_ref2 = _$elem.css('top')) != null ? _ref2 : '',
        left: (_ref3 = _$elem.css('left')) != null ? _ref3 : '',
        right: (_ref4 = _$elem.css('right')) != null ? _ref4 : ''
      };
      _fixed = function() {
        var containerBottom, elemHeight, elemPos, elemStylePos, fixedBottom, fixedHeight, fixedTop, overBottom, scrollPos, targetBottom, top, winHeight, winTargetGap, wrapHeight, wrapPos, _ref5, _ref6;

        if (_pause) {
          return;
        }
        _$clone.width(_$elem.outerWidth());
        _$clone.height(_$elem.outerHeight());
        scrollPos = _$win.scrollTop();
        wrapPos = _$wrap.offset();
        elemPos = _$clone.offset();
        elemHeight = _$elem.outerHeight();
        wrapHeight = _$wrap.outerHeight();
        winHeight = _$win.height();
        elemStylePos = _$elem.css('position');
        winTargetGap = winHeight - elemHeight;
        fixedTop = (_ref5 = _configs.top) != null ? _ref5 : wrapPos.top;
        fixedBottom = (_ref6 = _configs.bottom) != null ? _ref6 : wrapPos.top + wrapHeight;
        fixedHeight = fixedBottom - fixedTop;
        top = fixedTop - scrollPos;
        _nowFixed = false;
        if (!elemStylePos || elemStylePos === 'static') {
          elemPos = _$elem.offset();
        }
        if (top < _configs.gap) {
          if (!_fromTop) {
            top = _configs.gap;
          }
          if (top - _configs.gap < winTargetGap) {
            _nowFixed = true;
            if (winTargetGap > 0) {
              top = _configs.gap;
            } else {
              top = winTargetGap;
            }
          }
        } else {
          _fromTop = true;
        }
        containerBottom = fixedBottom - scrollPos;
        targetBottom = top + elemHeight;
        overBottom = targetBottom - containerBottom;
        if (overBottom > 0) {
          _nowFixed = false;
          _fromTop = false;
          top -= overBottom;
        }
        _$elem.css({
          position: 'fixed',
          top: top,
          left: elemPos.left - _$win.scrollLeft()
        });
      };
      _$win.on('scroll' + _insid + ' load' + _insid + ' resize' + _insid, _fixed);
      if (_configs.range.min !== null || _configs.range.max !== null) {
        _rangeCheck = function() {
          var winSize;

          winSize = _$win.width();
          if ((_configs.range.min !== null && _configs.range.min > winSize) || (_configs.range.max !== null && _configs.range.max < winSize)) {
            if (!_pause) {
              _pause = true;
              _$win.off('scroll' + _insid + ' load' + _insid + ' resize' + _insid, _fixed);
              _$elem.css(_defaultStyle);
              _$clone.remove();
            }
          } else if (_pause) {
            _pause = false;
            _$clone = _getClone();
            _$win.on('scroll load resize', _fixed).trigger('resize');
          }
        };
        _$win.on('load' + _insid + ' resize' + _insid, _rangeCheck);
      }
      this.reset = function() {
        _$win.off('scroll' + _insid + ' load' + _insid + ' resize' + _insid);
        _$elem.css(_defaultStyle);
        _pause = true;
        _$clone.remove();
      };
    }

    return StickyScroll;

  })();
  $.StickyScroll = $.noop;
  $.StickyScroll.destroy = function(elem) {
    return $(elem).each(function() {
      var $this;

      $this = $(this);
      if ($this.data('StickyScroll')) {
        $this.data('StickyScroll').reset();
        $this.data('StickyScroll', null);
      }
    });
  };
  $.fn.StickyScroll = function(options) {
    return this.each(function() {
      var $this, configs;

      $this = $(this);
      if ($this.data('StickyScroll')) {
        $.StickyScroll.destroy($this);
      }
      configs = $.extend(true, {
        target: $this
      }, $.fn.StickyScroll.defaults, options);
      $this.data('StickyScroll', new StickyScroll(configs));
    });
  };
  $.fn.StickyScroll.defaults = {
    top: null,
    bottom: null,
    container: null,
    gap: 0,
    isFixed: $.noop,
    range: {
      min: null,
      max: null
    }
  };
})(jQuery, window);
