module.exports = function (content, opts, callback, helper) {

  callback(null, JSON.stringify(JSON.parse(content.toString())));

};
