jQuery UI Scrollbar
===================

This is a simple scrollpane type component for jQuery UI. It is intended to be
a general purpose component, used anytime you need a custom JS scrollbar in a
jQuery UI environment. It is adapted out of frustration of turning the slider
example of a horizontal scrollbar into a vertical scrollbar.

Usage
-----

Using the plugin is simple. After you include jQuery, jQuery UI,
```js/jquery.ui.scrollbar.js``` (or the minified version), and
```css/jquery.ui.scrollbar.css``` just call:

```js
$(document).ready(function()
{
  $(".scroll-pane").scrollbar({orientation: 'vertical'});
});
```

Where ```.scroll-pane``` is the name of the element(s) you want to wrap. By
default the plugin will set the orientation to 'horizontal'.

Options
-------

Other options that can be set are:

* ```scrollFactor``` - How far the mousewheel will scroll per event.
* ```easing``` - The easing function to use for the scrolling animation.
* ```animationDuration``` - How long (in milliseconds) the animation will take for one unit (divided by distance).

The default options are:

```js
{
	orientation: "horizontal",
	scrollFactor: 15,
	easing: 'linear',
	animationDuration: 20
}
```

Methods
-------

If the content inside of the scrollbar changes in size, the .resize() method
should be called. Since this component is written as a UI widget, this method
needs to be called a certain way:

```js
$(".scroll-pane").data("scrollbar").resize();
```

One day, all browsers may actually support a resize event for all elements and not
just the window object.

Themes
------

By default, the plugin will use your default jQuery UI theme.

If you want to theme the plugin, there is an example of a theme in the
```css/themes/greyshade.css``` file. This theme is used in the example.
