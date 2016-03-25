module.exports = function (field, searchRequest) {
  searchRequest.scripts = searchRequest.scripts || {};
  return searchRequest.scripts[field] || `(
    function () {
      return doc['${field}'].value;
    }()
  )`
}
