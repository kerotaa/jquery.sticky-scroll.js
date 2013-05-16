# jQuery Sticky Scroll
Make elements stick to the top of your page as you scroll.

## Usage
```javascript
$(selector).StickyScroll(options);
```

## Options
```javascript
{
	top: null,       // starting position
	bottom: null,    // ending position
	container: null, // container
	gap: 0,          // space of the page top
	range: {         // valid range of the window width
		min: null,
		max: null
	}
}
```

## Method

### $.StickyScroll.destroy()
Detach StickyScroll from elements
```javascript
$.StickyScroll.destroy(selector);
```
