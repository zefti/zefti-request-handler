var path = require('path');
var validate = require('./validate.js');
var common = require('zefti-common');
var utils = require('zefti-utils')({});
var rootDir = path.dirname(require.main.filename);
var configPath = common.configPath || 'config';
var config = require('zefti-config')();

/*
* Analytics
* 1. count the number of incoming requests per route
* 2. count the number of incoming requests per country
* 3. count the number of incoming requests per state
*
 */

module.exports = function(options){
  var ruleSet = null;
  var appVersionKey = null;
  var osVersionKey = null;

  var ruleSetOption = options.ruleSet;

  if (options.versionKey) appVersionKey = options.versionKey;
  if (options.osVersionKey) osVersionKey = options.osVersionKey;

  if (typeof ruleSetOption === 'string') {
    ruleSet = config.validation[ruleSetOption];
  } else {
    ruleSet = ruleSetOption;
  }

  if (Object.keys(ruleSet).length === 0) {
    throw new Error('ruletSet must have fields');
  }

  var requestHandler = function(req, res, cb){
    var payload = {};

    /*
     *  Version Parsing
     */

    if (appVersionKey) payload.appVersion = req.headers[appVersionKey];
    if (osVersionKey) payload.osVersion = req.headers[osVersionKey];
    payload.requestStartTime = new Date();

    /*
     *  Field Validation
     */


    for (var field in ruleSet) {
      if (req.hasOwnProperty(field)) {
        if (!ruleSet[field].alias) return cb('Aliases are required.  Missing alias in ruleSet for field: ' + field);
        for (var rule in ruleSet[field].rules) {
          var args = [req[field], ruleSet[field].rules[rule]];
          if (rule === 'equivalence') args.push(req[ruleSet[field].rules[rule]]);
          var result = validate[rule].apply(validate[rule], args);
          if (result !== 1) return cb(result);
        }
        payload[ruleSet[field].alias] = req[field];

      } else if (!req.hasOwnProperty(field) && ruleSet[field].required) {
        return cb('field: ' + field + ' is required', null);
      } else {
        //do nothing
      }
    }
    return cb(null, payload);
  };
  return requestHandler;
}