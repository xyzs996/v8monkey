// The argument to Debugger.Object.prototype.getOwnPropertyDescriptor can be an object.
var g = newGlobal('new-compartment');
g.eval("var obj = {};");

var dbg = Debugger(g);
var obj;
dbg.hooks = {debuggerHandler: function (frame) { obj = frame.eval("obj").return; }};
g.eval("debugger;");

var nameobj = {toString: function () { return 'x'; }};
assertEq(obj.getOwnPropertyDescriptor(nameobj), undefined);
g.obj.x = 17;
var desc = obj.getOwnPropertyDescriptor(nameobj);
assertEq(desc.value, 17);
