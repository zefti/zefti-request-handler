var util = require('zefti-utils')();

function minLength(arg, length) {
  if (arg.length < length) return 'field does not meet minimum length requirement, arg: ' + arg + ' with length: ' + length;
  return 1;
}

function maxLength(arg, length) {
  if (arg.length > length) return 'field exceeds the maximum length requirement, arg: ' + arg + ' with length: ' + length;
  return 1;
}

function type(arg, type) {
  if (util.type(arg) !== type) return 'type does not match, arg: ' + arg + ' with enforced type: ' + type;
  return 1;
}

function numberType(arg, type) {
  if(util.numberType(arg) !== type) return 'number type does not match, arg: ' + arg + ' type: ' + type;
  return 1;
}

function equivalence(arg, fieldName, field){
  if (arg !== field) return 'no equivalence, arg: ' + arg + ' with fieldName: ' + fieldName + ' for field: ' + field;
  return 1;
}

module.exports = {
    minLength : minLength
  , maxLength : maxLength
  , type : type
  , equivalence : equivalence
  , numberType : numberType
};