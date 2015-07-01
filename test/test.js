var assert = require('assert');
var requestHandler = require('../index.js');
var utils = require('zefti-utils');

/*
 * define test fields
 */
var testString = 'abcdefg';
var testString6 = '123456';
var testNumber = 42;
var testInteger = 42;
var testFloat = 42.42;
var testEmptyObject = {};
var testObject = {foo:'bar', bing:'bang'};
var testEmptyArray = [];
var testArray6 = [1,2,3,4,5,6];
var testArray = ['foo', 'bar', 'bing', 'bang'];

var requiredJson = {
  'ruleSet' : {
    'testField': {
      'required': true
      , 'alias': 'testField'
    }
  }
};

/*
 * Test a function is returned for requestHandler
 */

describe('structure', function(){
  it('should return a function after passing in a rule set', function(done){
    var requestHandlerInstance = requestHandler(requiredJson);
    assert.equal(typeof requestHandlerInstance, 'function');
    done();
  });
});

/*
 * Test the required Logic
 */



describe('required', function(){
  var requestHandlerInstance = requestHandler(requiredJson);
  var testValue = 'blah';

  it('should return payload as an object', function(done){
    requestHandlerInstance({body:{testField : testValue}}, {}, function(err, payload){
      if (err) throw new Error(err);
      assert.equal(typeof payload, 'object');
      done();
    });
  });

  it('should return ok because testField is required', function(done){
    requestHandlerInstance({body:{testField : testValue}}, {}, function(err, payload){
      if (err) throw new Error(err);
      assert.equal(payload.testField, testValue);
      done();
    });
  });
});

/*
 * Test the minimum Length Logic
 */

var minLength8Json = {
  'ruleSet' : {
    'testField': {
      'rules': {
        'minLength': 8
      }
      , 'alias': 'testField'
    }
  }
};

var minLength4Json = {
  'ruleSet' : {
    'testField': {
      'rules': {
        'minLength': 4
      }
      , 'alias': 'testField'
    }
  }
};

describe('minimumLength', function(){
  var requestHandlerInstance4 = requestHandler(minLength4Json);
  var requestHandlerInstance8 = requestHandler(minLength8Json);

  it('should be ok when string over minimum length', function(done){
    requestHandlerInstance4({body:{testField:testString6}}, {}, function(err, payload){
      if (err) throw new Error(err);
      assert.equal(payload.testField, testString6);
      done();
    });
  });

  it('should err when string under minimum length', function(done){
    requestHandlerInstance8({body:{testField:testString6}}, {}, function(err, payload){
      assert(err);
      if (utils.type(err) === 'object') assert(err.errCode);
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it('should be ok when array over minimum length', function(done){
    requestHandlerInstance4({body:{testField:testArray6}}, {}, function(err, payload){
      if (err) throw new Error(err);
      assert.equal(payload.testField, testArray6);
      done();
    });
  });

  it('should err when array under minimum length', function(done){
    requestHandlerInstance8({body:{testField:testArray6}}, {}, function(err, payload){
      assert(err);
      if (utils.type(err) === 'object') assert(err.errCode);
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

});


/*
 * Test the maximum Length Logic
 */

var maxLength8Json = {
  'ruleSet' : {
    'testField': {
      'rules': {
        'maxLength': 8
      }
      , 'alias': 'testField'
    }
  }
};

var maxLength4Json = {
  'ruleSet' : {
    'testField': {
      'rules': {
        'maxLength': 4
      }
      , 'alias': 'testField'
    }
  }
};

describe('maximumLength', function(){
  var requestHandlerInstance4 = requestHandler(maxLength4Json);
  var requestHandlerInstance8 = requestHandler(maxLength8Json);

  it('should be ok when string under max length', function(done){
    requestHandlerInstance8({body:{testField:testString6, abc:123}}, {}, function(err, payload){
      if (err) throw new Error(err);
      assert.equal(payload.testField, testString6);
      done();
    });
  });

  it('should err when string over max length', function(done){
    requestHandlerInstance4({body:{testField:testString6}}, {}, function(err, payload){
      assert(err);
      if (utils.type(err) === 'object') assert(err.errCode);
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it('should be ok when array under max length', function(done){
    requestHandlerInstance8({body:{testField:testArray6, abc:123}}, {}, function(err, payload){
      if (err) throw new Error(err);
      assert.equal(payload.testField, testArray6);
      done();
    });
  });

  it('should err when array over max length', function(done){
    requestHandlerInstance4({body:{testField:testArray6}}, {}, function(err, payload){
      assert(err);
      if (utils.type(err) === 'object') assert(err.errCode);
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

});

/*
 * Test the type logic
 */

var jsonTypeString = {
  'ruleSet' : {
    'testField': {
      'rules': {
        'type': 'string'
      }
      , 'alias': 'testField'
    }
  }
};

var jsonTypeNumber = {
  'ruleSet' : {
    'testField': {
      'rules': {
        'type': 'number'
      }
      , 'alias': 'testField'
    }
  }
};

var jsonTypeObject = {
  'ruleSet' : {
    'testField': {
      'rules': {
        'type': 'object'
      }
      , 'alias': 'testField'
    }
  }
};

var jsonTypeArray = {
  'ruleSet' : {
    'testField': {
      'rules': {
        'type': 'array'
      }
      , 'alias': 'testField'
    }
  }
};

var jsonTypeBoolean = {
  'ruleSet' : {
    'testField': {
      'rules': {
        'type': 'boolean'
      }
      , 'alias': 'testField'
    }
  }
};

var stringHandler = requestHandler(jsonTypeString);
var numberHandler = requestHandler(jsonTypeNumber);
var objectHandler = requestHandler(jsonTypeObject);
var arrayHandler = requestHandler(jsonTypeArray);
var booleanHandler = requestHandler(jsonTypeBoolean);



/*
 * Test type - string
 */

describe('type - string', function(){


  it ('should be ok to pass a string into a field enforcing string', function(done){
    stringHandler({body:{testField:testString}}, {}, function(err, payload){
      if (err) throw new Error(err);
      assert.equal(payload.testField, testString);
      assert.equal(typeof payload.testField, 'string');
      done();
    });
  });

  it ('should fail to pass a number into a field enforcing string', function(done){
    stringHandler({body:{testField:testNumber}}, {}, function(err, payload){
      assert(err);
      if (utils.type(err) === 'object') assert(err.errCode);
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it ('should fail to pass an empty object into a field enforcing string', function(done){
    stringHandler({body:{testField:testEmptyObject}}, {}, function(err, payload){
      assert(err);
      if (utils.type(err) === 'object') assert(err.errCode);
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it ('should fail to pass an object into a field enforcing string', function(done){
    stringHandler({body:{testField:testObject}}, {}, function(err, payload){
      assert(err);
      if (utils.type(err) === 'object') assert(err.errCode);
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it ('should fail to pass an empty array into a field enforcing string', function(done){
    stringHandler({body:{testField:testEmptyArray}}, {}, function(err, payload){
      assert(err);
      if (utils.type(err) === 'object') assert(err.errCode);
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it ('should fail to pass an array into a field enforcing string', function(done){
    stringHandler({body:{testField:testArray}}, {}, function(err, payload){
      assert(err);
      if (utils.type(err) === 'object') assert(err.errCode);
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });
});


/*
 * Test type - number
 */

describe('type - number', function(){


  it ('should be ok to pass a number into a field enforcing number', function(done){
    numberHandler({body:{testField:testNumber}}, {}, function(err, payload){
      if (err) throw new Error(err);
      assert.equal(payload.testField, testNumber);
      assert.equal(typeof payload.testField, 'number');
      done();
    });
  });

  it ('should fail to pass a string into a field enforcing number', function(done){
    numberHandler({body:{testField:testString}}, {}, function(err, payload){
      assert(err);
      if (utils.type(err) === 'object') assert(err.errCode);
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it ('should fail to pass an empty object into a field enforcing number', function(done){
    numberHandler({body:{testField:testEmptyObject}}, {}, function(err, payload){
      assert(err);
      if (utils.type(err) === 'object') assert(err.errCode);
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it ('should fail to pass an empty into a field enforcing number', function(done){
    numberHandler({body:{testField:testObject}}, {}, function(err, payload){
      assert(err);
      if (utils.type(err) === 'object') assert(err.errCode);
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it ('should fail to pass an empty array into a field enforcing number', function(done){
    numberHandler({body:{testField:testEmptyArray}}, {}, function(err, payload){
      assert(err);
      if (utils.type(err) === 'object') assert(err.errCode);
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it ('should fail to pass an array into a field enforcing number', function(done){
    numberHandler({body:{testField:testArray}}, {}, function(err, payload){
      assert(err);
      if (utils.type(err) === 'object') assert(err.errCode);
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });
});



/*
 * Test type - object
 */

describe('type - object', function(){


  it ('should be ok to pass an object into a field enforcing object', function(done){
    objectHandler({body:{testField:testObject}}, {}, function(err, payload){
      if (err) throw new Error(err);
      assert.equal(payload.testField, testObject);
      assert.equal(typeof payload.testField, 'object');
      done();
    });
  });

  it ('should be ok to pass an empty object into a field enforcing object', function(done){
    objectHandler({body:{testField:testEmptyObject}}, {}, function(err, payload){
      if (err) throw new Error(err);
      assert.equal(payload.testField, testEmptyObject);
      assert.equal(typeof payload.testField, 'object');
      done();
    });
  });

  it ('should fail to pass a string into a field enforcing object', function(done){
    objectHandler({body:{testField:testString}}, {}, function(err, payload){
      assert(err);
      if (utils.type(err) === 'object') assert(err.errCode);
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it ('should fail to pass a number a field enforcing object', function(done){
    objectHandler({body:{testField:testNumber}}, {}, function(err, payload){
      assert(err);
      if (utils.type(err) === 'object') assert(err.errCode);
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it ('should fail to pass an empty array into a field enforcing object', function(done){
    objectHandler({body:{testField:testEmptyArray}}, {}, function(err, payload){
      assert(err);
      if (utils.type(err) === 'object') assert(err.errCode);
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it ('should fail to pass an array into a field enforcing object', function(done){
    objectHandler({body:{testField:testArray}}, {}, function(err, payload){
      assert(err);
      if (utils.type(err) === 'object') assert(err.errCode);
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });
});



/*
 * Test type - array
 */

describe('type - array', function(){


  it ('should be ok to pass an array into a field enforcing array', function(done){
    arrayHandler({body:{testField:testArray}}, {}, function(err, payload){
      if (err) throw new Error(err);
      assert.equal(payload.testField, testArray);
      assert.equal(payload.testField instanceof Array, true);
      done();
    });
  });

  it ('should be ok to pass an empty array into a field enforcing array', function(done){
    arrayHandler({body:{testField:testEmptyArray}}, {}, function(err, payload){
      if (err) throw new Error(err);
      assert.equal(payload.testField, testEmptyArray);
      assert.equal(payload.testField instanceof Array, true);
      done();
    });
  });

  it ('should fail to pass a string into a field enforcing array', function(done){
    arrayHandler({body:{testField:testString}}, {}, function(err, payload){
      assert(err);
      if (utils.type(err) === 'object') assert(err.errCode);
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it ('should fail to pass a number a field enforcing array', function(done){
    arrayHandler({body:{testField:testNumber}}, {}, function(err, payload){
      assert(err);
      if (utils.type(err) === 'object') assert(err.errCode);
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it ('should fail to pass an empty object into a field enforcing array', function(done){
    arrayHandler({body:{testField:testEmptyObject}}, {}, function(err, payload){
      assert(err);
      if (utils.type(err) === 'object') assert(err.errCode);
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it ('should fail to pass an object into a field enforcing array', function(done){
    arrayHandler({body:{testField:testObject}}, {}, function(err, payload){
      assert(err);
      if (utils.type(err) === 'object') assert(err.errCode);
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });
});

/*
 * Test numberType
 */

var jsonTypeInteger = {
  'ruleSet' : {
    'testField': {
      'rules': {
        'numberType': 'integer'
      }
      , 'alias': 'testField'
    }
  }
};

var jsonTypeFloat = {
  'ruleSet' : {
    'testField': {
      'rules': {
        'numberType': 'float'
      }
      , 'alias': 'testField'
    }
  }
};

var integerHandler = requestHandler(jsonTypeInteger);
var floatHandler = requestHandler(jsonTypeFloat);



describe('numberType - integer', function(){

  it('should be ok when passing an integer into a field enforcing integer', function(done){
    integerHandler({body:{testField:testInteger}}, {}, function(err, payload){
      if (err) throw new Error(err);
      assert.equal(payload.testField, testInteger);
      done();
    });
  });

  it('should fail when passing a string into a field enforcing integer', function(done){
    integerHandler({body:{testField:testString}}, {}, function(err, payload){
      assert(err);
      if (utils.type(err) === 'object') assert(err.errCode);
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it('should fail when passing a float into a field enforcing integer', function(done){
    integerHandler({body:{testField:testFloat}}, {}, function(err, payload){
      assert(err);
      if (utils.type(err) === 'object') assert(err.errCode);
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it('should fail when passing an object into a field enforcing integer', function(done){
    integerHandler({body:{testField:testObject}}, {}, function(err, payload){
      assert(err);
      if (utils.type(err) === 'object') assert(err.errCode);
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it('should fail when passing an array into a field enforcing integer', function(done){
    integerHandler({body:{testField:testArray}}, {}, function(err, payload){
      assert(err);
      if (utils.type(err) === 'object') assert(err.errCode);
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it('should fail when passing a true boolean into a field enforcing integer', function(done){
    integerHandler({body:{testField:true}}, {}, function(err, payload){
      assert(err);
      if (utils.type(err) === 'object') assert(err.errCode);
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it('should fail when passing a false boolean into a field enforcing integer', function(done){
    integerHandler({body:{testField:false}}, {}, function(err, payload){
      assert(err);
      if (utils.type(err) === 'object') assert(err.errCode);
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

});

describe('numberType - float', function(){

  it('should be ok when passing a float into a field enforcing float', function(done){
    floatHandler({body:{testField:testFloat}}, {}, function(err, payload){
      if (err) throw new Error(err);
      assert.equal(payload.testField, testFloat);
      done();
    });
  });

  it('should fail when passing a string into a field enforcing float', function(done){
    floatHandler({body:{testField:testString}}, {}, function(err, payload){
      assert(err);
      if (utils.type(err) === 'object') assert(err.errCode);
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it('should fail when passing an integer into a field enforcing float', function(done){
    floatHandler({body:{testField:testInteger}}, {}, function(err, payload){
      assert(err);
      if (utils.type(err) === 'object') assert(err.errCode);
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it('should fail when passing an object into a field enforcing float', function(done){
    floatHandler({body:{testField:testObject}}, {}, function(err, payload){
      assert(err);
      if (utils.type(err) === 'object') assert(err.errCode);
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it('should fail when passing an array into a field enforcing float', function(done){
    floatHandler({body:{testField:testArray}}, {}, function(err, payload){
      assert(err);
      if (utils.type(err) === 'object') assert(err.errCode);
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it('should fail when passing a true boolean into a field enforcing float', function(done){
    floatHandler({body:{testField:true}}, {}, function(err, payload){
      assert(err);
      if (utils.type(err) === 'object') assert(err.errCode);
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it('should fail when passing a false boolean into a field enforcing float', function(done){
    floatHandler({body:{testField:false}}, {}, function(err, payload){
      assert(err);
      if (utils.type(err) === 'object') assert(err.errCode);
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

});
