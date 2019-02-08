// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"DG/7":[function(require,module,exports) {
/* file : formulas.js
MIT License

Copyright (c) 2017 Thomas Minier & Arnaud Grall

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

'use strict'

/**
 * Various formulas used with Bloom Filters
 * @namespace Formulas
 * @private
 */

 /**
 * Compute the optimal size of a Bloom Filter
 * @param  {int} setLength - The length of the dataset used to fill the filter
 * @param  {number} errorRate - The targeted false positive rate
 * @return {int} The optimal size of a Bloom Filter
 * @memberof Formulas
 */
const optimalFilterSize = (setLength, errorRate) => {
  return Math.ceil(-((setLength * Math.log(errorRate)) / Math.pow(Math.log(2), 2)))
}

/**
 * Compute the optimal number of hash functions to be used by a Bloom Filter
 * @param  {int} size - The size of the filter
 * @param  {int} setLength - The length of the dataset used to fill the filter
 * @return {int} The optimal number of hash functions to be used by a Bloom Filter
 * @memberof Formulas
 */
const optimalHashes = (size, setLength) => {
  return Math.ceil((size / setLength) * Math.log(2))
}

module.exports = {
  optimalFilterSize,
  optimalHashes
}

},{}],"o3Up":[function(require,module,exports) {
var define;
/* jshint -W086: true */
// +----------------------------------------------------------------------+
// | murmurHash3js.js v3.0.1 // https://github.com/pid/murmurHash3js
// | A javascript implementation of MurmurHash3's x86 hashing algorithms. |
// |----------------------------------------------------------------------|
// | Copyright (c) 2012-2015 Karan Lyons                                       |
// | https://github.com/karanlyons/murmurHash3.js/blob/c1778f75792abef7bdd74bc85d2d4e1a3d25cfe9/murmurHash3.js |
// | Freely distributable under the MIT license.                          |
// +----------------------------------------------------------------------+
;

(function (root, undefined) {
  'use strict'; // Create a local object that'll be exported or referenced globally.

  var library = {
    'version': '3.0.1',
    'x86': {},
    'x64': {}
  }; // PRIVATE FUNCTIONS
  // -----------------

  function _x86Multiply(m, n) {
    //
    // Given two 32bit ints, returns the two multiplied together as a
    // 32bit int.
    //
    return (m & 0xffff) * n + (((m >>> 16) * n & 0xffff) << 16);
  }

  function _x86Rotl(m, n) {
    //
    // Given a 32bit int and an int representing a number of bit positions,
    // returns the 32bit int rotated left by that number of positions.
    //
    return m << n | m >>> 32 - n;
  }

  function _x86Fmix(h) {
    //
    // Given a block, returns murmurHash3's final x86 mix of that block.
    //
    h ^= h >>> 16;
    h = _x86Multiply(h, 0x85ebca6b);
    h ^= h >>> 13;
    h = _x86Multiply(h, 0xc2b2ae35);
    h ^= h >>> 16;
    return h;
  }

  function _x64Add(m, n) {
    //
    // Given two 64bit ints (as an array of two 32bit ints) returns the two
    // added together as a 64bit int (as an array of two 32bit ints).
    //
    m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
    n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
    var o = [0, 0, 0, 0];
    o[3] += m[3] + n[3];
    o[2] += o[3] >>> 16;
    o[3] &= 0xffff;
    o[2] += m[2] + n[2];
    o[1] += o[2] >>> 16;
    o[2] &= 0xffff;
    o[1] += m[1] + n[1];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[0] += m[0] + n[0];
    o[0] &= 0xffff;
    return [o[0] << 16 | o[1], o[2] << 16 | o[3]];
  }

  function _x64Multiply(m, n) {
    //
    // Given two 64bit ints (as an array of two 32bit ints) returns the two
    // multiplied together as a 64bit int (as an array of two 32bit ints).
    //
    m = [m[0] >>> 16, m[0] & 0xffff, m[1] >>> 16, m[1] & 0xffff];
    n = [n[0] >>> 16, n[0] & 0xffff, n[1] >>> 16, n[1] & 0xffff];
    var o = [0, 0, 0, 0];
    o[3] += m[3] * n[3];
    o[2] += o[3] >>> 16;
    o[3] &= 0xffff;
    o[2] += m[2] * n[3];
    o[1] += o[2] >>> 16;
    o[2] &= 0xffff;
    o[2] += m[3] * n[2];
    o[1] += o[2] >>> 16;
    o[2] &= 0xffff;
    o[1] += m[1] * n[3];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[1] += m[2] * n[2];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[1] += m[3] * n[1];
    o[0] += o[1] >>> 16;
    o[1] &= 0xffff;
    o[0] += m[0] * n[3] + m[1] * n[2] + m[2] * n[1] + m[3] * n[0];
    o[0] &= 0xffff;
    return [o[0] << 16 | o[1], o[2] << 16 | o[3]];
  }

  function _x64Rotl(m, n) {
    //
    // Given a 64bit int (as an array of two 32bit ints) and an int
    // representing a number of bit positions, returns the 64bit int (as an
    // array of two 32bit ints) rotated left by that number of positions.
    //
    n %= 64;

    if (n === 32) {
      return [m[1], m[0]];
    } else if (n < 32) {
      return [m[0] << n | m[1] >>> 32 - n, m[1] << n | m[0] >>> 32 - n];
    } else {
      n -= 32;
      return [m[1] << n | m[0] >>> 32 - n, m[0] << n | m[1] >>> 32 - n];
    }
  }

  function _x64LeftShift(m, n) {
    //
    // Given a 64bit int (as an array of two 32bit ints) and an int
    // representing a number of bit positions, returns the 64bit int (as an
    // array of two 32bit ints) shifted left by that number of positions.
    //
    n %= 64;

    if (n === 0) {
      return m;
    } else if (n < 32) {
      return [m[0] << n | m[1] >>> 32 - n, m[1] << n];
    } else {
      return [m[1] << n - 32, 0];
    }
  }

  function _x64Xor(m, n) {
    //
    // Given two 64bit ints (as an array of two 32bit ints) returns the two
    // xored together as a 64bit int (as an array of two 32bit ints).
    //
    return [m[0] ^ n[0], m[1] ^ n[1]];
  }

  function _x64Fmix(h) {
    //
    // Given a block, returns murmurHash3's final x64 mix of that block.
    // (`[0, h[0] >>> 1]` is a 33 bit unsigned right shift. This is the
    // only place where we need to right shift 64bit ints.)
    //
    h = _x64Xor(h, [0, h[0] >>> 1]);
    h = _x64Multiply(h, [0xff51afd7, 0xed558ccd]);
    h = _x64Xor(h, [0, h[0] >>> 1]);
    h = _x64Multiply(h, [0xc4ceb9fe, 0x1a85ec53]);
    h = _x64Xor(h, [0, h[0] >>> 1]);
    return h;
  } // PUBLIC FUNCTIONS
  // ----------------


  library.x86.hash32 = function (key, seed) {
    //
    // Given a string and an optional seed as an int, returns a 32 bit hash
    // using the x86 flavor of MurmurHash3, as an unsigned int.
    //
    key = key || '';
    seed = seed || 0;
    var remainder = key.length % 4;
    var bytes = key.length - remainder;
    var h1 = seed;
    var k1 = 0;
    var c1 = 0xcc9e2d51;
    var c2 = 0x1b873593;

    for (var i = 0; i < bytes; i = i + 4) {
      k1 = key.charCodeAt(i) & 0xff | (key.charCodeAt(i + 1) & 0xff) << 8 | (key.charCodeAt(i + 2) & 0xff) << 16 | (key.charCodeAt(i + 3) & 0xff) << 24;
      k1 = _x86Multiply(k1, c1);
      k1 = _x86Rotl(k1, 15);
      k1 = _x86Multiply(k1, c2);
      h1 ^= k1;
      h1 = _x86Rotl(h1, 13);
      h1 = _x86Multiply(h1, 5) + 0xe6546b64;
    }

    k1 = 0;

    switch (remainder) {
      case 3:
        k1 ^= (key.charCodeAt(i + 2) & 0xff) << 16;

      case 2:
        k1 ^= (key.charCodeAt(i + 1) & 0xff) << 8;

      case 1:
        k1 ^= key.charCodeAt(i) & 0xff;
        k1 = _x86Multiply(k1, c1);
        k1 = _x86Rotl(k1, 15);
        k1 = _x86Multiply(k1, c2);
        h1 ^= k1;
    }

    h1 ^= key.length;
    h1 = _x86Fmix(h1);
    return h1 >>> 0;
  };

  library.x86.hash128 = function (key, seed) {
    //
    // Given a string and an optional seed as an int, returns a 128 bit
    // hash using the x86 flavor of MurmurHash3, as an unsigned hex.
    //
    key = key || '';
    seed = seed || 0;
    var remainder = key.length % 16;
    var bytes = key.length - remainder;
    var h1 = seed;
    var h2 = seed;
    var h3 = seed;
    var h4 = seed;
    var k1 = 0;
    var k2 = 0;
    var k3 = 0;
    var k4 = 0;
    var c1 = 0x239b961b;
    var c2 = 0xab0e9789;
    var c3 = 0x38b34ae5;
    var c4 = 0xa1e38b93;

    for (var i = 0; i < bytes; i = i + 16) {
      k1 = key.charCodeAt(i) & 0xff | (key.charCodeAt(i + 1) & 0xff) << 8 | (key.charCodeAt(i + 2) & 0xff) << 16 | (key.charCodeAt(i + 3) & 0xff) << 24;
      k2 = key.charCodeAt(i + 4) & 0xff | (key.charCodeAt(i + 5) & 0xff) << 8 | (key.charCodeAt(i + 6) & 0xff) << 16 | (key.charCodeAt(i + 7) & 0xff) << 24;
      k3 = key.charCodeAt(i + 8) & 0xff | (key.charCodeAt(i + 9) & 0xff) << 8 | (key.charCodeAt(i + 10) & 0xff) << 16 | (key.charCodeAt(i + 11) & 0xff) << 24;
      k4 = key.charCodeAt(i + 12) & 0xff | (key.charCodeAt(i + 13) & 0xff) << 8 | (key.charCodeAt(i + 14) & 0xff) << 16 | (key.charCodeAt(i + 15) & 0xff) << 24;
      k1 = _x86Multiply(k1, c1);
      k1 = _x86Rotl(k1, 15);
      k1 = _x86Multiply(k1, c2);
      h1 ^= k1;
      h1 = _x86Rotl(h1, 19);
      h1 += h2;
      h1 = _x86Multiply(h1, 5) + 0x561ccd1b;
      k2 = _x86Multiply(k2, c2);
      k2 = _x86Rotl(k2, 16);
      k2 = _x86Multiply(k2, c3);
      h2 ^= k2;
      h2 = _x86Rotl(h2, 17);
      h2 += h3;
      h2 = _x86Multiply(h2, 5) + 0x0bcaa747;
      k3 = _x86Multiply(k3, c3);
      k3 = _x86Rotl(k3, 17);
      k3 = _x86Multiply(k3, c4);
      h3 ^= k3;
      h3 = _x86Rotl(h3, 15);
      h3 += h4;
      h3 = _x86Multiply(h3, 5) + 0x96cd1c35;
      k4 = _x86Multiply(k4, c4);
      k4 = _x86Rotl(k4, 18);
      k4 = _x86Multiply(k4, c1);
      h4 ^= k4;
      h4 = _x86Rotl(h4, 13);
      h4 += h1;
      h4 = _x86Multiply(h4, 5) + 0x32ac3b17;
    }

    k1 = 0;
    k2 = 0;
    k3 = 0;
    k4 = 0;

    switch (remainder) {
      case 15:
        k4 ^= key.charCodeAt(i + 14) << 16;

      case 14:
        k4 ^= key.charCodeAt(i + 13) << 8;

      case 13:
        k4 ^= key.charCodeAt(i + 12);
        k4 = _x86Multiply(k4, c4);
        k4 = _x86Rotl(k4, 18);
        k4 = _x86Multiply(k4, c1);
        h4 ^= k4;

      case 12:
        k3 ^= key.charCodeAt(i + 11) << 24;

      case 11:
        k3 ^= key.charCodeAt(i + 10) << 16;

      case 10:
        k3 ^= key.charCodeAt(i + 9) << 8;

      case 9:
        k3 ^= key.charCodeAt(i + 8);
        k3 = _x86Multiply(k3, c3);
        k3 = _x86Rotl(k3, 17);
        k3 = _x86Multiply(k3, c4);
        h3 ^= k3;

      case 8:
        k2 ^= key.charCodeAt(i + 7) << 24;

      case 7:
        k2 ^= key.charCodeAt(i + 6) << 16;

      case 6:
        k2 ^= key.charCodeAt(i + 5) << 8;

      case 5:
        k2 ^= key.charCodeAt(i + 4);
        k2 = _x86Multiply(k2, c2);
        k2 = _x86Rotl(k2, 16);
        k2 = _x86Multiply(k2, c3);
        h2 ^= k2;

      case 4:
        k1 ^= key.charCodeAt(i + 3) << 24;

      case 3:
        k1 ^= key.charCodeAt(i + 2) << 16;

      case 2:
        k1 ^= key.charCodeAt(i + 1) << 8;

      case 1:
        k1 ^= key.charCodeAt(i);
        k1 = _x86Multiply(k1, c1);
        k1 = _x86Rotl(k1, 15);
        k1 = _x86Multiply(k1, c2);
        h1 ^= k1;
    }

    h1 ^= key.length;
    h2 ^= key.length;
    h3 ^= key.length;
    h4 ^= key.length;
    h1 += h2;
    h1 += h3;
    h1 += h4;
    h2 += h1;
    h3 += h1;
    h4 += h1;
    h1 = _x86Fmix(h1);
    h2 = _x86Fmix(h2);
    h3 = _x86Fmix(h3);
    h4 = _x86Fmix(h4);
    h1 += h2;
    h1 += h3;
    h1 += h4;
    h2 += h1;
    h3 += h1;
    h4 += h1;
    return ("00000000" + (h1 >>> 0).toString(16)).slice(-8) + ("00000000" + (h2 >>> 0).toString(16)).slice(-8) + ("00000000" + (h3 >>> 0).toString(16)).slice(-8) + ("00000000" + (h4 >>> 0).toString(16)).slice(-8);
  };

  library.x64.hash128 = function (key, seed) {
    //
    // Given a string and an optional seed as an int, returns a 128 bit
    // hash using the x64 flavor of MurmurHash3, as an unsigned hex.
    //
    key = key || '';
    seed = seed || 0;
    var remainder = key.length % 16;
    var bytes = key.length - remainder;
    var h1 = [0, seed];
    var h2 = [0, seed];
    var k1 = [0, 0];
    var k2 = [0, 0];
    var c1 = [0x87c37b91, 0x114253d5];
    var c2 = [0x4cf5ad43, 0x2745937f];

    for (var i = 0; i < bytes; i = i + 16) {
      k1 = [key.charCodeAt(i + 4) & 0xff | (key.charCodeAt(i + 5) & 0xff) << 8 | (key.charCodeAt(i + 6) & 0xff) << 16 | (key.charCodeAt(i + 7) & 0xff) << 24, key.charCodeAt(i) & 0xff | (key.charCodeAt(i + 1) & 0xff) << 8 | (key.charCodeAt(i + 2) & 0xff) << 16 | (key.charCodeAt(i + 3) & 0xff) << 24];
      k2 = [key.charCodeAt(i + 12) & 0xff | (key.charCodeAt(i + 13) & 0xff) << 8 | (key.charCodeAt(i + 14) & 0xff) << 16 | (key.charCodeAt(i + 15) & 0xff) << 24, key.charCodeAt(i + 8) & 0xff | (key.charCodeAt(i + 9) & 0xff) << 8 | (key.charCodeAt(i + 10) & 0xff) << 16 | (key.charCodeAt(i + 11) & 0xff) << 24];
      k1 = _x64Multiply(k1, c1);
      k1 = _x64Rotl(k1, 31);
      k1 = _x64Multiply(k1, c2);
      h1 = _x64Xor(h1, k1);
      h1 = _x64Rotl(h1, 27);
      h1 = _x64Add(h1, h2);
      h1 = _x64Add(_x64Multiply(h1, [0, 5]), [0, 0x52dce729]);
      k2 = _x64Multiply(k2, c2);
      k2 = _x64Rotl(k2, 33);
      k2 = _x64Multiply(k2, c1);
      h2 = _x64Xor(h2, k2);
      h2 = _x64Rotl(h2, 31);
      h2 = _x64Add(h2, h1);
      h2 = _x64Add(_x64Multiply(h2, [0, 5]), [0, 0x38495ab5]);
    }

    k1 = [0, 0];
    k2 = [0, 0];

    switch (remainder) {
      case 15:
        k2 = _x64Xor(k2, _x64LeftShift([0, key.charCodeAt(i + 14)], 48));

      case 14:
        k2 = _x64Xor(k2, _x64LeftShift([0, key.charCodeAt(i + 13)], 40));

      case 13:
        k2 = _x64Xor(k2, _x64LeftShift([0, key.charCodeAt(i + 12)], 32));

      case 12:
        k2 = _x64Xor(k2, _x64LeftShift([0, key.charCodeAt(i + 11)], 24));

      case 11:
        k2 = _x64Xor(k2, _x64LeftShift([0, key.charCodeAt(i + 10)], 16));

      case 10:
        k2 = _x64Xor(k2, _x64LeftShift([0, key.charCodeAt(i + 9)], 8));

      case 9:
        k2 = _x64Xor(k2, [0, key.charCodeAt(i + 8)]);
        k2 = _x64Multiply(k2, c2);
        k2 = _x64Rotl(k2, 33);
        k2 = _x64Multiply(k2, c1);
        h2 = _x64Xor(h2, k2);

      case 8:
        k1 = _x64Xor(k1, _x64LeftShift([0, key.charCodeAt(i + 7)], 56));

      case 7:
        k1 = _x64Xor(k1, _x64LeftShift([0, key.charCodeAt(i + 6)], 48));

      case 6:
        k1 = _x64Xor(k1, _x64LeftShift([0, key.charCodeAt(i + 5)], 40));

      case 5:
        k1 = _x64Xor(k1, _x64LeftShift([0, key.charCodeAt(i + 4)], 32));

      case 4:
        k1 = _x64Xor(k1, _x64LeftShift([0, key.charCodeAt(i + 3)], 24));

      case 3:
        k1 = _x64Xor(k1, _x64LeftShift([0, key.charCodeAt(i + 2)], 16));

      case 2:
        k1 = _x64Xor(k1, _x64LeftShift([0, key.charCodeAt(i + 1)], 8));

      case 1:
        k1 = _x64Xor(k1, [0, key.charCodeAt(i)]);
        k1 = _x64Multiply(k1, c1);
        k1 = _x64Rotl(k1, 31);
        k1 = _x64Multiply(k1, c2);
        h1 = _x64Xor(h1, k1);
    }

    h1 = _x64Xor(h1, [0, key.length]);
    h2 = _x64Xor(h2, [0, key.length]);
    h1 = _x64Add(h1, h2);
    h2 = _x64Add(h2, h1);
    h1 = _x64Fmix(h1);
    h2 = _x64Fmix(h2);
    h1 = _x64Add(h1, h2);
    h2 = _x64Add(h2, h1);
    return ("00000000" + (h1[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h1[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[1] >>> 0).toString(16)).slice(-8);
  }; // INITIALIZATION
  // --------------
  // Export murmurHash3 for CommonJS, either as an AMD module or just as part
  // of the global object.


  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = library;
    }

    exports.murmurHash3 = library;
  } else if (typeof define === 'function' && define.amd) {
    define([], function () {
      return library;
    });
  } else {
    // Use murmurHash3.noConflict to restore `murmurHash3` back to its
    // original value. Returns a reference to the library object, to allow
    // it to be used under a different name.
    library._murmurHash3 = root.murmurHash3;

    library.noConflict = function () {
      root.murmurHash3 = library._murmurHash3;
      library._murmurHash3 = undefined;
      library.noConflict = undefined;
      return library;
    };

    root.murmurHash3 = library;
  }
})(this);
},{}],"xyax":[function(require,module,exports) {
module.exports = require('./lib/murmurHash3js');
},{"./lib/murmurHash3js":"o3Up"}],"dASt":[function(require,module,exports) {
/* file : utils.js
MIT License

Copyright (c) 2017 Thomas Minier & Arnaud Grall

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

'use strict'

const murmur = require('murmurhash3js')

/**
 * Utilitaries functions
 * @namespace Utils
 * @private
 */

/* JSDOC typedef */
/**
 * @typedef {TwoHashes} Two hashes of the same value, as computed by {@link hashTwice}.
 * @property {number} first - The result of the first hashing function applied to a value
 * @property {number} second - The result of the second hashing function applied to a value
 * @memberof Utils
 */

/**
 * Create a new array fill with a base value
 * @param  {int} size - The size of the array
 * @param  {*} defaultValue - The default value used to fill the array. If it's a function, it will be invoked to get the default value.
 * @return {Array} A newly allocated array
 * @memberof Utils
 */
const allocateArray = (size, defaultValue) => {
  const array = new Array(size)
  const getDefault = (typeof defaultValue !== 'function') ? () => defaultValue : defaultValue
  for (let ind = 0; ind < size; ind++) {
    array[ind] = getDefault()
  }
  return array
}

/**
 * Hash a value into two values (in hex or integer format)
 *
 * Use MumurmurHash3 as the default hashing function, but another function can be easily used.
 * @see {@link https://en.wikipedia.org/wiki/MurmurHash} for more details about MurmurHash3
 * @param  {*} value - The value to hash
 * @param  {boolean} [asInt=false] - (optional) If True, the values will be returned as an integer. Otherwise, as hexadecimal values.
 * @param  {function} [hashFunction=null] - (optional) The hash function used. It should return a 128-bits long hash. By default, MumurmurHash3 is used.
 * @return {TwoHashes} The results of the hash functions applied to the value (in hex or integer)
 * @memberof Utils
 */
const hashTwice = (value, asInt = false, hashFunction = null) => {
  const hex = (hashFunction !== null) ? hashFunction(value) : murmur.x64.hash128(value)
  const firstHash = hex.substring(0, 16)
  const secondHash = hex.substring(16)
  if (asInt) {
    return {
      first: parseInt(firstHash, 16),
      second: parseInt(secondHash, 16)
    }
  }
  return {
    first: firstHash,
    second: secondHash
  }
}

/**
 * Apply Double Hashing to produce a n-hash
 *
 * This implementation used directly the value produced by the two hash functions instead of the functions themselves.
 * @see {@link http://citeseer.ist.psu.edu/viewdoc/download;jsessionid=4060353E67A356EF9528D2C57C064F5A?doi=10.1.1.152.579&rep=rep1&type=pdf} for more details about double hashing.
 * @param  {int} n - The indice of the hash function we want to produce
 * @param  {int} hashA - The result of the first hash function applied to a value.
 * @param  {int} hashB - The result of the second hash function applied to a value.
 * @param  {int} size - The size of the datastructures associated to the hash context (ex: the size of a Bloom Filter)
 * @return {int} - The result of hash_n applied to a value.
 * @memberof Utils
 */
const doubleHashing = (n, hashA, hashB, size) => {
  return Math.abs(hashA + n * hashB) % size
}

/**
 * Generate a random int bewteen two bounds (included)
 * @param {int} min - The lower bound
 * @param {int} max - The upper bound
 * @return {int} A random int bewteen lower and upper bound (included)
 * @memberof Utils
 */
const randomInt = (min, max) => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

module.exports = {
  allocateArray,
  hashTwice,
  doubleHashing,
  randomInt
}

},{"murmurhash3js":"xyax"}],"bmCt":[function(require,module,exports) {
/* file : export-import-specs.js
MIT License

Copyright (c) 2017-2018 Thomas Minier & Arnaud Grall

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

'use strict'

/**
 * Clone a field of a filter (array, object or any primary type)
 * @param  {*} v - Value to clone
 * @return {*} Cloned value
 */
function cloneField (v) {
  if (v === null || v === undefined) {
    return v
  } if (Array.isArray(v)) {
    return v.map(cloneField)
  } else if (typeof v === 'object') {
    if ('saveAsJSON' in v) {
      return v.saveAsJSON()
    }
    return Object.assign({}, v)
  }
  return v
}

function cloneObject (type, ...fields) {
  return function (obj) {
    const json = { type }
    fields.forEach(field => {
      json[field] = cloneField(obj[field])
    })
    return json
  }
}

function assertFields (obj, ...fields) {
  return fields.every(field => field in obj)
}

const BloomFilterSpecs = {
  export: cloneObject('BloomFilter', '_capacity', '_errorRate', '_size', '_length', '_nbHashes', '_filter'),
  import: (FilterConstructor, json) => {
    if ((json.type !== 'BloomFilter') || !assertFields(json, '_capacity', '_errorRate', '_size', '_length', '_nbHashes', '_filter')) {
      throw new Error('Cannot create a BloomFilter from a JSON export which does not represent a bloom filter')
    }
    const filter = new FilterConstructor(json._capacity, json._errorRate)
    filter._size = json._size
    filter._nbHashes = json._nbHashes
    filter._filter = json._filter.slice(0)
    filter._length = json._length
    return filter
  }
}

const BucketSpecs = {
  export: cloneObject('Bucket', '_size', '_elements'),
  import: (FilterConstructor, json) => {
    if ((json.type !== 'Bucket') || !assertFields(json, '_size', '_elements')) {
      throw new Error('Cannot create a Bucket from a JSON export which does not represent a bucket')
    }
    const bucket = new FilterConstructor(json._size)
    json._elements.forEach((elt, i) => {
      if (elt !== null) {
        bucket._elements[i] = elt
        bucket._length++
      }
    })
    return bucket
  }
}

const CountMinSketchSpecs = {
  export: cloneObject('CountMinSketch', '_epsilon', '_delta', '_matrix'),
  import: (FilterConstructor, json) => {
    if ((json.type !== 'CountMinSketch') || !assertFields(json, '_epsilon', '_delta', '_matrix')) {
      throw new Error('Cannot create a CountMinSketch from a JSON export which does not represent a count-min sketch')
    }
    const sketch = new FilterConstructor(json._epsilon, json._delta)
    sketch._matrix = json._matrix.slice()
    return sketch
  }
}

const CuckooFilterSpecs = {
  export: cloneObject('CuckooFilter', '_size', '_fingerprintLength', '_length', '_maxKicks', '_filter')
}

const PartitionedBloomFilterSpecs = {
  export: cloneObject('PartitionedBloomFilter', '_capacity', '_errorRate', '_length', '_filter'),
  import: (FilterConstructor, json) => {
    if ((json.type !== 'PartitionedBloomFilter') || !assertFields(json, '_capacity', '_errorRate', '_length', '_filter')) {
      throw new Error('Cannot create a PartitionedBloomFilter from a JSON export which does not represent a Partitioned Bloom Filter')
    }
    const filter = new FilterConstructor(json._capacity, json._errorRate)
    filter._length = json._length
    filter._filter = json._filter.slice()
    return filter
  }
}

module.exports = {
  'BloomFilter': BloomFilterSpecs,
  'Bucket': BucketSpecs,
  'CountMinSketch': CountMinSketchSpecs,
  'CuckooFilter': CuckooFilterSpecs,
  'PartitionedBloomFilter': PartitionedBloomFilterSpecs
}

},{}],"9Rqp":[function(require,module,exports) {
/* file : exportable.js
MIT License

Copyright (c) 2017 Thomas Minier & Arnaud Grall

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

'use strict'

const specs = require('./export-import-specs.js')

/**
 * An Exportable is a class that can be exported into a JSON object
 * @abstract
 * @author Thomas Minier
 */
class Exportable {
  /**
   * Register a resolver used to resolve the export of a field
   * @param  {string} field    - The name of the field associated to this resolver
   * @param  {function} resolver - The resolver used to export the field
   * @return {void}
   * @private
   */
  _registerResolver (field, resolver) {
    this.resolvers.set(field, resolver)
  }

  /**
   * Save as a JSON object
   * @return {Object} The exported JSON object
   */
  saveAsJSON () {
    const filterType = this.constructor.name
    if (!(filterType in specs)) {
      throw new Error(`Error, a filter of type ${filterType} is not exportable nor importable.`)
    }
    return specs[filterType].export(this)
  }

  /**
   * Create a new Filter from a JSON export
   * @param  {Object} json - A JSON export of the Filter
   * @return {Exportable} A new Filter
   */
  static fromJSON (json) {
    const filterType = this.name
    if (!(filterType in specs)) {
      throw new Error(`Error, a filter of type ${filterType} is not exportable nor importable.`)
    }
    return specs[filterType].import(this, json)
  }
}

module.exports = Exportable

},{"./export-import-specs.js":"bmCt"}],"9OBT":[function(require,module,exports) {
/* file : bloom-filter.js
MIT License

Copyright (c) 2017 Thomas Minier & Arnaud Grall

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

'use strict'

const fm = require('./formulas.js')
const utils = require('./utils.js')
const Exportable = require('./exportable.js')

/**
 * A Bloom filter is a space-efficient probabilistic data structure, conceived by Burton Howard Bloom in 1970,
 * that is used to test whether an element is a member of a set. False positive matches are possible, but false negatives are not.
 *
 * Reference: Bloom, B. H. (1970). Space/time trade-offs in hash coding with allowable errors. Communications of the ACM, 13(7), 422-426.
 * @see {@link http://crystal.uta.edu/~mcguigan/cse6350/papers/Bloom.pdf} for more details about classic Bloom Filters.
 * @extends Exportable
 * @author Thomas Minier
 * @example
 * const BloomFilter = require('bloom-filters').BloomFilter;
 *
 * // create a Bloom Filter with capacity = 15 and 1% error rate
 * let filter = new BloomFilter(15, 0.1);
 *
 * // alternatively, create a Bloom Filter from an array with 1% error rate
 * filter = BloomFilter.from([ 'alice', 'bob' ], 0.1);
 *
 * // add some value in the filter
 * filter.add('alice');
 * filter.add('bob');
 *
 * // lookup for some data
 * console.log(filter.has('bob')); // output: true
 * console.log(filter.has('daniel')); // output: false
 *
 * // print false positive rate (around 0.1)
 * console.log(filter.rate());
 */
class BloomFilter extends Exportable {
  /**
   * Constructor
   * @param {int} capacity - The filter capacity, i.e. the maximum number of elements it will contains
   * @param {number} errorRate - The error rate, i.e. 'false positive' rate, targeted by the filter
   */
  constructor (capacity, errorRate) {
    super()
    this._capacity = capacity
    this._errorRate = errorRate
    this._size = fm.optimalFilterSize(capacity, errorRate)
    this._nbHashes = fm.optimalHashes(this._size, capacity)
    this._filter = utils.allocateArray(this._size, 0)
    this._length = 0
  }

  /**
   * Build a new Bloom Filter from an existing array with a fixed error rate
   * @param {Array} array - The array used to build the filter
   * @param {number} errorRate - The error rate, i.e. 'false positive' rate, targetted by the filter
   * @return {BloomFilter} A new Bloom Filter filled with iterable's elements
   * @example
   * // create a filter with a false positive rate of 0.1
   * const filter = BloomFilter.from(['alice', 'bob', 'carl'], 0.1);
   */
  static from (array, errorRate) {
    const filter = new BloomFilter(array.length, errorRate)
    array.forEach(element => filter.add(element))
    return filter
  }

  /**
   * Get the filter capacity, i.e. the maximum number of elements it will contains
   * @return {integer} The filter capacity
   */
  get capacity () {
    return this._capacity
  }

  /**
   * Get the optimal size of the filter
   * @return {integer} The size of the filter
   */
  get size () {
    return this._size
  }

  /**
   * Get the number of elements currently in the filter
   * @return {integer} The filter length
   */
  get length () {
    return this._length
  }

  /**
   * Add an element to the filter
   * @param {*} element - The element to add
   * @return {void}
   * @example
   * const filter = new BloomFilter(15, 0.1);
   * filter.add('foo');
   */
  add (element) {
    const hashes = utils.hashTwice(element, true)

    for (let i = 0; i < this._nbHashes; i++) {
      this._filter[utils.doubleHashing(i, hashes.first, hashes.second, this._size)] = 1
    }
    this._length++
  }

  /**
   * Test an element for membership
   * @param {*} element - The element to look for in the filter
   * @return {boolean} False if the element is definitively not in the filter, True is the element might be in the filter
   * @example
   * const filter = new BloomFilter(15, 0.1);
   * filter.add('foo');
   * console.log(filter.has('foo')); // output: true
   * console.log(filter.has('bar')); // output: false
   */
  has (element) {
    const hashes = utils.hashTwice(element, true)

    for (let i = 0; i < this._nbHashes; i++) {
      if (!this._filter[utils.doubleHashing(i, hashes.first, hashes.second, this._size)]) {
        return false
      }
    }
    return true
  }

  /**
   * Get the current false positive rate (or error rate) of the filter
   * @return {int} The current false positive rate of the filter
   * @example
   * const filter = new BloomFilter(15, 0.1);
   * console.log(filter.rate()); // output: something around 0.1
   */
  rate () {
    return Math.pow(1 - Math.exp((-this._nbHashes * this._length) / this._size), this._nbHashes)
  }
}

module.exports = BloomFilter

},{"./formulas.js":"DG/7","./utils.js":"dASt","./exportable.js":"9Rqp"}],"+5fb":[function(require,module,exports) {
/* file : partitioned-bloom-filter.js
MIT License

Copyright (c) 2017 Thomas Minier & Arnaud Grall

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

'use strict'

const fm = require('./formulas.js')
const utils = require('./utils.js')
const Exportable = require('./exportable.js')

/**
 * A Partitioned Bloom Filter is a variation of a classic Bloom filter.
 *
 * This filter works by partitioning the M-sized bit array into k slices of size m = M/k bits, k = nb of hash functions in the filter.
 * Each hash function produces an index over m for its respective slice.
 * Thus, each element is described by exactly k bits, meaning the distribution of false positives is uniform across all elements.
 *
 * Be careful, as a Partitioned Bloom Filter have much higher collison risks that a classic Bloom Filter on small sets of data.
 *
 * Reference: Chang, F., Feng, W. C., & Li, K. (2004, March). Approximate caches for packet classification. In INFOCOM 2004. Twenty-third AnnualJoint Conference of the IEEE Computer and Communications Societies (Vol. 4, pp. 2196-2207). IEEE.
 * @see {@link https://pdfs.semanticscholar.org/0e18/e24b37a1f4196fddf8c9ff8e4368b74cfd88.pdf} for more details about Partitioned Bloom Filters
 * @extends Exportable
 * @author Thomas Minier
 * @example
 * const PartitionedBloomFilter = require('bloom-filters').PartitionedBloomFilter;
 *
 * // create a Partitioned Bloom Filter with capacity = 15 and 1% error rate
 * let filter = new PartitionedBloomFilter(15, 0.1);
 *
 * // alternatively, create a Partitioned Bloom Filter from an array with 1% error rate
 * filter = PartitionedBloomFilter.from([ 'alice', 'bob' ], 0.1);
 *
 * // add some value in the filter
 * filter.add('alice');
 * filter.add('bob');
 *
 * // lookup for some data
 * console.log(filter.has('bob')); // output: true
 * console.log(filter.has('daniel')); // output: false
 *
 * // print false positive rate (around 0.1)
 * console.log(filter.rate());
 */
class PartitionedBloomFilter extends Exportable {
  /**
   * Constructor
   * @param {int} capacity - The filter capacity, i.e. the maximum number of elements it will contains
   * @param {number} errorRate - The error rate, i.e. 'false positive' rate, targetted by the filter
   */
  constructor (capacity, errorRate) {
    super()
    this._capacity = capacity
    this._errorRate = errorRate
    this._size = fm.optimalFilterSize(capacity, errorRate)
    this._nbHashes = fm.optimalHashes(this._size, capacity)
    this._subarraySize = Math.ceil(this._size / this._nbHashes)
    this._filter = utils.allocateArray(this._nbHashes, () => utils.allocateArray(this._subarraySize, 0))
    this._length = 0
  }

  /**
   * Get the filter capacity, i.e. the maximum number of elements it will contains
   * @return {integer} The filter capacity, i.e. the maximum number of elements it will contains
   */
  get capacity () {
    return this._capacity
  }

  /**
   * Get the optimal size of the filter
   * @return {integer} The size of the filter
   */
  get size () {
    return this._size
  }

  /**
   * Get the number of elements currently in the filter
   * @return {integer} The filter length
   */
  get length () {
    return this._length
  }

  /**
   * Build a new Partitioned Bloom Filter from an existing array with a fixed error rate
   * @param {Array} array - The array used to build the filter
   * @param {number} errorRate - The error rate, i.e. 'false positive' rate, targetted by the filter
   * @return {BloomFilter} A new Bloom Filter filled with iterable's elements
   * @example
   * // create a filter with a false positive rate of 0.1
   * const filter = PartitionedBloomFilter.from(['alice', 'bob', 'carl'], 0.1);
   */
  static from (array, errorRate) {
    const filter = new PartitionedBloomFilter(array.length, errorRate)
    array.forEach(element => filter.add(element))
    return filter
  }

  /**
   * Add an element to the filter
   * @param {*} element - The element to add
   * @return {void}
   * @example
   * const filter = new PartitionedBloomFilter(15, 0.1);
   * filter.add('foo');
   */
  add (element) {
    const hashes = utils.hashTwice(element, true)

    for (let i = 0; i < this._nbHashes; i++) {
      this._filter[i][utils.doubleHashing(i, hashes.first, hashes.second, this._subarraySize)] = 1
    }
    this._length++
  }

  /**
   * Test an element for membership
   * @param {*} element - The element to look for in the filter
   * @return {boolean} False if the element is definitively not in the filter, True is the element might be in the filter
   * @example
   * const filter = new PartitionedBloomFilter(15, 0.1);
   * filter.add('foo');
   * console.log(filter.has('foo')); // output: true
   * console.log(filter.has('bar')); // output: false
   */
  has (element) {
    const hashes = utils.hashTwice(element, true)

    for (let i = 0; i < this._nbHashes; i++) {
      if (!this._filter[i][utils.doubleHashing(i, hashes.first, hashes.second, this._subarraySize)]) {
        return false
      }
    }
    return true
  }

  /**
   * Get the current false positive rate (or error rate) of the filter
   * @return {int} The current false positive rate of the filter
   * @example
   * const filter = new PartitionedBloomFilter(15, 0.1);
   * console.log(filter.rate()); // output: something around 0.1
   */
  rate () {
    return Math.pow(1 - Math.exp((-this._nbHashes * this._length) / this._size), this._nbHashes)
  }
}

module.exports = PartitionedBloomFilter

},{"./formulas.js":"DG/7","./utils.js":"dASt","./exportable.js":"9Rqp"}],"wJNg":[function(require,module,exports) {
/**
 * lodash 4.0.0 (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright 2012-2016 The Dojo Foundation <http://dojofoundation.org/>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright 2009-2016 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Available under MIT license <https://lodash.com/license>
 */

/**
 * Performs a [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
 * comparison between two values to determine if they are equivalent.
 *
 * @static
 * @memberOf _
 * @category Lang
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
 * @example
 *
 * var object = { 'user': 'fred' };
 * var other = { 'user': 'fred' };
 *
 * _.eq(object, object);
 * // => true
 *
 * _.eq(object, other);
 * // => false
 *
 * _.eq('a', 'a');
 * // => true
 *
 * _.eq('a', Object('a'));
 * // => false
 *
 * _.eq(NaN, NaN);
 * // => true
 */
function eq(value, other) {
  return value === other || (value !== value && other !== other);
}

module.exports = eq;

},{}],"pc3C":[function(require,module,exports) {
/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308,
    NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  if (value !== value) {
    return baseFindIndex(array, baseIsNaN, fromIndex);
  }
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max;

/**
 * Gets the index at which the first occurrence of `value` is found in `array`
 * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
 * for equality comparisons. If `fromIndex` is negative, it's used as the
 * offset from the end of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} [fromIndex=0] The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 * @example
 *
 * _.indexOf([1, 2, 1, 2], 2);
 * // => 1
 *
 * // Search from the `fromIndex`.
 * _.indexOf([1, 2, 1, 2], 2, 2);
 * // => 3
 */
function indexOf(array, value, fromIndex) {
  var length = array ? array.length : 0;
  if (!length) {
    return -1;
  }
  var index = fromIndex == null ? 0 : toInteger(fromIndex);
  if (index < 0) {
    index = nativeMax(length + index, 0);
  }
  return baseIndexOf(array, value, index);
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = indexOf;

},{}],"mrXw":[function(require,module,exports) {
/* file : bucket.js
MIT License

Copyright (c) 2017 Thomas Minier & Arnaud Grall

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

'use strict'

const eq = require('lodash.eq')
const indexOf = require('lodash.indexof')
const utils = require('./utils.js')
const Exportable = require('./exportable.js')

/**
 * A Bucket is a container of a fixed number of values, used in various bloom filters.
 * @extends Exportable
 * @author Thomas Minier
 * @private
 */
class Bucket extends Exportable {
  /**
   * Constructor
   * @param {int} size - The maximum number of elements in the bucket
   */
  constructor (size) {
    super()
    this._elements = utils.allocateArray(size, null)
    this._size = size
    this._firstNullIndex = 0
    this._length = 0
  }

  /**
   * Get the maximum number of element in the bucket
   * @return {integer} The maximum number of elements in the bucket
   */
  get size () {
    return this._size
  }

  /**
   * Get the number of elements currenlty in the bucket
   * @return {integer} The number of elements currenlty in the bucket
   */
  get length () {
    return this._length
  }

  /**
   * Indicates if the bucket has any space available
   * @return {boolean} True if te bucket has any space available, False if if its full
   */
  isFree () {
    return this._length < this._size
  }

  /**
   * Get the index of the first empty slot in the bucket
   * @return {int} The index of the first empty slot, or -1 if the bucket is full
   */
  nextEmptySlot () {
    return indexOf(this._elements, null)
  }

  /**
   * Get the element at the given index in the bucket
   * @param {int} index - The index to access
   * @return {*} The element at the given index
   */
  at (index) {
    return this._elements[index]
  }

  /**
   * Add an element to the bucket
   * @param {*} element - The element to add in the bucket
   * @return {boolean} True if the insertion is a success, False if the bucket is full
   */
  add (element) {
    if (!this.isFree()) return false
    this.set(this.nextEmptySlot(), element)
    this._length++
    return true
  }

  /**
   * Remove an element from the bucket
   * @param {*} element - The element to remove from the bucket
   * @return {boolean} True if the element has been successfully removed, False if it was not in the bucket
   */
  remove (element) {
    const index = indexOf(this._elements, element)
    if (index <= -1) return false
    this.unset(index)
    return true
  }

  /**
   * Test an element for membership
   * @param {*} element - The element to look for in the bucket
   * @return {boolean} True is the element is in the bucket, otherwise False
   */
  has (element) {
    return indexOf(this._elements, element) > -1
  }

  /**
   * Set an element at the given index in the bucket
   * @param  {int} index - The index at where the element should be inserted
   * @param  {*} element - The element to insert
   * @return {void}
   */
  set (index, element) {
    this._elements[index] = element
  }

  /**
   * Unset the element at the given index
   * @param  {int} index - The index of the element that should be unset
   * @return {void}
   */
  unset (index) {
    this._elements[index] = null
    this._length--
  }

  /**
   * Randomly swap an element of the bucket with a given element, then return the replaced element
   * @param {*} element - The element to be inserted
   * @return {*} The element that have been swapped with the parameter
   */
  swapRandom (element) {
    const index = utils.randomInt(0, this._length - 1)
    const tmp = this._elements[index]
    this._elements[index] = element
    return tmp
  }

  /**
   * Test if two buckets are equals, i.e. have the same size, length and content
   * @param  {Bucket} bucket - The other bucket with which to compare
   * @return {boolean} True if the two buckets are equals, False otherwise
   */
  equals (bucket) {
    if ((this._size !== bucket.size) || (this._length !== bucket.length)) return false
    return this._elements.every((elt, index) => eq(bucket.at(index), elt))
  }
}

module.exports = Bucket

},{"lodash.eq":"wJNg","lodash.indexof":"pc3C","./utils.js":"dASt","./exportable.js":"9Rqp"}],"qe2Y":[function(require,module,exports) {
/* file : cuckoo-filter.js
MIT License

Copyright (c) 2017 Thomas Minier & Arnaud Grall

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

'use strict'

const murmur = require('murmurhash3js')
const Bucket = require('./bucket.js')
const Exportable = require('./exportable.js')
const utils = require('./utils.js')

/**
 * Cuckoo filters improve on Bloom filters by supporting deletion, limited counting,
 * and bounded False positive rate with similar storage efficiency as a standard Bloom filter.
 *
 * Reference: Fan, B., Andersen, D. G., Kaminsky, M., & Mitzenmacher, M. D. (2014, December). Cuckoo filter: Practically better than bloom.
 * In Proceedings of the 10th ACM International on Conference on emerging Networking Experiments and Technologies (pp. 75-88). ACM.
 * @see {@link https://www.cs.cmu.edu/~dga/papers/cuckoo-conext2014.pdf} for more details about Cuckoo filters
 * @extends Exportable
 * @author Thomas Minier
 * @example
 * const CuckooFilter = require('bloom-filters').CuckooFilter;
 *
 * // create a Cuckoo Filter with size = 15, fingerprint length = 3 and bucket size = 2
 * const filter = new CuckooFilter(15, 3, 2);
 * filter.add('alice');
 * filter.add('bob');
 *
 * // lookup for some data
 * console.log(filter.has('bob')); // output: true
 * console.log(filter.has('daniel')); // output: false
 *
 * // remove something
 * filter.remove('bob');
 * console.log(filter.has('bob')); // output: false
 */
class CuckooFilter extends Exportable {
  /**
   * Constructor
   * @param {int} size - The filter size
   * @param {int} fLength - The length of the fingerprints
   * @param {int} bucketSize - The size of the buckets in the filter
   * @param {int} [maxKicks=1] - (optional) The max number of kicks when resolving collision at insertion, default to 1
   */
  constructor (size, fLength, bucketSize, maxKicks = 1) {
    super()
    this._filter = utils.allocateArray(size, () => new Bucket(bucketSize))
    this._size = size
    this._fingerprintLength = fLength
    this._length = 0
    this._maxKicks = maxKicks
  }

  /**
   * Get the filter size
   * @return {integer} The filter size
   */
  get size () {
    return this._size
  }

  /**
   * Get the filter length, i.e. the current number of elements in the filter
   * @return {integer} The filter length
   */
  get length () {
    return this._length
  }

  /**
   * Get the length of the fingerprints in the filter
   * @return {integer} The length of the fingerprints
   */
  get fingerprintLength () {
    return this._fingerprintLength
  }

  /**
   * Get the size of the buckets in the filter
   * @return {integer} The size of the buckets in the filter
   */
  get bucketSize () {
    return this._bucketSize
  }

  /**
   * Get the max number of kicks when resolving collision at insertion
   * @return {integer} The max number of kicks when resolving collision at insertion
   */
  get maxKicks () {
    return this._maxKicks
  }

  /**
   * Build a new Cuckoo Filter from an existing array with a fixed error rate
   * @param {Array} array - The array used to build the filter
   * @param {number} errorRate - The error rate, i.e. 'false positive' rate, targetted by the filter
   * @return {CuckooFilter} A new Cuckoo Filter filled with iterable's elements
   * @example
   * // create a filter with a false positive rate of 0.1
   * const filter = CuckooFilter.from(['alice', 'bob', 'carl'], 0.1);
   */
  // static from (array, fLength, bucketSize, maxKicks) {
  //   const length = array.length; // TODO: need to find the good formula for this
  //   const filter = new CuckooFilter(length, errorRate);
  //   array.forEach(element => filter.add(element));
  //   return filter;
  // }

  /**
   * Create a new Cuckoo Filter from a JSON export
   * @param  {Object} json - A JSON export of a Cuckoo Filter
   * @return {CuckooFilter} A new Cuckoo Filter
   */
  static fromJSON (json) {
    if ((json.type !== 'CuckooFilter') || !('_size' in json) || !('_fingerprintLength' in json) || !('_length' in json) || !('_maxKicks' in json) || !('_filter' in json)) { throw new Error('Cannot create a CuckooFilter from a JSON export which does not represent a cuckoo filter') }
    const filter = new CuckooFilter(json._size, json._fingerprintLength, json._bucketSize, json._maxKicks)
    filter._length = json._length
    filter._filter = json._filter.map(json => Bucket.fromJSON(json))
    return filter
  }

  /**
   * Add an element to the filter
   * @param {*} element - The element to add
   * @return {boolean} True if the insertion is a success, False if the filter is full
   * @example
   * const filter = new CuckooFilter(15, 3, 2);
   * filter.add('alice');
   * filter.add('bob');
   */
  add (element) {
    const locations = this._locations(element)
    // store fingerprint in an available empty bucket
    if (this._filter[locations.firstIndex].isFree()) {
      this._filter[locations.firstIndex].add(locations.fingerprint)
    } else if (this._filter[locations.secondIndex].isFree()) {
      this._filter[locations.secondIndex].add(locations.fingerprint)
    } else {
      // buckets are full, we must relocate one of them
      let index = Math.random() < 0.5 ? locations.firstIndex : locations.secondIndex
      let movedElement = locations.fingerprint
      for (let nbTry = 0; nbTry < this._maxKicks; nbTry++) {
        movedElement = this._filter[index].swapRandom(movedElement)
        index = Math.abs(index ^ Math.abs(murmur.x86.hash32(movedElement))) % this._size
        // add the moved element to the bucket if possible
        if (this._filter[index].isFree()) {
          this._filter[index].add(movedElement)
          this._length++
          return true
        }
      }
      return false
    }
    this._length++
    return true
  }

  /**
   * Remove an element from the filter
   * @param {*} element - The element to remove
   * @return {boolean} True if the element has been removed from the filter, False if it wasn't in the filter
   * @example
   * const filter = new CuckooFilter(15, 3, 2);
   * filter.add('alice');
   * filter.add('bob');
   *
   * // remove an element
   * filter.remove('bob');
   */
  remove (element) {
    const locations = this._locations(element)
    if (this._filter[locations.firstIndex].has(locations.fingerprint)) {
      this._filter[locations.firstIndex].remove(locations.fingerprint)
      this._length--
      return true
    } else if (this._filter[locations.secondIndex].has(locations.fingerprint)) {
      this._filter[locations.secondIndex].remove(locations.fingerprint)
      this._length--
      return true
    }
    return false
  }

  /**
   * Test an element for membership
   * @param {*} element - The element to look for in the filter
   * @return {boolean} False if the element is definitively not in the filter, True is the element might be in the filter
   * @example
   * const filter = new CuckooFilter(15, 3, 2);
   * filter.add('alice');
   *
   * console.log(filter.has('alice')); // output: true
   * console.log(filter.has('bob')); // output: false
   */
  has (element) {
    const locations = this._locations(element)
    return this._filter[locations.firstIndex].has(locations.fingerprint) || this._filter[locations.secondIndex].has(locations.fingerprint)
  }

  /**
   * Compute the optimal fingerprint length in bytes for a given bucket size
   * and a false positive rate.
   * @warning seems to have problem with / 8, need to assert that formula
   * @param  {int} size - The filter size
   * @param  {int} rate - The error rate, i.e. 'false positive' rate, targetted by the filter
   * @return {int} The optimal fingerprint length in bytes
   * @private
   */
  _computeFingerpintLength (size, rate) {
    const length = Math.ceil(Math.log(2 * size / rate)) / 8
    if (length <= 0) return 1
    return length
  }

  /**
   * For a element, compute its fingerprint and the index of its two buckets
   * @param {*} element - The element to hash
   * @return {locations} The fingerprint of the element and the index of its two buckets
   * @private
   */
  _locations (element) {
    const hash = murmur.x86.hash32(element)
    const fingerprint = hash.toString(16).substring(0, this._fingerprintLength)
    const firstIndex = Math.abs(hash)
    const secondIndex = Math.abs(firstIndex ^ Math.abs(murmur.x86.hash32(fingerprint)))
    return {
      fingerprint,
      firstIndex: firstIndex % this._size,
      secondIndex: secondIndex % this._size
    }
  }
}

module.exports = CuckooFilter

},{"murmurhash3js":"xyax","./bucket.js":"mrXw","./exportable.js":"9Rqp","./utils.js":"dASt"}],"9pJa":[function(require,module,exports) {
/* file : count-min-sketch.js
MIT License

Copyright (c) 2017 Thomas Minier & Arnaud Grall

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

'use strict'

const utils = require('./utils.js')
const Exportable = require('./exportable.js')

/**
 * The count–min sketch (CM sketch) is a probabilistic data structure that serves as a frequency table of events in a stream of data.
 * It uses hash functions to map events to frequencies, but unlike a hash table uses only sub-linear space, at the expense of overcounting some events due to collisions.
 *
 * Reference: Cormode, G., & Muthukrishnan, S. (2005). An improved data stream summary: the count-min sketch and its applications. Journal of Algorithms, 55(1), 58-75.
 * @see {@link http://vaffanculo.twiki.di.uniroma1.it/pub/Ing_algo/WebHome/p14_Cormode_JAl_05.pdf} for more details on Count Min Sketch
 * @extends Exportable
 * @author Thomas Minier
 * @example
 * const CountMinSketch = require('bloom-filters').CountMinSketch;
 *
 * // create a new count min sketch with epsilon = 0.001 and delta = 0.99
 * const sketch = new CountMinSketch(0.001, 0.99);
 *
 * // push some occurrences in the sketch
 * sketch.update('alice');
 * sketch.update('alice');
 * sketch.update('bob');
 *
 * // count occurrences
 * console.log(sketch.count('alice')); // output: 2
 * console.log(sketch.count('bob')); // output: 1
 * console.log(sketch.count('daniel')); // output: 0
 */
class CountMinSketch extends Exportable {
  /**
   * Constructor. Creates a new Count-Min Sketch whose relative accuracy is within a factor of epsilon with probability delta.
   * @param {number} epsilon - Factor of relative accuracy
   * @param {number} delta - Probability of relative accuracy
   */
  constructor (epsilon, delta) {
    super()
    this._epsilon = epsilon
    this._delta = delta
    this._columns = Math.ceil(Math.E / epsilon)
    this._rows = Math.ceil(Math.log(1 / delta))
    this._matrix = utils.allocateArray(this._rows, () => utils.allocateArray(this._columns, 0))
  }

  /**
   * Get the factor of relative accuracy
   * @return {number} The factor of relative accuracy
   */
  get epsilon () {
    return this._epsilon
  }

  /**
   * Get the probability of relative accuracy
   * @return {number} The probability of relative accuracy
   */
  get delta () {
    return this._delta
  }

  /**
   * Update the count min sketch with a new occurrence of an element
   * @param {string} element - The new element
   * @return {void}
   * @example
   * const sketch = new CountMinSketch(0.001, 0.99);
   * sketch.update('foo');
   */
  update (element) {
    const hashes = utils.hashTwice(element, true)

    for (let i = 0; i < this._rows; i++) {
      this._matrix[i][utils.doubleHashing(i, hashes.first, hashes.second, this._columns)]++
    }
  }

  /**
   * Perform a point query, i.e. estimate the number of occurence of an element
   * @param {string} element - The element we want to count
   * @return {int} The estimate number of occurence of the element
   * @example
   * const sketch = new CountMinSketch(0.001, 0.99);
   * sketch.update('foo');
   * sketch.update('foo');
   *
   * console.log(sketch.count('foo')); // output: 2
   * console.log(sketch.count('bar')); // output: 0
   */
  count (element) {
    let min = Infinity
    const hashes = utils.hashTwice(element, true)

    for (let i = 0; i < this._rows; i++) {
      let v = this._matrix[i][utils.doubleHashing(i, hashes.first, hashes.second, this._columns)]
      min = Math.min(v, min)
    }

    return min
  }

  /**
   * Merge this sketch with another sketch, if they have the same number of columns and rows.
   * @param {CountMinSketch} sketch - The sketch to merge with
   * @return {void}
   * @throws Error
   * @example
   * const sketch = new CountMinSketch(0.001, 0.99);
   * const otherSketch = new CountMinSketch(0.001, 0.99);
   *
   * sketch.update('foo');
   * otherSketch.update('foo');
   * otherSketch.update('bar');
   *
   * // merge the two sketches
   * sketch.merge(otherSketch);
   * console.log(sketch.count('foo')); // output: 2
   * console.log(sketch.count('bar')); // output: 1
   */
  merge (sketch) {
    if (this._columns !== sketch._columns) throw new Error('Cannot merge two sketches with different number of columns')
    if (this._rows !== sketch._rows) throw new Error('Cannot merge two sketches with different number of rows')

    for (let i = 0; i < this._rows; i++) {
      for (let j = 0; j < this._columns; j++) {
        this._matrix[i][j] += sketch._matrix[i][j]
      }
    }
  }

  /**
   * Clone the sketch
   * @return {CountMinSketch} A new cloned sketch
   * @example
   * const sketch = new CountMinSketch(0.001, 0.99);
   * sketch.update('foo');
   *
   * const clone = sketch.clone();
   * console.log(clone.count('foo')); // output: 1
   */
  clone () {
    const sketch = new CountMinSketch(this._epsilon, this._delta)
    sketch.merge(this)
    return sketch
  }
}

module.exports = CountMinSketch

},{"./utils.js":"dASt","./exportable.js":"9Rqp"}],"Spug":[function(require,module,exports) {
/* file : bloom-filters.js
MIT License

Copyright (c) 2017 Thomas Minier & Arnaud Grall

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

'use strict'

// re-exports top-level classes to public API
const BloomFilter = require('./src/bloom-filter.js')
const PartitionedBloomFilter = require('./src/partitioned-bloom-filter.js')
const CuckooFilter = require('./src/cuckoo-filter.js')
const CountMinSketch = require('./src/count-min-sketch.js')

module.exports = {
  BloomFilter,
  PartitionedBloomFilter,
  CuckooFilter,
  CountMinSketch
}

},{"./src/bloom-filter.js":"9OBT","./src/partitioned-bloom-filter.js":"+5fb","./src/cuckoo-filter.js":"qe2Y","./src/count-min-sketch.js":"9pJa"}],"VnKd":[function(require,module,exports) {
var _require = require('bloom-filters'),
    CuckooFilter = _require.CuckooFilter;

var requests = {};

function Deferred() {
  var self = this;
  this.promise = new Promise(function (resolve, reject) {
    self.reject = reject;
    self.resolve = resolve;
  });
}

function generateRequestId() {
  var array = new Uint32Array(5);
  window.crypto.getRandomValues(array);
  var id = "";
  array.forEach(function (v) {
    id += v.toString(36);
  });
  return id;
}

function requestMessage(msg) {
  msg.requestId = generateRequestId();
  requests[msg.requestId] = new Deferred();
  window.parent.postMessage(msg);
  return requests[msg.requestId].promise;
}

function validate(data) {
  requestMessage({
    type: "get-chain",
    payload: {
      chainId: data.chain.tree.issuer
    }
  }).then(function (resp) {
    var id = data.chain.id;
    var issuerChaintree = resp.payload.tree;
    var issuedFilter = CuckooFilter.fromJSON(issuerChaintree.issued);
    var revokedFilter = CuckooFilter.fromJSON(issuerChaintree.revoked);

    if (issuedFilter.has(id) && !revokedFilter.has(id)) {
      window.parent.postMessage({
        type: "finished",
        payload: {
          result: "ok"
        }
      });
    } else {
      window.parent.postMessage({
        type: "finished",
        payload: {
          result: "invalid"
        }
      });
    }
  });
}

function handleMessage(event) {
  data = event.data;

  switch (data.type) {
    case "validate":
      validate(data.payload);
      break;

    case "response":
      if (requests.hasOwnProperty(data.requestId)) {
        requests[data.requestId].resolve(data);
      } else {
        throw "unknown request id " + data.requestId;
      }

      break;

    default:
      throw "unknown message type " + event.data.type;
  }
}

window.addEventListener("message", handleMessage);
},{"bloom-filters":"Spug"}]},{},["VnKd"], null)