var _ = require('lodash');
var Promise = require('bluebird');
var Boom = require('boom');
var fs = require('fs');
var path = require('path');

var Parser = require('pegjs').buildParser(fs.readFileSync(path.resolve(__dirname, './kable.peg'), 'utf8'));
var argType = require('./arg_type');
var types = require('../types');
var cast = require('./cast')(types);
var functions = require('./load_functions');
var indexArguments = require('./index_arguments');
var kblConfig = {};

// Invokes a modifier function, resolving arguments into series as needed
function invoke(fnName, args) {
  var functionDef = functions[fnName];
  if (!functionDef) throw new Error ('Unknown function: ' + fnName);

  // Make the arguments to the function into an object
  args = indexArguments(functions[fnName], args);

  // Resolve any chains down to their resolved types
  args = _.mapValues(args, function (arg, name) {
    // If you want multiple item.types, add a switch here with the handling
    if (argType(arg) === 'chain') {
      return invokeChain(arg);
    } else {
      return arg;
    }
  });

  console.log('args:', args)

  // Cast arguments to required types as needed
  args = Promise.props(args)
  .then(function (args) {

    // Validate and cast arguments, the piped object is available as _pipe_
    return _.mapValues(args, function (arg, name) {
      // Arguments must be defined on the function, or the function must supply a "_default_" argument
      var argDef = functionDef.args.byName[name] || functionDef.args.byName['_default_'];

      console.log('arg:', name);

      if (!argDef) throw 'Unknown argument "' + name + '" supplied to ' + fnName;

      try {
        return cast(arg, argDef.types)
      } catch (e) {
        throw e;
        // + '" as "' + name + '" supplied to ' + fnName
      }
    });
  })

  // Finally pass the arguments to the function
  args = Promise.props(args)
  .then(function (args) {
    return functionDef.fn(args, kblConfig);
  });

  return args;
}

function invokeChain(chainObj, result) {
  if (chainObj.chain.length === 0) return invoke('finalize', [result]);

  var chain = _.clone(chainObj.chain);
  var link = chain.shift();

  var args = link.arguments || {};
  args.unshift(result || {type: 'null', value: null});


  var promise = invoke(link.function, args);
  return promise.then(function (result) {
    return invokeChain({type:'chain', chain: chain}, result);
  });
}

function run(expression) {
  var result;
  if (expression && expression.trim().length) {
    var chain = Parser.parse(expression);
    result = invokeChain(chain);
  } else {
    result = {type: 'null', value: null};
  }

  return Promise.resolve(result)
  .catch(function (e) {
    return Promise.reject(Boom.badRequest(e.toString()));
  });
}


module.exports = run;

/*
function logObj(obj, thing) {
  console.log(JSON.stringify(obj, null, ' '));
}

function dbg(expression) {
  console.log(expression);
  var result = run(expression);
  Promise.resolve(result).then(function (result) {
    logObj(result);
  });
}
*/

//dbg('index=usagov* | top=geo.country_code count=2 | metric avg=bytes | top=geo.region count=2 | metric avg=bytes');
//dbg('.index(relay*).top(relay_actor, count=0)');

//module.exports = dbg
