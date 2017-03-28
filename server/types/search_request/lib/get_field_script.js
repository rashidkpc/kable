module.exports = function (field, searchRequest) {
  searchRequest.scripts = searchRequest.scripts || {};
  return searchRequest.scripts[field] || `(doc['${field}.keyword'].value)`;
};
