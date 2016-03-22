var util = require('zefti-utils');

function minLength(arg, length, fieldName) {
  if (arg.length < length) return {errCode: '551667b1a9a46d0387f95f0a', fields:{arg:arg, length:length, fieldName: fieldName}};
  return 1;
}

function maxLength(arg, length, fieldName) {
  if (arg.length > length) return {errCode: '551667b1a9a46d0387f95f0b', fields:{arg:arg, length:length, fieldName: fieldName}};
  return 1;
}

function type(arg, type, fieldName) {
  if (util.type(arg) !== type) return {errCode: '551667b2a9a46d0387f95f0c', fields:{arg:arg, type:type, fieldName: fieldName}};
  return 1;
}

function numberType(arg, type, fieldName) {
  if(util.numberType(arg) !== type) return {errCode: '5517ab10a9a46d0387f95f0d', fields:{arg:arg, type:type, fieldName: fieldName}};
  return 1;
}

function equivalence(arg, fieldName, field){
  if (arg !== field) return {errCode: '5517ab11a9a46d0387f95f0e', fields:{arg:arg, fieldName:fieldName, field:field}};
  return 1;
}

module.exports = {
    minLength : minLength
  , maxLength : maxLength
  , type : type
  , equivalence : equivalence
  , numberType : numberType
};