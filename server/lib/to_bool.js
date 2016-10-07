var _ = require('lodash');
var Promise = require('bluebird');
var Boom = require('boom');
var fs = require('fs');
var path = require('path');

var Parser = require('pegjs').buildParser(fs.readFileSync(path.resolve(__dirname, './search.peg'), 'utf8'));

function toQuery(clause) {
  var query = {};
  if (clause.type === 'group' || clause.type === 'search') {
    query = toBool(clause.clauses);
  } else {
    if (clause.type === 'eq') {
      _.set(query, `match.${clause.field}`, {query: clause.value, type: 'phrase'});
    } else if (_.contains(['lt', 'gt', 'lte', 'gte'], clause.type)) {
      _.set(query, `range.${clause.field}.${clause.type}`, clause.value);
    } else {
      throw 'Unknown operator: ' + clause.type;
    }
  }

  return query;
}

function toBool(clauses, scripts) {
  return _.reduce(clauses, function (context, clause) {
    context.bool[clause.imperative].push(toQuery(clause, scripts));
    return context;
  }, {bool: {must: [], must_not: [], should: []}});
}

module.exports = toQuery;

/*
function run(search) {
  var result = toQuery(search);
  return Promise.resolve(result)
  .catch(function (e) {
    return Promise.reject(Boom.badRequest(e.toString()));
  });
}

function logObj(obj, thing) {
  console.log(JSON.stringify(obj, null, ' '));
}

function dbg(expression) {
  console.log('Expression:', expression);
  var result = run(expression);
  Promise.resolve(result).then(function (result) {
    logObj(result);
  });
}

dbg('+foo:bar -(+stuff -things +baz:moot) lol>10 beer>:200 beer<:100 lolstuff<1.222222')
*/
