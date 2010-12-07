(function() {
  var addToTheEnd, getLines, puts;
  puts = function(arg) {
    return console.log(arg);
  };
  getLines = function(line) {
    return line.replace('var ', '').replace(';', '').trim().split(/\s*,\s*/);
  };
  addToTheEnd = function(array, addedArray) {
    addedArray.unshift(-2, 0);
    return Array.prototype.splice.apply(array, addedArray);
  };
  CoffeeScript.on('success', function(task) {
    var _i, _len, _ref, _result, containsEqual, lines, newLines, v, variables;
    lines = task.output.split(/\n/);
    containsEqual = lines[1].indexOf("=") >= 0;
    variables = containsEqual ? [] : getLines(lines[1]);
    newLines = (function() {
      _result = []; _ref = variables;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        v = _ref[_i];
        _result.push("window." + (v) + " = " + (v));
      }
      return _result;
    })();
    addToTheEnd(lines, newLines);
    return (task.output = lines.join("\n"));
  });
}).call(this);
