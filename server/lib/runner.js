var _ = require('lodash');
var Promise = require('bluebird');

var fs = require('fs');
var path = require('path');
var Parser = require('pegjs').buildParser(fs.readFileSync(path.resolve(__dirname, './kable.peg'), 'utf8'));

var functions = require('./load_functions');
var types = require('../types');
var kblConfig = {};

function argType(arg) {
  if (_.isObject(arg) && arg) {
    return arg.type;
  }
  if (arg == null) {
    return 'null';
  }
  return typeof arg;
}


// Invokes a modifier function, resolving arguments into series as needed
function invoke(fnName, args) {
  var functionDef = functions[fnName];

  if (!functionDef) throw new Error ('Unknown function: ' + fnName);

  args = _.mapValues(args, function (item) {
    // If you want multiple item.types, add a switch here with the handling
    if (argType(item) === 'chain') {
      return invokeChain(item);
    } else {
      return item;
    }
  });

  return Promise.props(args)
  .then(function (args) {

    // Validate and cast arguments, the piped object is available as _pipe_
    args = _.mapValues(args, function (arg, name) {

      // Arguments must be defined on the function, or the function must supply a "_default_" argument
      var argDef = functionDef.args[name] || functionDef.args['_default_'];
      if (!argDef) throw new Error ('Unknown argument "' + name + '" supplied to ' + fnName);

      // The supplied argument types must be defined in ./types
      var suppliedType = argType(arg);
      var suppliedTypeDef = types[suppliedType];

      if (!suppliedTypeDef) throw new Error ('Undefined argument type "' + arg.type + '" as "' + name + '" supplied to ' + fnName);

      // If the argument accepts this type, simply return the supplied argument value
      var allowedTypes = argDef.types
      if (_.contains(allowedTypes, suppliedType)) return arg;

      var result;
      // Otherwise, try to cast it,
      // Check the supplied type's "to" functions first, followed by the required types' "from" functions
      _.each(allowedTypes, function (allowedType) {
        var allowedTypeDef = types[allowedType];

        if (suppliedTypeDef.to[allowedType]) result = suppliedTypeDef.to[allowedType](arg);
        if (allowedTypeDef.from[suppliedType]) result = allowedTypeDef.from[suppliedType](arg);
      })
      if (result) return result;
      else throw new Error ('Could not cast "' + suppliedType + '" to any of ' + allowedTypes);
    });

    // I guess this is ok?
    return Promise.props(args);
  })
  .then(function (args) {
    return functionDef.fn(args, kblConfig);
  });
}

function invokeChain(chainObj, result) {
  if (chainObj.chain.length === 0) return result;

  var chain = _.clone(chainObj.chain);
  var link = chain.shift();

  var args = link.arguments || {};
  args._pipe_ = result || {type: 'null', value: null};
  var promise = invoke(link.function, args);

  return promise.then(function (result) {
    return invokeChain({type:'chain', chain: chain}, result);
  });
}

function run(expression) {
  var result;
  if (expression && expression.trim().length) {
    var chain = Parser.parse(expression);
    result = invokeChain(chain.expression);
  } else {
    result = {type: 'null', value: null};
  }

  return Promise.resolve(result).then(function (result) {
    var resultType = argType(result);
    if (resultType === 'dataTable') return result;

    if (types[resultType].to.dataTable) return types[resultType].to.dataTable(result);
    if (types.dataTable.from[resultType]) return types.dataTable.from[resultType](result);
    throw new Error ('Can not create dataTable from ' + result.type);
  });
}

module.exports = run;

/*
function logObj(obj, thing) {
  console.log(JSON.stringify(obj, null, ' '));
}

function dbg(expression) {
  var result = run(expression);
  Promise.resolve(result).then(function (result) {
    logObj(result);
  });
}


//dbg('index=usagov* | top=geo.country_code count=2 | metric avg=bytes | top=geo.region count=2 | metric avg=bytes');
dbg('index=usagov* | top=geo.country_code count=2 | top=geo.region count=2 | top=user count=1');


module.exports = dbg
*/