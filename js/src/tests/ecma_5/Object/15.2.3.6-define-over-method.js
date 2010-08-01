// Any copyright is dedicated to the Public Domain.
// http://creativecommons.org/licenses/publicdomain/

var gTestfile = '15.2.3.6-define-over-method.js';
//-----------------------------------------------------------------------------
var BUGNUMBER = 568786;
var summary =
  '"Assertion failure: !(attrs & (JSPROP_GETTER | JSPROP_SETTER))," with ' +
  'Object.defineProperty';

print(BUGNUMBER + ": " + summary);

/**************
 * BEGIN TEST *
 **************/

var o = { x: function(){} };
Object.defineProperty(o, "x", { get: function(){} });

/******************************************************************************/

if (typeof reportCompare === "function")
  reportCompare(true, true);

print("All tests passed!");