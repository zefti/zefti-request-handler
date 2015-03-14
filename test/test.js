var assert = require('assert');
var requestHandler = require('../index.js');

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
  'testField': {
    'required': true
    , 'alias' : 'testField'
  }
};

/*
 * Test a function is returned for requestHandler
 */

describe('structure', function(){
  it('should return a function after passing in a rule set', function(){
    var requestHandlerInstance = requestHandler({ruleSet:requiredJson});
    assert.equal(typeof requestHandlerInstance, 'function');
  });
});

/*
 * Test the required Logic
 */



describe('required', function(){
  var requestHandlerInstance = requestHandler(requiredJson);
  var testValue = 'blah';

  it('should return payload as an object', function(done){
    requestHandlerInstance({testField : testValue}, {}, function(err, payload){
      if (err) throw new Error(err);
      assert.equal(typeof payload, 'object');
      done();
    });
  });

  it('should return ok because testField is required', function(done){
    requestHandlerInstance({testField : testValue}, {}, function(err, payload){
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
  'testField': {
    'rules' : {
      'minLength': 8
    }
    , 'alias' : 'testField'
  }
};

var minLength4Json = {
  'testField': {
    'rules' : {
      'minLength': 4
    }
    , 'alias' : 'testField'
  }
};

describe('minimumLength', function(){
  var requestHandlerInstance4 = requestHandler(minLength4Json);
  var requestHandlerInstance8 = requestHandler(minLength8Json);

  it('should be ok when string over minimum length', function(done){
    requestHandlerInstance4({testField:testString6}, {}, function(err, payload){
      if (err) throw new Error(err);
      assert.equal(payload.testField, testString6);
      done();
    });
  });

  it('should err when string under minimum length', function(done){
    requestHandlerInstance8({testField:testString6}, {}, function(err, payload){
      assert.equal(typeof err, 'string');
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it('should be ok when array over minimum length', function(done){
    requestHandlerInstance4({testField:testArray6}, {}, function(err, payload){
      if (err) throw new Error(err);
      assert.equal(payload.testField, testArray6);
      done();
    });
  });

  it('should err when array under minimum length', function(done){
    requestHandlerInstance8({testField:testArray6}, {}, function(err, payload){
      assert.equal(typeof err, 'string');
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

});


/*
 * Test the maximum Length Logic
 */

var maxLength8Json = {
  'testField': {
    'rules' : {
      'maxLength': 8
    }
    , 'alias' : 'testField'
  }
};

var maxLength4Json = {
  'testField': {
    'rules' : {
      'maxLength': 4
    }
    , 'alias' : 'testField'
  }
};

describe('maximumLength', function(){
  var requestHandlerInstance4 = requestHandler(maxLength4Json);
  var requestHandlerInstance8 = requestHandler(maxLength8Json);

  it('should be ok when string under max length', function(done){
    requestHandlerInstance8({testField:testString6, abc:123}, {}, function(err, payload){
      if (err) throw new Error(err);
      assert.equal(payload.testField, testString6);
      done();
    });
  });

  it('should err when string over max length', function(done){
    requestHandlerInstance4({testField:testString6}, {}, function(err, payload){
      assert.equal(typeof err, 'string');
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it('should be ok when array under max length', function(done){
    requestHandlerInstance8({testField:testArray6, abc:123}, {}, function(err, payload){
      if (err) throw new Error(err);
      assert.equal(payload.testField, testArray6);
      done();
    });
  });

  it('should err when array over max length', function(done){
    requestHandlerInstance4({testField:testArray6}, {}, function(err, payload){
      assert.equal(typeof err, 'string');
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

});

/*
 * Test the type logic
 */

var jsonTypeString = {
  'testField': {
    'rules' : {
      'type': 'string'
    }
    , 'alias' : 'testField'
  }
};

var jsonTypeNumber = {
  'testField': {
    'rules' : {
      'type': 'number'
    }
    , 'alias' : 'testField'
  }
};

var jsonTypeObject = {
  'testField': {
    'rules' : {
      'type': 'object'
    }
    , 'alias' : 'testField'
  }
};

var jsonTypeArray = {
  'testField': {
    'rules' : {
      'type': 'array'
    }
    , 'alias' : 'testField'
  }
};

var jsonTypeBoolean = {
  'testField': {
    'rules' : {
      'type': 'boolean'
    }
    , 'alias' : 'testField'
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
    stringHandler({testField:testString}, {}, function(err, payload){
      if (err) throw new Error(err);
      assert.equal(payload.testField, testString);
      assert.equal(typeof payload.testField, 'string');
      done();
    });
  });

  it ('should fail to pass a number into a field enforcing string', function(done){
    stringHandler({testField:testNumber}, {}, function(err, payload){
      assert.equal(typeof err, 'string');
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it ('should fail to pass an empty object into a field enforcing string', function(done){
    stringHandler({testField:testEmptyObject}, {}, function(err, payload){
      assert.equal(typeof err, 'string');
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it ('should fail to pass an object into a field enforcing string', function(done){
    stringHandler({testField:testObject}, {}, function(err, payload){
      assert.equal(typeof err, 'string');
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it ('should fail to pass an empty array into a field enforcing string', function(done){
    stringHandler({testField:testEmptyArray}, {}, function(err, payload){
      assert.equal(typeof err, 'string');
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it ('should fail to pass an array into a field enforcing string', function(done){
    stringHandler({testField:testArray}, {}, function(err, payload){
      assert.equal(typeof err, 'string');
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
    numberHandler({testField:testNumber}, {}, function(err, payload){
      if (err) throw new Error(err);
      assert.equal(payload.testField, testNumber);
      assert.equal(typeof payload.testField, 'number');
      done();
    });
  });

  it ('should fail to pass a string into a field enforcing number', function(done){
    numberHandler({testField:testString}, {}, function(err, payload){
      assert.equal(typeof err, 'string');
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it ('should fail to pass an empty object into a field enforcing number', function(done){
    numberHandler({testField:testEmptyObject}, {}, function(err, payload){
      assert.equal(typeof err, 'string');
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it ('should fail to pass an empty into a field enforcing number', function(done){
    numberHandler({testField:testObject}, {}, function(err, payload){
      assert.equal(typeof err, 'string');
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it ('should fail to pass an empty array into a field enforcing number', function(done){
    numberHandler({testField:testEmptyArray}, {}, function(err, payload){
      assert.equal(typeof err, 'string');
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it ('should fail to pass an array into a field enforcing number', function(done){
    numberHandler({testField:testArray}, {}, function(err, payload){
      assert.equal(typeof err, 'string');
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
    objectHandler({testField:testObject}, {}, function(err, payload){
      if (err) throw new Error(err);
      assert.equal(payload.testField, testObject);
      assert.equal(typeof payload.testField, 'object');
      done();
    });
  });

  it ('should be ok to pass an empty object into a field enforcing object', function(done){
    objectHandler({testField:testEmptyObject}, {}, function(err, payload){
      assert.equal(payload.testField, testEmptyObject);
      assert.equal(typeof payload.testField, 'object');
      done();
    });
  });

  it ('should fail to pass a string into a field enforcing object', function(done){
    objectHandler({testField:testString}, {}, function(err, payload){
      assert.equal(typeof err, 'string');
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it ('should fail to pass a number a field enforcing object', function(done){
    objectHandler({testField:testNumber}, {}, function(err, payload){
      assert.equal(typeof err, 'string');
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it ('should fail to pass an empty array into a field enforcing object', function(done){
    objectHandler({testField:testEmptyArray}, {}, function(err, payload){
      assert.equal(typeof err, 'string');
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it ('should fail to pass an array into a field enforcing object', function(done){
    objectHandler({testField:testArray}, {}, function(err, payload){
      assert.equal(typeof err, 'string');
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
    arrayHandler({testField:testArray}, {}, function(err, payload){
      if (err) throw new Error(err);
      assert.equal(payload.testField, testArray);
      assert.equal(payload.testField instanceof Array, true);
      done();
    });
  });

  it ('should be ok to pass an empty array into a field enforcing array', function(done){
    arrayHandler({testField:testEmptyArray}, {}, function(err, payload){
      if (err) throw new Error(err);
      assert.equal(payload.testField, testEmptyArray);
      assert.equal(payload.testField instanceof Array, true);
      done();
    });
  });

  it ('should fail to pass a string into a field enforcing array', function(done){
    arrayHandler({testField:testString}, {}, function(err, payload){
      assert.equal(typeof err, 'string');
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it ('should fail to pass a number a field enforcing array', function(done){
    arrayHandler({testField:testNumber}, {}, function(err, payload){
      assert.equal(typeof err, 'string');
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it ('should fail to pass an empty object into a field enforcing array', function(done){
    arrayHandler({testField:testEmptyObject}, {}, function(err, payload){
      assert.equal(typeof err, 'string');
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it ('should fail to pass an object into a field enforcing array', function(done){
    arrayHandler({testField:testObject}, {}, function(err, payload){
      assert.equal(typeof err, 'string');
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });
});

/*
 * Test numberType
 */

var jsonTypeInteger = {
  'testField': {
    'rules' : {
      'numberType': 'integer'
    }
    , 'alias' : 'testField'
  }
};

var jsonTypeFloat = {
  'testField': {
    'rules' : {
      'numberType': 'float'
    }
    , 'alias' : 'testField'
  }
};

var integerHandler = requestHandler(jsonTypeInteger);
var floatHandler = requestHandler(jsonTypeFloat);



describe('numberType - integer', function(){

  it('should be ok when passing an integer into a field enforcing integer', function(done){
    integerHandler({testField:testInteger}, {}, function(err, payload){
      if (err) throw new Error(err);
      assert.equal(payload.testField, testInteger);
      done();
    });
  });

  it('should fail when passing a string into a field enforcing integer', function(done){
    integerHandler({testField:testString}, {}, function(err, payload){
      assert.equal(typeof err, 'string');
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it('should fail when passing a float into a field enforcing integer', function(done){
    integerHandler({testField:testFloat}, {}, function(err, payload){
      assert.equal(typeof err, 'string');
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it('should fail when passing an object into a field enforcing integer', function(done){
    integerHandler({testField:testObject}, {}, function(err, payload){
      assert.equal(typeof err, 'string');
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it('should fail when passing an array into a field enforcing integer', function(done){
    integerHandler({testField:testArray}, {}, function(err, payload){
      assert.equal(typeof err, 'string');
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it('should fail when passing a true boolean into a field enforcing integer', function(done){
    integerHandler({testField:true}, {}, function(err, payload){
      assert.equal(typeof err, 'string');
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it('should fail when passing a false boolean into a field enforcing integer', function(done){
    integerHandler({testField:false}, {}, function(err, payload){
      assert.equal(typeof err, 'string');
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

});

describe('numberType - float', function(){

  it('should be ok when passing a float into a field enforcing float', function(done){
    floatHandler({testField:testFloat}, {}, function(err, payload){
      if (err) throw new Error(err);
      assert.equal(payload.testField, testFloat);
      done();
    });
  });

  it('should fail when passing a string into a field enforcing float', function(done){
    floatHandler({testField:testString}, {}, function(err, payload){
      assert.equal(typeof err, 'string');
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it('should fail when passing an integer into a field enforcing float', function(done){
    floatHandler({testField:testInteger}, {}, function(err, payload){
      assert.equal(typeof err, 'string');
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it('should fail when passing an object into a field enforcing float', function(done){
    floatHandler({testField:testObject}, {}, function(err, payload){
      assert.equal(typeof err, 'string');
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it('should fail when passing an array into a field enforcing float', function(done){
    floatHandler({testField:testArray}, {}, function(err, payload){
      assert.equal(typeof err, 'string');
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it('should fail when passing a true boolean into a field enforcing float', function(done){
    floatHandler({testField:true}, {}, function(err, payload){
      assert.equal(typeof err, 'string');
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

  it('should fail when passing a false boolean into a field enforcing float', function(done){
    floatHandler({testField:false}, {}, function(err, payload){
      assert.equal(typeof err, 'string');
      assert.equal(typeof payload, 'undefined');
      done();
    });
  });

});
