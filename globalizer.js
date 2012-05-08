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
    var containsEqual, lines, newLines, v, variables, _i, _len;
    lines = task.output.split(/\n/);
    containsEqual = lines[1].indexOf("=") >= 0;
    variables = containsEqual ? [] : getLines(lines[1]);
    for (_i = 0, _len = variables.length; _i < _len; _i++) {
      v = variables[_i];
      newLines = "window." + v + " = " + v;
    }
    addToTheEnd(lines, newLines);
    return task.output = lines.join("\n");
  });

}).call(this);
