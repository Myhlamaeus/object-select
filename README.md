# object-select [![Build Status](https://secure.travis-ci.org/ileri/object-select.png?branch=master)](http://travis-ci.org/ileri/object-select)

> A selector engine for JavaScript Objects.


## Getting Started

Install the module with: `npm install object-select --save`
Note: this requires the --harmony_collections flag

```js
var objectSelect = require('./lib/object-select'),
    selector = new objectSelect.ComplexSelector(".example :matches(:first-child, :last-child)"); // create selector

console.log(selector.find({
    "example": ["this is the first child", "some other child", "this is the last child"]
})); // ["this is the first child", "this is the last child"]);
```

```sh
# creates a browser.js and a browser.min.js in dist
$ grunt browser
```
Requires Map



## Documentation

_(Coming soon)_


## Examples

_(Coming soon)_


## Contributing

In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com).


## License

Copyright (c) 2014 Malte-Maurice Dreyer  
Licensed under the MIT license.
