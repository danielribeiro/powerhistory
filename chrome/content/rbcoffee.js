(function() {
  var abstract_method, define, methods, methodsOfInstance, methodsOfInstanceWhile, methodsWhile, puts, raise;
  var __hasProp = Object.prototype.hasOwnProperty;
  puts = function(arg) {
    return console ? console.log(arg) : undefined;
  };
  raise = function(message) {
    throw new Error(message);
  };
  abstract_method = function() {
    return raise("Subclass responsability");
  };
  define = function(clas, methodName, func) {
    return (clas.prototype[methodName] = func);
  };
  methods = function(clas) {
    var _ref, _result, c, ret;
    ret = (function() {
      _result = [];
      for (c in _ref = clas.prototype) {
        if (!__hasProp.call(_ref, c)) continue;
        _result.push(c);
      }
      return _result;
    })();
    if (!clas.__super__) {
      return ret;
    }
    return ret.concat(methods(clas.__super__.constructor));
  };
  methodsWhile = function(clas, func) {
    var _ref, _result, c, ret;
    if (!func(clas)) {
      return [];
    }
    ret = (function() {
      _result = [];
      for (c in _ref = clas.prototype) {
        if (!__hasProp.call(_ref, c)) continue;
        _result.push(c);
      }
      return _result;
    })();
    if (!clas.__super__) {
      return ret;
    }
    return ret.concat(methodsWhile(clas.__super__.constructor, func));
  };
  methodsOfInstance = function(instance) {
    return methods(instance.constructor);
  };
  methodsOfInstanceWhile = function(instance, func) {
    return methodsWhile(instance.constructor, func);
  };
}).call(this);
