# object-select [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url] [![Coverage percentage][coveralls-image]][coveralls-url]

> A selector engine for JavaScript Objects.

## Installation

```sh
$ npm install --save object-select
```

## Usage

```js
import objectSelect from "object-select";
const objectSelect = require("object-select");

const selector = objectSelect(".test :matches(.test2, .test3)");

selector.find({
  test: {
    test2: ["abc"],
    test3: ["def"]
  }
}); // [['abc'], ['def']]
```

## License

MIT © [Myhlamaeus](https://github.com/Myhlamaeus)

[npm-image]: https://badge.fury.io/js/object-select.svg
[npm-url]: https://npmjs.org/package/object-select
[travis-image]: https://travis-ci.org/Myhlamaeus/object-select.svg?branch=master
[travis-url]: https://travis-ci.org/Myhlamaeus/object-select
[daviddm-image]: https://david-dm.org/Myhlamaeus/object-select.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/Myhlamaeus/object-select
[coveralls-image]: https://coveralls.io/repos/Myhlamaeus/object-select/badge.svg
[coveralls-url]: https://coveralls.io/r/Myhlamaeus/object-select
