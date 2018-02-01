/*** Main JS file for the website of "Arbeid og Aktivitet, Tromsø" (by Jon Simonsen). ***/

/** Since importing seems to be a new feature in JS (perhaps not well supported yet), all used functions will be included in this file.
Three star comments start a new section. Two star comments are for subsections or important information.
More trivial comments use one star.**/

/*Sections (230118):
-Global constants
-Functions by others
-Functions by me
-html generation (when document is ready)*/


/*** Global consts ***/

/**Input types (used in testSelector to differentiate between differently formatted input).**/
const BAD_INPUT = -1      /*Used for testing. Do not include this value in INPUTTYPES.*/
const CLASS = 1;        /*For a string corresponding to a class name.*/
const COMPOSITE = 2;    /*For a combination of class name and a string corresponding to a tag.*/
const INPUTTYPES = [CLASS, COMPOSITE];        /*Allowed values of inputType.*/

/**Tag types. Controls what kind of tags are allowed for elements that are tested for occurrence in the html document.**/
const DEF_TAG = "section";    /*Default tag when testing. Should be in TAGTYPES and fit in there.*/
const TAGTYPES = [DEF_TAG, "body", "nav"];    /*Allowed tags when testing occurrence.*/

/**Default garbage of different types**/
const BAD_TAG = "h7";    /*Used for testing. Do not include this value in TAGTYPES.*/
const BAD_SSTR = ".test";
const BAD_STR = "test";
const BAD_ARR = [BAD_STR];
const BAD_INT = 123;

/**Message constants. Used as arguments or parts of arguments to identify what is being tested.**/
const TESTMAIN = "The function argument";
const TESTSUBPRE = "Subelement ";
const TESTSUBPOST = " of the function argument";

/**Names of functions used for testing.**/
const BTEST = "testBundle";
const STEST = "testSelector";
const VTEST = "testValidity";
const ALLTESTS = [BTEST, STEST, VTEST];

/**Error message prefixes for identifying where an error occurred.**/
const ERR_POST = "() error: "
const ERR_BUNDERR = BTEST + ERR_POST;
const ERR_SELERR = STEST + ERR_POST;
const ERR_VALIDERR = VTEST + ERR_POST;
const ERR_RUNTESTERR = "runTest" + ERR_POST;

/**Constraints that are allowed as arguments to testValidity().
For all of them (including FREE), an additional constraint is that the class only occurs on the given tag type.**/
const BAD_CONSTRAINT = -1;   /*For testing. Don't include this value in CONSTRAINTS.*/
const ABSENT = 1;
const PRESENT = 2;
const UNIQUE = 3;       /*Exactly one*/
/*At most one. A search for antonyms of plural didn't produce a useful description of a set of zero or one items,
so using non-plural as the name.*/
const NON_PLURAL = 4;
const FREE = 5;         /*No constraints*/
const CONSTRAINTS = [ABSENT, PRESENT, UNIQUE, NON_PLURAL, FREE];

/*** Functions made by others ***/

/*Function for reading a file (Should use a different one/load when going live)*/

/*Based on https://stackoverflow.com/questions/14446447/how-to-read-a-local-text-file*/
function readFile(file){
  let rawFile = new XMLHttpRequest();
  let allText = "";
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    if(rawFile.readyState === 4) {
      if(rawFile.status === 200 || rawFile.status == 0) {
        allText = rawFile.responseText;
      }
      else{
        console.log("Unexpected file status.");
      }
    }
    else{
      console.log("Unexpected file state.");
    }
  }

  try{
    rawFile.send(null);
  }
  catch (error){
    console.log("XMLHttpRequest error.");
    return null;
  }
  return allText;
}

/*Function for capitalizing a string (Make the first letter uppercase)*/

/*https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
*/
function capitalizeFirstLetter(string){
  return string.charAt(0).toUpperCase() + string.slice(1);
}


/*** Functions made by Jon Simonsen ***/

/*Function for reading a file and returning an array of paragraphs using double newlines as separators.
Note that the function currently assumes that XMLHttpRequest interprets a newline as "\r\n".
*/
function readParas(file){
  return readFile(file).split("\r\n\r\n");
}

/*Function for extracting userid from url. Returns null if the url has no attributes.
Returns null and displays an alert if there's something wrong with the attribute.
Otherwise, the value of the attribute (as a number) is returned.
Attributes other than userid is not allowed. Could have more detailed error checks and messages.
*/

/*For more advanced url extraction, check out https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
*/
function getUserId(){
  let match = "userid=";
  let errPrefix = "Incorrect url. ";
  let url = window.location.href;
  let start = url.indexOf("?") + 1;

  /*Test that the string contains the separator and that it occurs early enough that there is room for the attribute name and value.*/
  if(start <= 0){
    return null;
  }
  else if(start > url.length - (match.length + 1)){ /*+1 since indices start at 0 while lengths start at 1.*/
    alert(errPrefix + "Wrongly named attribute or no value.");
    return null;
  }

  /*Test that the expected attribute string occurs directly after the separator.*/
  if(!(url.slice(start,(start + match.length)) === match)){
    alert(errPrefix + "Wrongly named attribute.");
    return null;
  }

  let candidate = url.slice(start + match.length);

  /*Test that the value of the attribute is a number. If so, return it.*/

  if(isNaN(candidate)){
    alert(errPrefix + "Either the userid is not a number or the url contains garbage otherwise.");
    return null;
  }
  else{
    return Number(candidate);
  }
}

/*Function for counting number of true and false values in an array that is assumed to contain bool values.
The function might work on other arguments than arrays, but its behavior is undefined for such arguments.
boolArray is assumed to be an array of booleans.
The function counts the number of values that equals true and assumes that all other values are false.
It returns an array with the number of true as the first element and the number of false as the second element.
*/
function countBools(boolArray){
  let passes = (boolArray.filter(val => val === true)).length;
  let fails = boolArray.length - passes;
  return [passes, fails];
}

/*Function for logging the DOM-manipulation progress to the console.
post should be a boolean telling if the message is logged before(true) or after(false) the step.
progress should be a string saying what step was just finished or is just starting.
Returns nothing.*/
function logProgress(post, progress){
  let errPre = "logProgress() takes "
  /*Test arguments*/
  if(arguments.length !== 2){
    console.log(errPre + "exactly two arguments.");
    return;
  }
  if(typeof(post) !== "boolean"){
    console.log(errPre + "a boolean as its first argument.");
    return;
  }
  if(typeof(progress) !== "string"){
    console.log(errPre + "a string as its second argument.");
    return;
  }

  /*Construct progress message*/
  let timing = "";

  if(post){
    timing = "-Before ";
  }
  else{
    timing = "-After ";
  }

  console.log(timing + progress);
  return;
}

/*Function that logs a description of the test, then number of passes,
then number of fails followed by an empty line. Returns nothing.*/
function logTestRes(description, passes, fails){
  console.log("For " + description + ":");
  console.log("\t" + passes + " passes");
  console.log("\t" + fails + " fails\n\n");
  return;
}

/*Function for testing that inputArray is an array. Also test that it contains at least minElems items.
arrayText is used for describing the element (assumed array) that is being tested.
Look at the function or returned error message for its value range.
Returns a description of the error. If no error, it returns an empty string.
If any of the arguments to the function does not have the expected type or is outside the value range,
the error message will inform about this.*/
function testBundle(inputArray, arrayText = TESTMAIN, minElems = 1){
  let errPre = BTEST + "() expects ";

  /*Test that the callee has given a valid arrayText.*/
  if(typeof(arrayText) !== "string"){
    return errPre + "a string as its second argument.";
  }
  else if(arrayText !== TESTMAIN){
    let splitText = arrayText.split(/\d+/);    /*split string on digits*/
    /*Test that the split produces the desired result (two elements from the global consts).*/
    if(splitText.length !== 2){
      return errPre + "its second (string) argument to contain exactly one numeric part (unless it equals TESTMAIN).";
    }
    else if(splitText[0] !== TESTSUBPRE){
      return errPre + "its second (string) argument to start with TESTSUBPRE (unless it equals TESTMAIN).";
    }
    else if(splitText[1] !== TESTSUBPOST){
      return errPre + "its second (string) argument to end with TESTSUBPOST (unless it equals TESTMAIN).";
    }
  }

  /*Test other arguments that the callee might send.*/
  if(typeof(minElems) !== "number" || (!(Number.isInteger(minElems))) || minElems < 1){
    return errPre + "a positive integer as its third argument."
  }
  if(arguments.length > 3){
    return errPre + "at most three arguments.";
  }

  /*Test that the default value of minElems is used when the default value of arrayText is used*/
  if(arrayText === TESTMAIN && minElems !== 1){
    return errPre + "its third argument to equal 1 when its second argument equals TESTMAIN.";
  }

  /*Do the actual test by making sure that the first argument satisfies the criteria.*/
  if(!(Array.isArray(inputArray))){
    return arrayText + " is expected to be an array.";
  }
  else if(inputArray.length < minElems){
    return arrayText + " is expected to contain at least " + minElems + " elements.";
  }
  else{
    return "";
  }
}

/*Function for testing inputs according to inputType. All legal inputTypes should be members of a global INPUTTYPES array.
inputOne should be a string corresponding to a classname (starting with a dot).
inputTwo should be a string containing an html tag that is expected to be a member of a global TAGTYPES array.
Returns an empty string if no error was found. Otherwise, returns an error message.*/
function testSelector(inputType, inputOne, inputTwo = ""){
  /*Test that the inputType has an expected value*/
  if(!(INPUTTYPES.includes(inputType))){
    return ERR_SELERR + "The inputType argument must be equal to an element in the global const Array INPUTTYPES.";
  }

  /*Test that the callee doesn't give too many arguments*/
  if(arguments.length > 3){
    return ERR_SELERR + "Do not pass more than three arguments."
  }

  /*Test that inputTwo has an expected value for the given inputType and that an accepted inputType is actually being processed by this function.*/
  if(inputType === CLASS){
    if(inputTwo){
      return ERR_SELERR + "Do not pass more than two arguments for inputType CLASS.";
    }
  }
  else if(inputType === COMPOSITE){
    /*If no inputTwo is given, the array that is supposed to contain elements are tested*/
    if(!inputTwo){
      return ERR_SELERR + "Pass three arguments when inputType is COMPOSITE.";
    }
    else{
      if(!(TAGTYPES.includes(inputTwo))){
        return '"' + JSON.stringify(inputTwo) + '" is not in the list of allowed tags (TAGTYPES).';
      }
    }
  }
  else{
    /*This should not be possible unless this function is wrong (possibly due to not updating).*/
    return ERR_SELERR + "The function needs to be updated to process all possible inputTypes correctly.";
  }

  /*Test that inputOne is a string containing a class name.*/
  if(typeof(inputOne) !== "string"){
    /*Since JS would remove brackets when converting, a JSON method is used.*/
    /*https://stackoverflow.com/questions/22746353/javascript-convert-array-to-string-while-preserving-brackets*/
    return '"' + JSON.stringify(inputOne) + '" (without the quotes) is not a string.';
  }
  else if(inputOne[0] !== "."){
    return '"' + inputOne + '" does not start with a dot.';
  }

  return "";    /*No error detected*/
}

/*Function for testing if the occurence of all elements are as specified by constraint.
If constraint is not included in CONSTRAINTS, this counts as a format error.
The function also tests that the selectorArray is formatted according to constraint.
ABSENT expects an array of strings (class names, each starting with a dot).
The other constraint types expect an array of arrays of two strings
(the first being a tag and the second being a class name).
Each tag should be one of the tags in TAGTYPES.
No element with other tag types should have the same class as any of those tags (counts as an occurence error).

If the format is broken, a message for the first error is logged to the console. The function might or might not log further errors.
Otherwise (constraint broken or tag restriction on classes broken), messages for all encountered errors are logged.
Returns true if the constraints are met and no format errors occurred. Otherwise returns false.*/
function testValidity(constraint, selectorArray){
  /*Test that constraint is included in CONSTRAINTS*/
  if(!(CONSTRAINTS.includes(constraint))){
    console.log(ERR_VALIDERR + "Its first argument must be equal to an element in CONSTRAINTS.");
    return false;
  }

  /*Test that selectorArray is a non-empty array*/
  let errorMsg = testBundle(selectorArray);

  if(errorMsg){
    console.log(ERR_VALIDERR + errorMsg);
    return false;
  }

  let validity = true;    /*Assume that the argument is of the correct type and otherwise valid until otherwise has been determined.*/
  let counter = 0;        /*Used for the index of subelements of selectorArray*/

  selectorArray.forEach(function(subElem) {
    if(constraint === ABSENT){
      errorMsg = testSelector(CLASS, subElem);
      if(errorMsg){
        validity = false;    /*Since a correct classname cannot be determined, validity has an unknown value and is assumed to be false.*/
        console.log(ERR_VALIDERR + "- With constraint ABSENT - " + errorMsg);
      }
      else{
        /*Test if subElem exists in the document*/
        if($(subElem).length){
          validity = false;
          console.log(ERR_VALIDERR + "There exists elements of class " + subElem + ".");
        }

      }
    }
    else{
      /*Test that subElem is an array with at least two elements.*/
      errorMsg = testBundle(subElem, "Subelement " + counter + " of the function argument", 2);

      if(errorMsg){
        validity = false;
        console.log(ERR_VALIDERR + errorMsg);
      }
      else{
        /*The subarray is fine. Test its elements.*/
        errorMsg = testSelector(COMPOSITE, subElem[1], subElem[0]);

        if(errorMsg){
          validity = false;
          console.log(ERR_VALIDERR + errorMsg);
        }
        else{
          let tagCount = ($(subElem[0] + subElem[1])).length;   /*Matches tag and class*/
          let classCount = ($(subElem[1])).length;              /*Matches the class*/

          if(classCount < tagCount){
            validity = false;
            console.log(ERR_VALIDERR + "The function suggests that the specified selector has more elements than the number of elements of its class.");
          }
          else if(classCount > tagCount){
            validity = false;
            console.log(ERR_VALIDERR + "There exists " + subElem[1] + " elements that has the wrong html tag.");
          }
          else{
            /*Test presence of subElem*/
            if((constraint === PRESENT || constraint === UNIQUE) && tagCount === 0){
              validity = false;
              console.log(ERR_VALIDERR + 'Selector "' + subElem[0] + subElem[1] + '" does not exist in the document.');
            }
            /*Test uniqueness of subElem*/
            if((constraint === UNIQUE || constraint === NON_PLURAL) && tagCount > 1){
              validity = false;
              console.log(ERR_VALIDERR + 'Selector "' + subElem[0] + subElem[1] + '" is not unique in the document.');
            }

          }
        }
      }
      counter++;
    }
  });

  return validity;
}

/*Function that acts as a helper for running test cases on functions corresponding to the names in ALLTESTS.
fName is a string that should match a function name in ALLTESTS.
description should describe the kind of input to fName() that is given (focused on its flaws if any).
argArray is an array containing every argument to be passed to fName().
passExpected is a boolean that tells if the test case is expected to pass.
The function logs the given description and the output from fName().
If this output suggests the same as passExpected, it logs "pass".
Otherwise, it logs "fail". In both cases, it logs a newline to signify the end of this logging.
Returns true if the test passed and false if it failed.*/
function runTest(fName, description, argArray, passExpected = false){
  /*Test that the given fName is a function name in the global const ALLTESTS.*/
  if(!(ALLTESTS.includes(fName))){
    console.log(ERR_RUNTESTERR + fName + " is not in the ALLTESTS array.");
    return false;
  }

  /*Test that the final element is a boolean*/
  if(typeof(passExpected) !== "boolean"){
    console.log(ERR_RUNTESTERR + "Its fourth argument should be a boolean.");
    return false;
  }

  /*Determine if the output of fName is expected to have a truthy or falsey value.*/
  let expOutput = null;
  /*So far, VTEST is the only test in ALLTESTS that returns a truth value directly.*/
  if(fName === VTEST){
    expOutput = passExpected;
  }
  else{
    /*The other tests return an empty string (evaluates to false) on passing
    and the opposite on failing. Therefore, the truth value has to be swapped.*/
    expOutput = !passExpected;
  }

  /*Log the description*/
  console.log(description);

  /*Call function (named fname) with the arguments provided in argArray and log the result*/
  let output = window[fName].apply(null, argArray);
  console.log("Yields: " + output);

  /*Log the result (pass/fail) of this test and return the corresponding value.*/
  if((expOutput && output) || (!expOutput && !output)){
    console.log("   -pass\n\n");
    return true;
  }
  else{
    console.log("   -fail\n\n");
    return false;
  }
}

/*Function for testing the testBundle() function.
Runs a number of test cases with different kinds of input.
Covers most kinds of input that should cause error messages along with some that shouldn't.
Logs test output to the console.
Returns a bool array containing number of passed tests followed by number of failed tests.*/
function test_testBundle(){
  const bTestPre = "When giving testBundle() ";
  const aString = TESTSUBPRE + BAD_INT + TESTSUBPOST;
  let resArray = [];

  /*Testing bundleTest()*/
  console.log("---Testing testBundle() expecting error messages.---");
  /*Second arg*/
  resArray.push(runTest(BTEST, bTestPre + "a non-string as its second argument:", [BAD_ARR, BAD_ARR]));
  resArray.push(runTest(BTEST, bTestPre + "a non-numeric string that doesn't equal TESTMAIN:", [BAD_ARR, "Subelement of the function argument"]));
  resArray.push(runTest(BTEST, bTestPre + "a string that starts with a numeric value:", [BAD_ARR, "1" + aString]));
  resArray.push(runTest(BTEST, bTestPre + "a string that ends with a numeric value:", [BAD_ARR, aString + "1"]));
  resArray.push(runTest(BTEST, bTestPre + "a string containing more than one numeric value:", [BAD_ARR, "Subelement 123 of the function456 argument"]));
  resArray.push(runTest(BTEST, bTestPre + "a string that doesn't start with TESTSUBPRE", [BAD_ARR, "Subelement123 of the function argument"]));
  resArray.push(runTest(BTEST, bTestPre + "a string that doesn't end with TESTSUBPOST", [BAD_ARR, "Subelement 123of the function argument"]));
  /*Third arg*/
  resArray.push(runTest(BTEST, bTestPre + "a non-number as its third argument:", [BAD_ARR, aString, "1"], true));
  resArray.push(runTest(BTEST, bTestPre + "an array of numbers as its third argument:", [BAD_ARR, aString, [1]]));
  resArray.push(runTest(BTEST, bTestPre + "a float as its third argument:", [BAD_ARR, aString, 3.14]));
  resArray.push(runTest(BTEST, bTestPre + "zero as its third argument:", [BAD_ARR, aString, 0]));
  resArray.push(runTest(BTEST, bTestPre + "a negative number as its third argument:", [BAD_ARR, aString, -1]));
  /*Combinations*/
  resArray.push(runTest(BTEST, bTestPre + "more than three arguments:", [BAD_ARR, aString, 1, ""]));
  resArray.push(runTest(BTEST, bTestPre + "TESTMAIN combined with more than 1 minElems", [BAD_ARR, TESTMAIN, 2]));
  /*First arg*/
  resArray.push(runTest(BTEST, bTestPre + "a non-array as its first argument:", [BAD_STR]));
  resArray.push(runTest(BTEST, bTestPre + "an empty array as its first argument:", [[]]));
  resArray.push(runTest(BTEST, bTestPre + "an array with fewer than minElems elements as its first argument:", [BAD_ARR, aString, 2]));

  /*Arg combos that are supposed to be valid (returning an empty string)*/
  console.log("---Testing testBundle() expecting no error message.---");
  resArray.push(runTest(BTEST, bTestPre + "a string that equals TESTMAIN", [BAD_ARR, TESTMAIN], true));
  resArray.push(runTest(BTEST, bTestPre + "a string that fits the regex matching:", [BAD_ARR, aString]));
  resArray.push(runTest(BTEST, bTestPre + "a positive integer as its third argument:", [BAD_ARR, aString, 1], true));
  resArray.push(runTest(BTEST, bTestPre + "an integer above 1 as its third argument:", [[BAD_STR, BAD_STR], aString, 2], true));

  /*Return number of passed tests and number of failed tests*/
  return countBools(resArray);
}

/*Function for testing the testSelector() function.
Runs a number of tests on different kinds of input.
Covers most kinds of input that should cause error messages along with some that shouldn't.
Logs test output to the console. Returns nothing.*/
function test_testSelector(){
  const sTestPre = "When giving testSelector() ";
  let resArray = [];

  /*Testing selectorTest()*/
  console.log("---Testing testSelector() expecting error messages.---");
  resArray.push(runTest(STEST, sTestPre + "a negative (non-allowed) inputType:", [BAD_INPUT, BAD_STR]));
  resArray.push(runTest(STEST, sTestPre + "more than three arguments:", [CLASS, BAD_STR, BAD_STR, BAD_STR], true));
  resArray.push(runTest(STEST, sTestPre + "three arguments with the first being CLASS:", [CLASS, BAD_STR, BAD_STR], true));
  resArray.push(runTest(STEST, sTestPre + "two arguments with the first being COMPOSITE:", [COMPOSITE, BAD_STR]));
  resArray.push(runTest(STEST, sTestPre + "a third argument that is not in the TAGTYPES list:", [COMPOSITE, BAD_STR, BAD_TAG]));
  resArray.push(runTest(STEST, sTestPre + "a second element that is not a string:", [CLASS, BAD_INT]));
  resArray.push(runTest(STEST, sTestPre + "a second element that is an array:", [CLASS, BAD_ARR]));
  resArray.push(runTest(STEST, sTestPre + "a second element that does not start with a dot:", [CLASS, BAD_STR]));

  /*Arg combos that are supposed to be valid (returning an empty string)*/
  console.log("---Testing testSelector() expecting no error message.---");
  resArray.push(runTest(STEST, sTestPre + "CLASS followed by a classname:", [CLASS, BAD_SSTR]));
  resArray.push(runTest(STEST, sTestPre + "COMPOSITE followed by a classname followed by a tag from TAGTYPES:", [COMPOSITE, BAD_SSTR, DEF_TAG], true));

  /*Return number of passed tests and number of failed tests*/
  return countBools(resArray);
}

function test_testValidity(){
  const vTestPre = "When giving testValidity() ";
  const tZero = ".test-zero";
  const tOne = ".test-one";
  const tTwo = ".test-two";
  const tMiss = ".test-missing";
  const tUno = ".test-unique";
  const tBody = ".test-body";
  let resArray = [];

  /*Testing first argument (constraint)*/
  console.log("---Testing testValidity() without a valid constraint---");
  resArray.push(runTest(VTEST, vTestPre + "a non-valid constraint:", [BAD_CONSTRAINT, BAD_STR]));

  /*Testing for absent elements*/
  console.log("---Testing testValidity() with ABSENT as constraint---");
  /*Expecting errors from testBundle() or testSelector()*/
  resArray.push(runTest(VTEST, vTestPre + "a non-array element:", [ABSENT, BAD_STR]));
  resArray.push(runTest(VTEST, vTestPre + "an empty array:", [ABSENT, []]));
  resArray.push(runTest(VTEST, vTestPre + "an array with a non-string subelement:", [ABSENT, [BAD_INT]]));
  resArray.push(runTest(VTEST, vTestPre + "an array with an array subelement:", [ABSENT, [BAD_ARR]]));
  resArray.push(runTest(VTEST, vTestPre + "an array with an incorrectly named string:", [ABSENT, BAD_ARR]));
  /*Testing one-element arrays that are expected to pass testBundle() and testSelector()*/
  console.log("---Subtests for one-element arrays---");
  resArray.push(runTest(VTEST, vTestPre + "an absent element:", [ABSENT, [tZero]], true));
  resArray.push(runTest(VTEST, vTestPre + "a unique element:", [ABSENT, [tOne]]));
  resArray.push(runTest(VTEST, vTestPre + "a non-unique element", [ABSENT, [tTwo]]));
  /*Testing multi-element arrays that are expected to pass testBundle() and testSelector()*/
  console.log("---Subtests for multi-element arrays---");
  resArray.push(runTest(VTEST, vTestPre + "several absent elements:", [ABSENT, [tZero, tMiss]], true));
  resArray.push(runTest(VTEST, vTestPre + "a combo of absent and present elements:", [ABSENT, [tTwo, tMiss, tZero, tOne]]));
  resArray.push(runTest(VTEST, vTestPre + "several present elements:", [ABSENT, [tOne, tTwo]]));

  /*Testing for present elements*/
  console.log("---Testing testValidity() with PRESENT as constraint---");
  /*Expecting errors from testBundle() or testSelector()*/
  /*Since it is assumed that the same code that handles PRESENT also handles UNIQUE, NON_PLURAL and FREE,
  those constraints will not test the bundling and selection.*/
  resArray.push(runTest(VTEST, vTestPre + "a non-array element:", [PRESENT, BAD_STR]));
  resArray.push(runTest(VTEST, vTestPre + "an empty array:", [PRESENT, []]));
  resArray.push(runTest(VTEST, vTestPre + "an array with a non-array subelement:", [PRESENT, BAD_ARR]));
  resArray.push(runTest(VTEST, vTestPre + "an array with an empty array as a subelement:", [PRESENT, [[]]]));
  resArray.push(runTest(VTEST, vTestPre + "an array with an array of one element as a subelement:", [PRESENT, [BAD_ARR]]));
  resArray.push(runTest(VTEST, vTestPre + "an array with an array where the first element is not a valid tag as a subelement:", [PRESENT, [[BAD_TAG, BAD_STR]]]));
  resArray.push(runTest(VTEST, vTestPre + "an array with an array where the second element is not a string as a subelement:", [PRESENT, [[DEF_TAG, BAD_INT]]]));
  resArray.push(runTest(VTEST, vTestPre + "an array with an array where the second element is an array as a subelement:", [PRESENT, [[DEF_TAG, BAD_ARR]]]));
  resArray.push(runTest(VTEST, vTestPre + "an array with an array where the second element is not starting with a dot as a subelement:", [PRESENT, [[DEF_TAG, BAD_STR]]]));
  /*one-elems...*/
  console.log("---Subtests for one-element arrays---");
  resArray.push(runTest(VTEST, vTestPre + "an absent element:", [PRESENT, [[DEF_TAG, tZero]]]));
  resArray.push(runTest(VTEST, vTestPre + "a unique element:", [PRESENT, [[DEF_TAG, tOne]]], true));
  resArray.push(runTest(VTEST, vTestPre + "a non-unique element:", [PRESENT, [[DEF_TAG, tTwo]]], true));
  resArray.push(runTest(VTEST, vTestPre + "a unique element that has a non-unique class:", [PRESENT, [[DEF_TAG, tBody]]]));
  /*multi-elems...*/
  console.log("---Subtests for multi-element arrays---");
  resArray.push(runTest(VTEST, vTestPre + "several absent elements:", [PRESENT, [[DEF_TAG, tZero], [DEF_TAG, tMiss]]]));
  resArray.push(runTest(VTEST, vTestPre + "a combo of absent and present elements:", [PRESENT, [[DEF_TAG, tTwo], [DEF_TAG, tMiss], [DEF_TAG, tZero], [DEF_TAG, tOne]]]));
  resArray.push(runTest(VTEST, vTestPre + "several present elements:", [PRESENT, [[DEF_TAG, tOne], [DEF_TAG, tTwo]]], true));
  resArray.push(runTest(VTEST, vTestPre + "a combo of absent, present and non-specific (multi-tag) elements:", [PRESENT, [[DEF_TAG, tBody], [DEF_TAG, tTwo], ["body", tBody], [DEF_TAG, tZero]]])); /*The console might log two of these on the same line as repeats.*/

  /*Testing for unique elements*/
  console.log("---Testing testValidity() with UNIQUE as constraint---");
  /*one-elems...*/
  console.log("\n---Subtests for one-element arrays---");
  resArray.push(runTest(VTEST, vTestPre + "an absent element:", [UNIQUE, [[DEF_TAG, tZero]]]));
  resArray.push(runTest(VTEST, vTestPre + "a unique element:", [UNIQUE, [[DEF_TAG, tOne]]], true));
  resArray.push(runTest(VTEST, vTestPre + "a non-unique element:", [UNIQUE, [[DEF_TAG, tTwo]]]));
  resArray.push(runTest(VTEST, vTestPre + "a unique element that has a non-unique class:", [UNIQUE, [[DEF_TAG, tBody]]]));
  /*multi-elems...*/
  console.log("---Subtests for multi-element arrays---");
  resArray.push(runTest(VTEST, vTestPre + "several absent elements:", [UNIQUE, [[DEF_TAG, tZero], [DEF_TAG, tMiss]]]));
  resArray.push(runTest(VTEST, vTestPre + "a combo of absent and present elements:", [UNIQUE, [[DEF_TAG, tTwo], [DEF_TAG, tMiss], [DEF_TAG, tZero], [DEF_TAG, tOne]]]));
  resArray.push(runTest(VTEST, vTestPre + "several present elements, one being unique:", [UNIQUE, [[DEF_TAG, tOne], [DEF_TAG, tTwo]]]));
  resArray.push(runTest(VTEST, vTestPre + "several unique elements:", [UNIQUE, [[DEF_TAG, tOne], [DEF_TAG, tUno]]], true));
  resArray.push(runTest(VTEST, vTestPre + "a combo of absent, present and non-specific (multi-tag) elements:", [UNIQUE, [[DEF_TAG, tBody], [DEF_TAG, tTwo], [DEF_TAG, tOne], ["body", tBody], [DEF_TAG, tZero], [DEF_TAG, tUno]]])); /*The console might log two of these on the same line as repeats.*/

  /*Testing for elements that should occur at most once*/
  console.log("---Testing testValidity() with NON_PLURAL as constraint---");
  /*one-elems...*/
  console.log("\n---Subtests for one-element arrays---");
  resArray.push(runTest(VTEST, vTestPre + "an absent element:", [NON_PLURAL, [[DEF_TAG, tZero]]]));
  resArray.push(runTest(VTEST, vTestPre + "a unique element:", [NON_PLURAL, [[DEF_TAG, tOne]]], true));
  resArray.push(runTest(VTEST, vTestPre + "a non-unique element:", [NON_PLURAL, [[DEF_TAG, tTwo]]]));
  resArray.push(runTest(VTEST, vTestPre + "a unique element that has a non-unique class:", [NON_PLURAL, [[DEF_TAG, tBody]]]));
  /*multi-elems...*/
  console.log("---Subtests for multi-element arrays---");
  resArray.push(runTest(VTEST, vTestPre + "several absent elements:", [NON_PLURAL, [[DEF_TAG, tZero], [DEF_TAG, tMiss]]], true));
  resArray.push(runTest(VTEST, vTestPre + "a combo of absent and present (including plural) elements:", [NON_PLURAL, [[DEF_TAG, tTwo], [DEF_TAG, tMiss], [DEF_TAG, tZero], [DEF_TAG, tOne]]]));
  resArray.push(runTest(VTEST, vTestPre + "several present elements, one being plural:", [NON_PLURAL, [[DEF_TAG, tOne], [DEF_TAG, tTwo]]]));
  resArray.push(runTest(VTEST, vTestPre + "several unique elements:", [NON_PLURAL, [[DEF_TAG, tOne], [DEF_TAG, tUno]]], true));
  resArray.push(runTest(VTEST, vTestPre + "a combo of absent, present and non-specific (multi-tag) elements:", [NON_PLURAL, [[DEF_TAG, tBody], [DEF_TAG, tTwo], [DEF_TAG, tOne], ["body", tBody], [DEF_TAG, tZero], [DEF_TAG, tUno]]], true)); /*The console might log two of these on the same line as repeats.*/

  /*Testing for elements with no constraint (except that for each, there should be no other elements of that class.)*/
  console.log("---Testing testValidity() with FREE as constraint (no constraint)---");
  /*one-elems...*/
  console.log("\n---Subtests for one-element arrays---");
  resArray.push(runTest(VTEST, vTestPre + "an absent element:", [FREE, [[DEF_TAG, tZero]]]));
  resArray.push(runTest(VTEST, vTestPre + "a unique element:", [FREE, [[DEF_TAG, tOne]]], true));
  resArray.push(runTest(VTEST, vTestPre + "a non-unique element:", [FREE, [[DEF_TAG, tTwo]]], true));
  resArray.push(runTest(VTEST, vTestPre + "a unique element that has a non-unique class:", [FREE, [[DEF_TAG, tBody]]]));
  /*multi-elems...*/
  console.log("---Subtests for multi-element arrays---");
  resArray.push(runTest(VTEST, vTestPre + "several absent elements:", [FREE, [[DEF_TAG, tZero], [DEF_TAG, tMiss]]], true));
  resArray.push(runTest(VTEST, vTestPre + "a combo of absent and present elements:", [FREE, [[DEF_TAG, tTwo], [DEF_TAG, tMiss], [DEF_TAG, tZero], [DEF_TAG, tOne]]], true));
  resArray.push(runTest(VTEST, vTestPre + "several present elements:", [FREE, [[DEF_TAG, tOne], [DEF_TAG, tTwo]]], true));
  resArray.push(runTest(VTEST, vTestPre + "several unique elements:", [FREE, [[DEF_TAG, tOne], [DEF_TAG, tUno]]], true));
  resArray.push(runTest(VTEST, vTestPre + "a combo of absent, present and non-specific (multi-tag) elements:", [FREE, [[DEF_TAG, tBody], [DEF_TAG, tTwo], [DEF_TAG, tOne], ["body", tBody], [DEF_TAG, tZero], [DEF_TAG, tUno]]], true)); /*The console might log two of these on the same line as repeats.*/

  /*Return number of passed tests and number of failed tests*/
  return countBools(resArray);
}

/*Function for running all test functions containing test cases for argument validation and element occurence (JQuery selections).
Returns nothing.*/
function runAllTests(){
  /*Test the argument validation tests*/
  let bundleRes = test_testBundle();
  let selRes = test_testSelector();

  /*Test the occurence tests*/
  let valRes = test_testValidity();

  /*Log a summary of the tests.*/
  console.log("Test summary");
  console.log("------------\n\n");
  logTestRes("test_testBundle()", bundleRes[0], bundleRes[1]);
  logTestRes("test_testSelector()", selRes[0], selRes[1]);
  logTestRes("test_testValidity()", valRes[0], valRes[1]);
  logTestRes("all tests", (bundleRes[0] + selRes[0] + valRes[0]), (bundleRes[1] + selRes[1] + valRes[1]));
  console.log("------------\n\n");
  return;
}

/*** Generate additional html for the current site ***/
$(document).ready( () => {

  /**Environments and flow controlling vars**/
  const online = false; /*When the site is put on a webserver, the JS file should be checked to make sure that stuff that needs changing gets changed.*/
  const testing = true; /*Since running tests takes time, this enables tests to be turned off. Having certain tests on in a dev environment and disabled in a live environment seems like a good idea.*/
  let running = true; /*Should stop applying JS if this becomes false.*/
  let readSuccess = true; /*Stop trying to read files when this becomes false. Initially only bother changing this if the banner read fails.*/
  let progress = "any DOM-manipulation";   /*Update this to keep track of where errors occur*/
  let before = true;    /*Tells if an error occured before or after reaching the stage determined by progress.*/


  /**Paths and files for html partials, employees and workplaces**/
  const partPath = "./html/";
  const storyPath = "./Info/";
  const imgPath = "./Temp/";
  const textEnding = ".txt";
  const imgEnding = ".jpg";
  const users = ["alice", "charlie", "espen", "hallstein", "intro"]; /*Should consider reading in the users in some way (possibly by filename)*/
  const workPlaces = ["DREIS", "DagsJobben", "Default"];

  /**Testing the test framework**/
  if(testing){
    if(window.location.pathname.endsWith(partPath.slice(1) + "test.html")){
      runAllTests();
      return;     /*The test framework page has done its job, so the JS code can stop here.*/
    }
  }

  /**Testing uniqueness(non-multiplicity and optionally existence) before DOM manipulation starts**/
  if(testing){
    /*Uniques*/
    const base = ["body", ".base"];
    const banWrap = ["section", ".banner-wrapper"];

    if(!(testValidity(UNIQUE, [base, banWrap]))){
      logProgress(before, progress);
      return;
    }

    /*Non-plurals*/
    const mainWrap = ["section", ".content-wrapper"];
    const topWrap = ["section", ".top-wrapper"];
    const servWrap = ["section", ".service-wrapper"];
    const empWrap = ["section", ".employee-wrapper"];

    if(!(testValidity(NON_PLURAL, [mainWrap, topWrap, servWrap, empWrap]))){
      logProgress(before, progress);
      return;
    }

    /*const illSection = [".illustration", "illustration section"];
    const infoSection = [".info", "info section"];
    const optSection = [".options", "option section"];*/    /*190118: Note that it's relatively likely that this section is deprecated soon.*/
    /*const storySection = [".stories", "story section"];*/   /*190118: Might want to rename the class/description to story-wrapper, excerpt or something similar.*/
    /*const footerSection = [".footer", "wrappers for footer code"];*/    /*190118: It is possible that footers will soon be exclusively made by DOM-manipulation. In that case, a pure existence test should be used instead.*/
    /*Consider if activities should actually be used or merged with services*/
  }


  /**JQuery constants and variables that are used multiple times below.**/
  const $baseBody = $("body.base");
  const $banWrap = $("section.banner-wrapper");
  const $topWrap = $("section.top-wrapper");

  /*const $mainWrap = $("section.content-wrapper");
  const $servWrap = $("section.service-wrapper");
  const $empWrap = $("section.employee-wrapper");*/

  /*const $baseBody = singleSelect(".base", "elements of the base class (only supposed to be used for the body)", true);
  const $storyGrid = singleSelect(".stories", "story grids");
  const $empwindow = singleSelect(".employee-wrapper", "employee windows");
  const $jobwindow = singleSelect(".job-wrapper", "job windows");
  const $homeLink = singleSelect(".home", "home links");
  const $foot = singleSelect(".footer", "footers");*/



  /***Browser compatibility testing (custom properties).***/
  /*The code is more complex than ideal since the css method doesn't specify the format of the return value (it is assumed that the browser does it in  the same way every time, though)*/
  /*Note that non-careful modifications to the test (in its current form) might break the site layout.*/

  /**Testing the absence of a test section.**/
  if(testing){
    if(!(testValidity(ABSENT, [".test"]))){
      logProgress(before, progress);
      return;
    }
  }
  $baseBody.prepend('<section class="test"></section>');
  progress = "browser compatibility test";    /*No need to change the before variable this time*/

  /**Test that the test section was added.**/
  if(testing){
    if(!(testValidity(UNIQUE, [["section", ".test"]]))){
      logProgress(before, progress);
      return;
    }
  }

  let realCol = $(".test").css("background-color");
  let browserCol = $baseBody.css("background-color");
  if(browserCol !== realCol){
    alert("Your browser doesn't support custom properties in the layout. The layout will not look as intended. See https://developer.mozilla.org/en-US/docs/Web/CSS/--*");
  }
  before = false;   /*Test completed*/
  $(".test").remove();

  /*Test that the test section was successfully removed.*/
  if(testing){
    if(!(testValidity(ABSENT, [".test"]))){
      logProgress(before, progress);
      return;
    }
  }


  /*** Create banner ***/
  progress = "adding banner code";
  before = true;

  /*Read banner file.*/
  let bannerCode = readFile(partPath + "banner.html");

  if(bannerCode === null){
    /*If the file reading failed, give an error message alert and disable further file reading.*/
    readSuccess = false;
    before = false;
    if(online){
      alert("Web server file reading error. JS File needs to be changed by site admins."); /*Change file reading code and this message appropriately for online environment.*/
    }
    else{
      alert("Failed to load page banner. This is likely due to browser restrictions on reading local files.");
    }
  }
  else{
    /*Test that the document doesn't contain the class for the banner navbar.*/
    if(testing){
      if(!(testValidity(ABSENT, [".nav-top"]))){
        logProgress(before, progress);
        return;
      }
    }

    /*Add banner code.*/
    $banWrap.append(bannerCode);
    before = false;

    /*Test that the banner code adds the banner nav bar.*/
    if(testing){
      if(!(testValidity(UNIQUE, [["nav", ".nav-top"]]))){
        logProgress(before, progress);
        return;
      }
    }

    let $bnav = $("nav.nav-top");

    $bnav.children().each(function (){
      let target = $(this).attr("href");

      /*Give self-pointing links class unlink (not clickable).*/
      if(typeof target !== typeof undefined){
        if(window.location.pathname.endsWith(target.slice(1))){
          $(this).addClass("unlink");
        }
      }
      else if(testing){
        console.log("Do not add anchors without a href attribute to the banner navbar.");
        logProgress(before, progress);
      }

      /*Nothing more to do until the footer has been added.*/

      /*-Give classes with a footer a contact link. Otherwise, make an unclickable link.-*/
        /*let dest = "#";

        if($foot[0]){
          dest += $foot.attr("id");
        }
        else{
          $(this).addClass("unlink");
        }

        $(this).attr("href", dest);*/
    });
  }

  /*** Create top wrapper (for navigating through dynamic content) ***/
  if(readSuccess && $topWrap.length){
    progress = "adding code to the top wrapper (navigation of dynamic content)";
    before = true;

    /*Read top-wrapper file*/
    let topCode = readFile(partPath + "tops.html");

    if(topCode === null){
      /*If the file reading failed, give an error message alert and disable further file reading.*/
      readSuccess = false;
      before = false;
      if(online){
        alert("Web server file reading error. JS File needs to be changed by site admins."); /*Change file reading code and this message appropriately for online environment.*/
      }
      else{
        alert("Failed to load main content. Unknown cause.");
      }
    }
    else{
      /*Test that the DOM doesn't yet contain the scroll-menu wrapper*/
      if(testing){
        if(!(testValidity(ABSENT, [".scroll-menu"]))){
          logProgress(before, progress);
          return;
        }
      }

      /*Add top-wrapper code*/
      $topWrap.append(topCode);
    }
  }

  return;

  /*** Create content (base content consists of an img section, an info section and a footer). ***/
  if($mainWrap.length){
    /*Read content file*/
    let mainCode = readFile(partPath + "content.html");

    if(mainCode === null){
      /*If the file reading failed, give an error message alert and disable further file reading.*/
      readSuccess = false;
      if(online){
        alert("Web server file reading error. JS File needs to be changed by site admins."); /*Change file reading code and this message appropriately for online environment.*/
      }
      else{
        alert("Failed to load main content. Unknown cause.");
      }
    }
    else{
      /*Test that the DOM doesn't yet contain the elements that are supposed to be in the content code.*/
      if(testing){
        let success = true;
        sections = [".illustration", ".info", ".footer"];
        sections.forEach(function(item) {
          if(!(isAbsent(item))){
            console.log("Occurred before adding content code.");
            success = false;
          }
        });
        if(!success){
          return;
        }
      }

      /*Add content to the content wrapper*/
      $mainWrap.append(mainCode);

      if(testing){
        const illWrap = ["section", ".illustration", true];
        const infoWrap = ["section", ".info", true];
        const foot = ["section", ".footer", true];

        if(!(showUniqueness([illWrap, infoWrap, foot]))){
          console.log("Occurred after adding content code.");
          return;
        }
      }

      /*Read page-specific content file*/

    }
  }

  /*** Story link creation. Might come back in later if the links are used in more places ***/

  /*Read storylink file and append it to the storylink divs*/
  /*if($slinks[0]){
    let linkCode = readFile("./storylink.html");
    $slinks.append(linkCode);

    $slinks.each(function (){
      $(this).find("a").attr("href", $(this).attr("data-src"));
    });

  }*/


  /***Employee story creation for home page***/

  if(readSuccess === true && $storyGrid[0]){
    let empCode = readFile("./empboxes.html");
    let linkCode = readFile("./storylink.html");

    /*Populate the story grid with boxes for each employee story*/
    for(let i = 0; i < users.length - 1; i++){
      $sgrid.append(empCode);
    }

    /*Add storylinks to the boxes*/
    $sgrid.find(".storylink").append(linkCode);

    /*Update paragraphs and signature for each employee box*/
    for(let j = 0; j < users.length - 1; j++ ){
      let $empbox = $(".employee").eq(j);
      let paragraphs = readParas(storyPath + users[j] + textEnding);

      $empbox.find("p.excerpt").append(paragraphs[0]);
      $empbox.find("p.sign").append("-" + capitalizeFirstLetter(users[j]));

      /*Update the address of the storylink*/
      $empbox.find(".storylink").children("a").attr("href", "./ansatte.html?userid=" + j);
    }
  }


  /***Employee story creation and navigation for employee page***/
  if(readSuccess === true && $empwindow[0]){

    /*Find out what user to display based on url attribute*/
    let current = getUserId();
    if(current === null){
      current = users.length - 1; /*Start at intro page*/
    }
    else if (current < 0 || current >= users.length - 1) {
      alert("userid attribute in url is outside the range of valid userids");
      current = users.length - 1;
    }

    /*Fix the links so they direct to the right user. Since JS doesn't have a proper modulo operator,
    this is a little more complex than it would otherwise have to be.*/
    let next = current + 1;
    let prev = current -1;

    if(current === (users.length - 1) || current === (users.length - 2)) {
      next = 0;
    }
    else if(current === 0){
      prev = users.length - 2;
    }
    $(".stealthy").eq(0).attr("href", "./ansatte.html?userid=" + (prev));
    $(".stealthy").eq(1).attr("href", "./ansatte.html?userid=" + (next));

    /*Append employee window code to the employee window*/
    let empWinCode = readFile("./empwindow.html");
    $empwindow.append(empWinCode);

    let paragraphs = readParas(storyPath + users[current] + textEnding);

    /*Add img to the html*/
    $empwindow.children("img").attr("src", imgPath + users[current] + imgEnding);
    $empwindow.children("img").attr("alt", paragraphs[paragraphs.length - 1]);

    /*Add paragraphs to the html code*/
    for(let i=0; i < paragraphs.length - 1; i++){
      if($.trim(paragraphs[i]).length > 0){
        $("<p>" + paragraphs[i] + "</p>").insertBefore($empwindow.children("p.sign"));
      }
    }

    /*Add signature*/
    $empwindow.children("p.sign").append("-" + capitalizeFirstLetter(users[current]));
  }


  /***Workplace creation***/
  if(readSuccess === true && $jobwindow[0]){
    let jobWinCode = readFile("./jobwindow.html");
    $jobwindow.append(jobWinCode);

    let paragraphs = readParas(storyPath + workPlaces[workPlaces.length - 1] + textEnding);

    $(".info").append("<h2>" + paragraphs[0] + "</h2>");

    for(let i=1; i < paragraphs.length - 1; i++){
      $(".info").append("<p>" + paragraphs[i] + "</p>");
    }
  }

  /***Event handling for workplaces***/
  const $wbuttons = $(".scroll-menu").find("a");

  for(let j=0; j < $wbuttons.length; j++){
    $wbuttons.eq(j).on("click", () => {
      /*Make the clicked button the only active one*/
      $wbuttons.removeClass("active");
      $wbuttons.eq(j).addClass("active");

      /*Read workplace content from file*/
      let paragraphs = readParas(storyPath + workPlaces[j] + textEnding);

      /*Remove old info text and add new*/
      $(".info").empty();
      $(".info").append("<h2>" + paragraphs[0] + "</h2>");

      for(let k=1; k < paragraphs.length - 1; k++){
        $(".info").append("<p>" + paragraphs[k] + "</p>");
      }
    });
  }
  /*$wbuttons.each(function (){
    $(this).on("click", () => {
      $wbuttons.removeClass("active");
      $(this).addClass("active");
    });
  });*/

  /***Home link creation***/
  if(readSuccess === true && $homeLink[0]){
    $hlink.append(readFile("./homelink.html"));
  }



  /*** Footer ***/

  if(readSuccess === true && $(".footer")[0]) {
    /*Read footer file and append it to the footer div.*/
    let footerCode = readFile("./footer.html");
    $(".footer").append(footerCode);

    /*Add social media links (initially Facebook)*/
    let fadr = $(".footer").attr("data-fb");
    let $fblink = $(".fb-link");

    if ((typeof fadr !== typeof undefined) && fadr !== false) {
      $fblink.attr("href", fadr);
      $fblink.attr("alt", $(".footer").attr("data-avd") + " på Facebook");
    }
    else{
      $fblink.addClass("usynlig");
    }

    /*Add contact info*/
    const SEPS = " " + readFile("./seps.html");

    $(".adr").append($(".footer").attr("data-adr") + SEPS);
    $(".padr").append($(".footer").attr("data-padr") + SEPS);
    $(".tlf").append($(".footer").attr("data-tel"));
  }

});
