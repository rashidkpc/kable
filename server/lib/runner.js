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

  console.log(args);

  // Resolve any chains down to their resolved types
  args = _.map(args, function (item) {
    // If you want multiple item.types, add a switch here with the handling
    if (argType(item) === 'chain') {
      return invokeChain(item);
    } else {
      return item;
    }
  });

  console.log(args);

  // Cast arguments to required types as needed
  args = Promise.all(args)
  .then(function (args) {

    // Validate and cast arguments, the piped object is available as _pipe_
    return _.mapValues(args, function (arg, name) {
      // Arguments must be defined on the function, or the function must supply a "_default_" argument
      var argDef = functionDef.args[name] || functionDef.args['_default_'];
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
  args = Promise.all(args)
  .then(function (args) {
    return functionDef.fn(args, kblConfig);
  });

  return args;
}

function invokeChain(chainObj, result) {
  if (chainObj.chain.length === 0) return invoke('finalize', {_input_: result});

  var chain = _.clone(chainObj.chain);
  var link = chain.shift();

  // OK, so what do we do with namedArgs then? We absolutely need to pass an object with arguments to invoke. Fuck.

  var args = link.arguments || {};
  args.unshift(result || {type: 'null', value: null});


  console.log('not_indexed', args);

  args = indexArguments(functions[link.function], args);

  console.log('indexed', args);
  var promise = invoke(link.function, args);

  return promise.then(function (result) {
    return invokeChain({type:'chain', chain: chain}, result);
  });
}

function run(expression) {
  var result;
  if (expression && expression.trim().length) {
    var chain = Parser.parse(expression);
    console.log(chain);
    result = invokeChain(chain);
  } else {
    result = {type: 'null', value: null};
  }

  return Promise.resolve(result)
  .catch(function (e) {
    return Promise.reject(Boom.badRequest(e.toString()));
  });
}


//module.exports = run;

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

//dbg('index=usagov* | top=geo.country_code count=2 | metric avg=bytes | top=geo.region count=2 | metric avg=bytes');
dbg('.top(count=2, field=geo.region).top(geo.country_code, count=2)');

//module.exports = dbg
