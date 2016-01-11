var _ = require('lodash');
var Type = require('../../lib/type');
var flatten = require('../../lib/flatten');
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: 'http://admin:notsecure@localhost:9200',
});

module.exports = new Type('searchRequest', {
  help: 'An unexecuted Elasticsearch request',
  from: {
    null: function (emptyObj) {
      // Gee, we're converting from empty, THRILLING.
      // Not much to do here but return our skeleton
      return {
        type: 'searchRequest', // Maybe the type class should handle appending this?
        aggs: {},
        query: {
          bool: {
            must: [],
            must_not: [],
            should: []
          }
        },
        request: {
          index: '_all'
        }
      }
    }
  },
  to: {
    dataTable: function (searchRequest) {
      var request = searchRequest.request;
      request.body = {
        size: 0,
        query: searchRequest.query,
        aggs: searchRequest.aggs
      }

      // Add a .then here and turn the response into a responseTable
      return client.search(request)
      .then(function (resp) {
        var data = resp.aggregations ? flatten(resp.aggregations) : {header: ['_all'], rows: [[resp.hits.total]]};
        return {
          type: 'dataTable',
          data: data
        }
      });
    }
  }
});