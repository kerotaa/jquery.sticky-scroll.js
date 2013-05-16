(($, window)->

	class StickyScroll
		_$win = $(window)

		constructor:(_configs)->
			_insid = ".StickyScroll" + new Date().getTime()
			_$elem = _configs.target
			_$wrap = _configs.container ? _$elem.parent()
			_wrapWidth = _$wrap.outerWidth()
			_pause = false
			_fromTop = false
			_nowFixed = false
			
			_getClone = ->
				$('<div />').css({
					visibility: 'hidden',
					width: _$elem.outerWidth(),
					height: _$elem.outerHeight(),
					position: _$elem.css('position') ? 'static',
					left: _$elem.css('left') ? '',
					right: _$elem.css('right') ? '',
					margin: _$elem.css('margin'),
					float: _$elem.css('float')
				}).insertAfter(_$elem)
				
			_$clone = _getClone()
			
			_defaultStyle =
				position: _$elem.css('position') ? '',
				top: _$elem.css('top') ? '',
				left: _$elem.css('left') ? '',
				right: _$elem.css('right') ? ''

			_fixed = ->
				return if (_pause)
				
				_$clone.width( _$elem.outerWidth() )
				_$clone.height( _$elem.outerHeight() )
				
				scrollPos = _$win.scrollTop()
				wrapPos = _$wrap.offset()
				elemPos = _$clone.offset()
				elemHeight = _$elem.outerHeight()
				wrapHeight = _$wrap.outerHeight()
				winHeight = _$win.height()
				elemStylePos = _$elem.css('position')
				winTargetGap = winHeight - elemHeight
				
				fixedTop = _configs.top ? wrapPos.top
				fixedBottom = _configs.bottom ? wrapPos.top + wrapHeight
				fixedHeight = fixedBottom - fixedTop
				
				top = fixedTop - scrollPos
				_nowFixed = false

				if ( !elemStylePos || elemStylePos == 'static' )
					elemPos = _$elem.offset()

				if ( top < _configs.gap )
					top = _configs.gap if (!_fromTop)
					if (top - _configs.gap < winTargetGap )
						_nowFixed = true
						if (winTargetGap > 0)
							top = _configs.gap
						else
							top = winTargetGap
				else
					_fromTop = true
				
				containerBottom = fixedBottom - scrollPos
				targetBottom = top + elemHeight
				overBottom = targetBottom - containerBottom
				if (overBottom > 0)
					_nowFixed = false
					_fromTop = false
					top -= overBottom
				
				_$elem.css(
					position: 'fixed',
					top: top,
					left: elemPos.left - _$win.scrollLeft()
				)
				
				return

			_$win.on('scroll'+_insid+' load'+_insid+' resize'+_insid, _fixed)
			
			if ( _configs.range.min != null || _configs.range.max != null )
				_rangeCheck = ->
					winSize = _$win.width()
					if ( (_configs.range.min != null && _configs.range.min > winSize) || (_configs.range.max != null && _configs.range.max < winSize) )
						if ( !_pause )
							_pause = true
							_$win.off('scroll'+_insid+' load'+_insid+' resize'+_insid, _fixed)
							_$elem.css(_defaultStyle)
							_$clone.remove()
					else if ( _pause )
						_pause = false
						_$clone = _getClone()
						_$win.on('scroll load resize', _fixed).trigger('resize')
					return
				
				_$win.on('load'+_insid+' resize'+_insid, _rangeCheck)
			
			@reset = ->
				_$win.off('scroll'+_insid+' load'+_insid+' resize'+_insid)
				_$elem.css(_defaultStyle)
				_pause = true
				_$clone.remove()
				return

	$.StickyScroll = $.noop
	$.StickyScroll.destroy = (elem)->
		return $(elem).each(->
			$this = $(this)
			if ( $this.data('StickyScroll') )
				$this.data('StickyScroll').reset()
				$this.data('StickyScroll', null)
			return
		)

	$.fn.StickyScroll = (options)->
		return this.each(->
			$this = $(this)
			if ( $this.data('StickyScroll') )
				$.StickyScroll.destroy($this)
			configs = $.extend(true, { target: $this }, $.fn.StickyScroll.defaults, options)
			$this.data('StickyScroll', new StickyScroll(configs))
			return
		)

	$.fn.StickyScroll.defaults =
		top: null,
		bottom: null,
		container: null,
		gap: 0,
		range:
			min: null,
			max: null

	return
)(jQuery, window)