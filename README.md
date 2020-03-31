Combyna GUI plugin
==================

[![Build Status](https://secure.travis-ci.org/combyna/gui-plugin.png?branch=master)](http://travis-ci.org/combyna/gui-plugin)

Base GUI support plugin for [Combyna](https://github.com/combyna/combyna).

Adds support for using [React](https://reactjs.org/) to render your Combyna app's UI.

## Widget definitions provided

### `gui.box` primitive
Used as a generic container that should be presented as a grouped section.
Semantically equivalent to a `<div>` in HTML.

### `gui.button` primitive
Used for push buttons. A label is provided as the attribute `label`.

### `gui.container` primitive
Used as a generic container. Semantically equivalent to a `<div>` in HTML.

### `gui.heading` primitive
Defines a heading. Semantically equivalent to a `<hX>` in HTML.
Its level/depth is provided as the numeric attribute `level`.

### `gui.horizontal_rule` primitive
Defines a horizontal rule. Semantically equivalent to a `<hr>` in HTML.

### `gui.list` primitive
Contains a list of `gui.list_item` items.
Semantically equivalent to a `<ul>` or `<ol>` in HTML.
Whether it is ordered or unordered is specified with the boolean attribute `ordered`.

### `gui.list_item` primitive
Defines an item within a `gui.list` list.
Semantically equivalent to an `<li>` in HTML.

### `gui.navigation` primitive
Defines a navigation section. Semantically equivalent to a `<nav>` in HTML.

### `gui.route_link` compound
Defines a hyperlink to a defined route. Semantically equivalent to a `<a>` in HTML.
Renders to a `gui.url_link` under the hood.
Its route and arguments are provided as the `route` and `arguments`
attributes respectively. Route will be validated to ensure it exists
and the arguments will be validated to ensure they are valid for the specified route.
Validation is performed via Exotic type determiners for both attributes.

See also `gui.url_link`.

### `gui.textbox` primitive
Defines a textbox for text entry. Semantically equivalent to an `<input type="text">` in HTML.
Its default value is provided as the `value` string attribute,
while its current value is made available as the `text` widget value (which defaults to the `value` attribute).

### `gui.url_link` primitive
Defines a hyperlink to an arbitrary URL. Semantically equivalent to a `<a>` in HTML.
Its target URL/href is provided as the `url` string attribute.
