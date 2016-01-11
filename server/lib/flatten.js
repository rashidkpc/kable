// search q=* | top=country count=3 | metric avg=bytes | bins=bytes size=250000 | metric avg=bytes

var _ = require('lodash');
module.exports = function flatten (obj) {
  var headerComplete;
  var header = [];
  var rows = [];

  function addHeader(name) {
    var i = 0;
    var originalName = name;
    while (_.contains(header, name)) {
      i++;
      name = originalName + '_' + i;
    }
    header.push(name);
  }


  function processBucketAgg(row, bucketAgg) {
    var sample = bucketAgg.buckets[0];
    if (!sample) return;

    if (!headerComplete) {
      addHeader(bucketAgg.name);
      if (sample.key_as_string) addHeader(bucketAgg.name + '_string');
      addHeader(bucketAgg.name + '_count');
    }

      _.each(bucketAgg.buckets, function (bucket) {
        var newRow = row.slice(0);
        newRow.push(bucket.key)
        if (sample.key_as_string) newRow.push(bucket.key_as_string)
        newRow.push(bucket.doc_count);
        table(bucket, newRow);
      });
  }

  function table(obj, row) {
    row = row || [];

    var bucketAggs = [];
    _.forOwn(obj, function (val, key) {
      if (_.isPlainObject(val)) {
        if (val.buckets) {
          bucketAggs.push({name: key, buckets: val.buckets});
        } else {
          if (!headerComplete) addHeader(key);
          row.push(val.value);
        }
      }
    });

    if (bucketAggs.length === 0) {
      rows.push(row);
      headerComplete = true;
    } else if (bucketAggs.length === 1) {
      processBucketAgg(row, bucketAggs[0]);
    } else {
      throw new Error ('Can only flatten 1 bucket agg per level');
    }

    return {
      header: header, // This is gross.
      rows: rows
    }
  }
  return table(obj);
}