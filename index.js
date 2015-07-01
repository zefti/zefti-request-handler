var path = require('path');
var validate = require('./validate.js');
var common = require('zefti-common');
var utils = require('zefti-utils');
var config = require('zefti-config');
var errors = require('./lib/errors.json');

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
  if (options.errorHandler) options.errorHandler.addErrors(errors);

  if (typeof ruleSetOption === 'string') {
    ruleSet = config.validation[ruleSetOption];
  } else {
    ruleSet = ruleSetOption;
  }

  if (!ruleSet || utils.type(ruleSet) !== 'object') throw new Error('ruleSet is not formed well');

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
      if (req.body.hasOwnProperty(field)) {
        if (!ruleSet[field].alias) return cb({errCode: '551667afa9a46d0387f95f08', payload:payload, fields:{field:field}});
        for (var rule in ruleSet[field].rules) {
          var args = [req.body[field], ruleSet[field].rules[rule]];
          if (rule === 'equivalence') {
            args.push(req.body[ruleSet[field].rules[rule]]);
          }
          var result = validate[rule].apply(validate[rule], args);
          if (result !== 1) return cb(result);
        }
        if (ruleSet[field].payloadStructure) {
          var structure = ruleSet[field].payloadStructure.split('.');
          var runningStructure = '';
          structure.forEach(function(segment){
            runningStructure = runningStructure + segment;
            if (!payload[runningStructure]) payload[runningStructure] = {};
          });
          payload[ruleSet[field].payloadStructure][ruleSet[field].alias] = req.body[field];
        } else {
          payload[ruleSet[field].alias] = req.body[field];
        }

      } else if (!req.body.hasOwnProperty(field) && ruleSet[field].required) {
        return cb({errCode: '551667b0a9a46d0387f95f09', payload:payload, fields:{field:field}});
      } else {
        console.log('im doing nothing, and thats because i was too lazy to code this part');
        //do nothing
      }
    }
    payload.res = res;
    return cb(null, payload);
  };
  return requestHandler;
}