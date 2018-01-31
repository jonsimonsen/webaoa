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
const NO_INPUT = -1      /*Used for testing. Do not include this value in INPUTTYPES.*/
const CLASS = 1;        /*For a string corresponding to a class name.*/
const COMPOSITE = 2;    /*For a combination of class name and a string corresponding to a tag.*/
const INPUTTYPES = [CLASS, COMPOSITE];        /*Allowed values of inputType.*/
const NO_TAG = "h7";    /*Used for testing. Do not include this value in TAGTYPES.*/
const TAGTYPES = ["body", "section"];         /*Allowed tags when testing occurrence.*/
const TESTMAIN = "The function argument";
const TESTSUBPRE = "Subelement ";
const TESTSUBPOST = " of the function argument";

/**Names of functions used for testing**/
const BTEST = "bundleTest";
const STEST = "selectorTest";
const ATEST = "isAbsent";
const PTEST = "isPresent";
const UTEST = "isUnique";
const NPTEST = "isNonPlural";
const TTEST = "isTagSpecific";
const MSGTESTS = [BTEST, STEST];    /*Test functions that return error messages.*/
const ALLTESTS = [BTEST, STEST, ATEST, PTEST, UTEST, NPTEST, TTEST];

/**Errors**/
const ERR_POST = "() error: "
const ERR_BUNDERR = BTEST + ERR_POST;
const ERR_SELERR = STEST + ERR_POST;
const ERR_ABSERR = ATEST + ERR_POST;
const ERR_PRESERR = PTEST + ERR_POST;
const ERR_UNOERR = UTEST + ERR_POST;
const ERR_NPLURERR = NPTEST + ERR_POST;
const ERR_TAGERR = TTEST + ERR_POST;
const ERR_RUNTESTERR = "runTest" + ERR_POST;

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
  let url = window.location.href;
  let start = url.indexOf("?") + 1;

  /*Test that the string contains the separator and that it occurs early enough that there is room for the attribute name and value.*/
  if(start <= 0){
    return null;
  }
  else if(start > url.length - (match.length + 1)){ /*+1 since indices start at 0 while lengths start at 1.*/
    alert("Incorrect url. Wrongly named attribute or no value.");
    return null;
  }

  /*Test that the expected attribute string occurs directly after the separator.*/
  if(!(url.slice(start,(start + match.length)) === match)){
    alert("Incorrect url. Wrongly named attribute.");
    return null;
  }

  let candidate = url.slice(start + match.length);

  /*Test that the value of the attribute is a number. If so, return it.*/

  if(isNaN(candidate)){
    alert("Incorrect url. Either the userid is not a number or the url contains garbage otherwise.");
    return null;
  }
  else{
    return Number(candidate);
  }
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

/*Function for testing that inputArray is an array. Also test that it contains at least minElems items.
arrayText is used for describing the element (assumed array) that is being tested.
Look at the function or returned error message for its value range.
Returns a description of the error. If no error, it returns an empty string.
If any of the arguments to the function does not have the expected type or is outside the value range,
the error message will inform about this.*/
function bundleTest(inputArray, arrayText = TESTMAIN, minElems = 1){
  let fname = BTEST + "()";

  /*Test that the callee has given a valid arrayText.*/
  if(typeof(arrayText) !== "string"){
    return fname + " expects a string as its second argument.";
  }
  else if(arrayText !== TESTMAIN){
    let splitText = arrayText.split(/\d+/);    /*split string on digits*/
    /*Test that the split produces the desired result (two elements from the global consts).*/
    if(splitText.length !== 2){
      return fname + " expects its second (string) argument to contain exactly one numeric part (unless it equals TESTMAIN).";
    }
    else if(splitText[0] !== TESTSUBPRE){
      return fname + " expects its second (string) argument to start with TESTSUBPRE (unless it equals TESTMAIN).";
    }
    else if(splitText[1] !== TESTSUBPOST){
      return fname + " expects its second (string) argument to end with TESTSUBPOST (unless it equals TESTMAIN).";
    }
  }

  /*Test other arguments that the callee might send.*/
  if(typeof(minElems) !== "number" || (!(Number.isInteger(minElems))) || minElems < 1){
    return fname + " expects a positive integer as its third argument."
  }
  if(arguments.length > 3){
    return "Do not pass more than three arguments to " + fname + ".";
  }

  /*Test that the default value of minElems is used when the default value of arrayText is used*/
  if(arrayText === TESTMAIN && minElems !== 1){
    return fname + " expects its third argument to equal 1 when the second argument equals TESTMAIN.";
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
function selectorTest(inputType, inputOne, inputTwo = ""){
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

/*Function for testing if all classes in classArray are absent from the html document.
It logs any error messages to the console.
classArray should be an array of strings where all strings are class names starting with a dot.
Returns true if all classes are absent. It returns false otherwise.
It also returns false if there is something wrong with the argument.*/
function isAbsent(classArray){
  let isMissing = true;                       /*Assume that the argument is correct and its elements are absent until otherwise has been determined.*/
  let errorMsg = bundleTest(classArray);     /*Test the classArray argument*/

  if(errorMsg){
    console.log(ERR_ABSERR + errorMsg);
    return false;
  }

  /*Test the elements of classArray*/
  classArray.forEach(function(className) {
    errorMsg = selectorTest(CLASS, className);
    if(errorMsg){
      isMissing = false;    /*Since a correct classname cannot be determined, isMissing has an unknown value and is assumed to be false.*/
      console.log(ERR_ABSERR + errorMsg);
    }
    else{
      /*Test if the className is actually absent from the document*/
      if($(className).length){
        console.log(ERR_ABSERR + "There exists elements of class " + className + ".");
        isMissing = false;
      }
    }
  });

  return isMissing;
}

/*Function for testing if all elements in selectorArray are present in the html document.
It also tests that only the tag type in selectorArray has the class from selectorArray.
It logs any error messages to the console.
selectorArray should be an array of arrays of strings.
Each subarray of selectorArray should contains a tag first and then a class name (starting with a dot).
Each tag should be one of the tags in TAGTYPES. Each class name should start with a dot.
Returns true if all elements corresponding to tags and classes from the inner arrays are present.
It returns false otherwise.
It also returns false if there is something wrong with the argument.*/
function isPresent(selectorArray){
  let exists = true;    /*Assume that argument is correct and its elements are present until otherwise has been determined.*/
  let errorMsg = bundleTest(selectorArray);    /*Test the selectorArray argument*/

  if(errorMsg){
    console.log(ERR_PRESERR + errorMsg);
    return false;
  }

  let counter = 0;
  /*Test the elements of selectorArray*/
  selectorArray.forEach(function(subArray) {
    /*Test subarray*/
    errorMsg = bundleTest(subArray, "Subelement " + counter + " of the function argument", 2);
    if(errorMsg){
      exists = false;
      console.log(ERR_PRESERR + errorMsg);
    }
    else{
      /*Subarray is fine. Test its elements.*/
      errorMsg = selectorTest(COMPOSITE, subArray[1], subArray[0]);

      if(errorMsg){
        exists = false;
        console.log(ERR_PRESERR + errorMsg);
      }
      else{
        /*Test that an elem matching the tag and classname exists.
        Test that there are not elems of the class that doesn't match the tag.*/
        let $selection = $(subArray[0] + subArray[1]);
        if($selection.length === 0){
          exists = false;
          console.log(ERR_PRESERR + 'Selector "' + subArray[0] + subArray[1] + '" does not exist in the document.');
        }
        else{
          let classCount = $(subArray[1]).length;
          if(classCount < $selection.length){
            exists = false;
            console.log(ERR_PRESERR + "The function suggests that the specified selector has more elements than the number of elements of its class.");
          }
          else if(classCount > $selection.length){
            exists = false;
            console.log(ERR_PRESERR + "There exists " + subArray[1] + " elements that has the wrong html tag.");
          }
        }
      }
    }
    counter++;
  });

  return exists;
}

/*Function for testing if all elements in selectorArray exists exactly once in the html document.
It does this both for tags and classes combined and when ignoring the tags.
It logs any error messages to the console.
selectorArray should be an array of arrays of strings.
Each subarray of selectorArray should contains a tag first and then a class name (starting with a dot).
Each tag should be one of the tags in TAGTYPES. Each class name should start with a dot.
Returns true if all elements corresponding to tags and classes from the inner arrays occur exactly once.
It returns false otherwise.
It also returns false if there is something wrong with the argument.*/
function isUnique(selectorArray){
  let existsOnce = true;    /*Assume that argument is correct and its elements are unique until otherwise has been determined.*/
  let errorMsg = bundleTest(selectorArray);    /*Test the selectorArray argument*/

  if(errorMsg){
    console.log(ERR_UNOERR + errorMsg);
    return false;
  }

  let counter = 0;
  /*Test the elements of selectorArray*/
  selectorArray.forEach(function(subArray) {
    /*Test subarray*/
    errorMsg = bundleTest(subArray, "Subelement " + counter + " of the function argument", 2);
    if(errorMsg){
      existsOnce = false;
      console.log(ERR_UNOERR + errorMsg);
    }
    else{
      /*Subarray is fine. Test its elements.*/
      errorMsg = selectorTest(COMPOSITE, subArray[1], subArray[0]);

      if(errorMsg){
        existsOnce = false;
        console.log(ERR_UNOERR + errorMsg);
      }
      else{
        /*Test that there is exactly one element in the selection. Test that the class of the element does not occur on other tags.*/
        let $selection = $(subArray[0] + subArray[1]);
        if($selection.length === 0){
          existsOnce = false;
          console.log(ERR_UNOERR + 'Selector "' + subArray[0] + subArray[1] + '" does not exist in the document.');
        }
        else if($selection.length > 1){
          existsOnce = false;
          console.log(ERR_UNOERR + 'Selector "' + subArray[0] + subArray[1] + '" is not unique in the document.');
        }
        else{
          let classCount = $(subArray[1]).length;
          if(classCount === 0){
            existsOnce = false;
            console.log(ERR_UNOERR + "The function suggests that the specified selector has more elements than the number of elements of its class.");
          }
          else if(classCount > 1){
            existsOnce = false;
            console.log(ERR_UNOERR + "There exists " + subArray[1] + " elements that has the wrong html tag.");
          }
        }
      }
    }
    counter++;
  });

  return existsOnce;
}

/*Function for testing if all elements in selectorArray occurs at most once in the html document.
It also tests that only the tag type in selectorArray has the class from selectorArray.
It logs any error messages to the console.
A search for antonyms of plural didn't produce a useful description of a set of zero or one items,
so using non-plural in the function name.
selectorArray should be an array of arrays of strings.
Each subarray of selectorArray should contains a tag first and then a class name (starting with a dot).
Each tag should be one of the tags in TAGTYPES. Each class name should start with a dot.
Returns true if all elements corresponding to tags and classes from the inner arrays occur at most once.
It returns false otherwise.
It also returns false if there is something wrong with the argument.*/
function isNonPlural(selectorArray){
  let isNotPlural = true;    /*Assume that argument is correct and its elements does not occur more than once until otherwise has been determined.*/
  let errorMsg = bundleTest(selectorArray);    /*Test the selectorArray argument*/

  if(errorMsg){
    console.log(ERR_NPLURERR + errorMsg);
    return false;
  }

  let counter = 0;
  /*Test the elements of selectorArray*/
  selectorArray.forEach(function(subArray) {
    /*Test subarray*/
    errorMsg = bundleTest(subArray, "Subelement " + counter + " of the function argument", 2);
    if(errorMsg){
      isNotPlural = false;
      console.log(ERR_NPLURERR + errorMsg);
    }
    else{
      /*Subarray is fine. Test its elements.*/
      errorMsg = selectorTest(COMPOSITE, subArray[1], subArray[0]);

      if(errorMsg){
        isNotPlural = false;
        console.log(ERR_NPLURERR + errorMsg);
      }
      else{
        /*Test that there is not more than one element in the selection. Test that the class of the element does not occur on other tags.*/
        let $selection = $(subArray[0] + subArray[1]);

        if($selection.length > 1){
          isNotPlural = false;
          console.log(ERR_NPLURERR + 'Selector "' + subArray[0] + subArray[1] + '" occurs multiple times in the document.');
        }
        else{
          let classCount = $(subArray[1]).length;
          if(classCount < $selection.length){
            isNotPlural = false;
            console.log(ERR_NPLURERR + "The function suggests that the specified selector has more elements than the number of elements of its class.");
          }
          else if(classCount > $selection.length){
            isNotPlural = false;
            console.log(ERR_NPLURERR + "There exists " + subArray[1] + " elements that has the wrong html tag.");
          }
        }
      }
    }
    counter++;
  });

  return isNotPlural;
}

/*Function for testing all elements in selectorArray.
It tests that only the tag type in selectorArray has the class from selectorArray.
It logs any error messages to the console.
selectorArray should be an array of arrays of strings.
Each subarray of selectorArray should contains a tag first and then a class name (starting with a dot).
Each tag should be one of the tags in TAGTYPES. Each class name should start with a dot.
Returns true if no element having a classname from an inner array exists that does not have the tag from that array.
It returns false otherwise.
It also returns false if there is something wrong with the argument.*/
function isTagSpecific(selectorArray){
  let isSpecific = true;    /*Assume that argument is correct and none of its elements shares their class with other tags.*/
  let errorMsg = bundleTest(selectorArray);    /*Test the selectorArray argument*/

  if(errorMsg){
    console.log(ERR_TAGERR + errorMsg);
    return false;
  }

  let counter = 0;
  /*Test the elements of selectorArray*/
  selectorArray.forEach(function(subArray) {
    /*Test subarray*/
    errorMsg = bundleTest(subArray, "Subelement " + counter + " of the function argument", 2);
    if(errorMsg){
      isSpecific = false;
      console.log(ERR_TAGERR + errorMsg);
    }
    else{
      /*Subarray is fine. Test its elements.*/
      errorMsg = selectorTest(COMPOSITE, subArray[1], subArray[0]);

      if(errorMsg){
        isSpecific = false;
        console.log(ERR_TAGERR + errorMsg);
      }
      else{
        /*Test that there is exactly one element in the selection. Test that the class of the element does not occur on other tags.*/
        let tagCount = ($(subArray[0] + subArray[1])).length;
        let classCount = ($(subArray[1])).length;

        if(classCount < tagCount){
          isSpecific = false;
          console.log(ERR_TAGERR + "The function suggests that the specified selector has more elements than the number of elements of its class.");
        }
        else if(classCount > tagCount){
          isSpecific = false;
          console.log(ERR_TAGERR + "There exists " + subArray[1] + " elements that has the wrong html tag.");
        }
      }
    }
    counter++;
  });

  return isSpecific;
}

/*Function that acts as a helper for the functions that test the functions in ALLTESTS.
fName is a string corresponding to a function in ALLTESTS.
Description should describe the kind of input to fName() that is given (focused on its flaws if any).
argArray is an array containing every argument to be passed to fName().
It logs the given description and the output from fName().
If the returned output suggests the same as passExpected, it logs "pass".
Otherwise, it logs "fail". Finally, it logs a newline to signify the end of this logging.
Returns nothing.*/
function runTest(fName, description, argArray, passExpected = false){
  /*Test that the given fName is a function name in the global const ALLTESTS.*/
  if(!(ALLTESTS.includes(fName))){
    console.log(ERR_RUNTESTERR + fName + " is not in the ALLTESTS array.");
    return;
  }

  /*Test that the final element is a boolean*/
  if(typeof(passExpected) !== "boolean"){
    console.log(ERR_RUNTESTERR + "Its fourth argument should be a boolean.");
  }

  /*Determine if the output of fName is expected to have a truthy or falsey value.*/
  let expOutput = passExpected;
  if(MSGTESTS.includes(fName)){
    expOutput = !passExpected;    /*An empty string evaluates to false, but returning an empty string signifies that there were no errors (it passed).*/
  }

  /*Log the description*/
  console.log(description);

  /*Call output with the arguments provided in argArray and log the result*/
  let output = window[fName].apply(null, argArray);
  console.log("Yields: " + output);

  /*Log the result of this test*/
  if((expOutput && output) || (!expOutput && !output)){
    console.log("   -pass");
  }
  else{
    console.log("   -fail");
  }

  /*Make a newline to separate from the next test or other console messages*/
  console.log("");
}

/*Function for testing the bundleTest() function.
Runs a number of tests on different kinds of input.
Covers most kinds of input that should cause error messages along with some that shouldn't.
Logs test output to the console. Returns nothing.*/
function test_bundleTest(){
  const bTestPre = "When giving bundleTest() ";
  const mString = "The function argument";
  const aString = "Subelement 123 of the function argument";
  const tArray = ["test"];

  /*Testing bundleTest()*/
  console.log("---Testing bundleTest() expecting error messages.---");
  /*Second arg*/
  runTest(BTEST, bTestPre + "a non-string as its second argument:", [tArray, tArray]);
  runTest(BTEST, bTestPre + "a non-numeric string that doesn't equal TESTMAIN:", [tArray, "Subelement of the function argument"]);
  runTest(BTEST, bTestPre + "a string that starts with a numeric value:", [tArray, "1" + aString]);
  runTest(BTEST, bTestPre + "a string that ends with a numeric value:", [tArray, aString + "1"]);
  runTest(BTEST, bTestPre + "a string containing more than one numeric value:", [tArray, "Subelement 123 of the function456 argument"]);
  runTest(BTEST, bTestPre + "a string that doesn't start with TESTSUBPRE", [tArray, "Subelement123 of the function argument"]);
  runTest(BTEST, bTestPre + "a string that doesn't end with TESTSUBPOST", [tArray, "Subelement 123of the function argument"]);
  /*Third arg*/
  runTest(BTEST, bTestPre + "a non-number as its third argument:", [tArray, aString, "1"]);
  runTest(BTEST, bTestPre + "an array of numbers as its third argument:", [tArray, aString, [1]]);
  runTest(BTEST, bTestPre + "a float as its third argument:", [tArray, aString, 3.14]);
  runTest(BTEST, bTestPre + "zero as its third argument:", [tArray, aString, 0]);
  runTest(BTEST, bTestPre + "a negative number as its third argument:", [tArray, aString, -1]);
  /*Combinations*/
  runTest(BTEST, bTestPre + "more than three arguments:", [tArray, aString, 1, ""]);
  runTest(BTEST, bTestPre + "TESTMAIN combined with more than 1 minElems", [tArray, mString, 2]);
  /*First arg*/
  runTest(BTEST, bTestPre + "a non-array as its first argument:", ["test"]);
  runTest(BTEST, bTestPre + "an empty array as its first argument:", [[]]);
  runTest(BTEST, bTestPre + "an array with fewer than minElems elements as its first argument:", [tArray, aString, 2]);

  /*Arg combos that are supposed to be valid (returning an empty string)*/
  console.log("---Testing bundleTest() expecting no error message.---");
  runTest(BTEST, bTestPre + "a string that equals TESTMAIN", [tArray, mString], true);
  runTest(BTEST, bTestPre + "a string that fits the regex matching:", [tArray, aString], true);
  runTest(BTEST, bTestPre + "a positive integer as its third argument:", [tArray, aString, 1], true);
  runTest(BTEST, bTestPre + "an integer above 1 as its third argument:", [["test", "test"], aString, 2], true);

  return;
}

/*Function for testing the selectorTest() function.
Runs a number of tests on different kinds of input.
Covers most kinds of input that should cause error messages along with some that shouldn't.
Logs test output to the console. Returns nothing.*/
function test_selectorTest(){
  const sTestPre = "When giving selectorTest() ";
  const tString = "test";

  /*Testing selectorTest()*/
  console.log("---Testing selectorTest() expecting error messages.---");
  runTest(STEST, sTestPre + "a negative (non-allowed) inputType:", [NO_INPUT, tString]);
  runTest(STEST, sTestPre + "more than three arguments:", [CLASS, tString, tString, tString]);
  runTest(STEST, sTestPre + "three arguments with the first being CLASS:", [CLASS, tString, tString]);
  runTest(STEST, sTestPre + "two arguments with the first being COMPOSITE:", [COMPOSITE, tString]);
  runTest(STEST, sTestPre + "a third argument that is not in the TAGTYPES list:", [COMPOSITE, tString, NO_TAG]);
  runTest(STEST, sTestPre + "a second element that is not a string:", [CLASS, 123]);
  runTest(STEST, sTestPre + "a second element that is an array:", [CLASS, [tString]]);
  runTest(STEST, sTestPre + "a second element that does not start with a dot:", [CLASS, tString]);

  /*Arg combos that are supposed to be valid (returning an empty string)*/
  console.log("---Testing selectorTest() expecting no error message.---");
  runTest(STEST, sTestPre + "CLASS followed by a classname:", [CLASS, ".test"], true);
  runTest(STEST, sTestPre + "COMPOSITE followed by a classname followed by a tag from TAGTYPES:", [COMPOSITE, ".test", "section"], true);

  return;
}

/*Function for testing the isAbsent() function.
Runs a number of tests on different kinds of input.
Covers most kinds of input that should cause error messages along with some that shouldn't.
Logs test output to the console. Returns nothing.*/
function test_isAbsent(){
  const aTestPre = "When giving isAbsent() ";

  /*Testing isAbsent()*/
  console.log("---Testing isAbsent() expecting error messages from bundleTest() or selectorTest().---");
  runTest(ATEST, aTestPre + "a non-array argument:", ["test"]);
  runTest(ATEST, aTestPre + "an empty array:", [[]]);
  runTest(ATEST, aTestPre + "an array with a non-string subelement:", [[123]]);
  runTest(ATEST, aTestPre + "an array with an array subelement:", [[["test"]]]);
  runTest(ATEST, aTestPre + "an array with an incorrectly named string:", [["test"]]);

  console.log("---Testing isAbsent() with different classes.---");
  runTest(ATEST, aTestPre + "an absent element:", [[".test-zero"]], true);
  runTest(ATEST, aTestPre + "a unique element:", [[".test-one"]]);
  runTest(ATEST, aTestPre + "a non-unique element", [[".test-two"]]);

  console.log("---Testing isAbsent() with several elements.---");
  runTest(ATEST, aTestPre + "several absent elements:", [[".test-zero", ".test-missing"]], true);
  runTest(ATEST, aTestPre + "a combo of absent and present elements:", [[".test-two", ".test-missing", ".test-zero", ".test-one"]]);
  runTest(ATEST, aTestPre + "several present elements:", [[".test-one", ".test-two"]]);
}

/*Function for testing the isPresent() function.
Runs a number of tests on different kinds of input.
Covers most kinds of input that should cause error messages along with some that shouldn't.
Logs test output to the console. Returns nothing.*/
function test_isPresent(){
  const pTestPre = "When giving isPresent() ";

  /*Testing isPresent()*/
  console.log("---Testing isPresent() expecting error messages from bundleTest() or selectorTest().---");
  runTest(PTEST, pTestPre + "a non-array argument:", ["test"]);
  runTest(PTEST, pTestPre + "an empty array:", [[]]);
  runTest(PTEST, pTestPre + "an array with a non-array subelement:", [["test"]]);
  runTest(PTEST, pTestPre + "an array with an empty array as a subelement:", [[[]]]);
  runTest(PTEST, pTestPre + "an array with an array of one element as a subelement:", [[["test"]]]);
  runTest(PTEST, pTestPre + "an array with an array where the first element is not a valid tag as a subelement:", [[[NO_TAG, "test"]]]);
  runTest(PTEST, pTestPre + "an array with an array where the second element is not a string as a subelement:", [[["section", 123]]]);
  runTest(PTEST, pTestPre + "an array with an array where the second element is an array as a subelement:", [[["section", ["test"]]]]);
  runTest(PTEST, pTestPre + "an array with an array where the second element is not starting with a dot as a subelement:", [[["section", "test"]]]);

  console.log("---Testing isPresent() with different classes.---");
  runTest(PTEST, pTestPre + "an absent element:", [[["section", ".test-zero"]]]);
  runTest(PTEST, pTestPre + "a unique element:", [[["section", ".test-one"]]], true);
  runTest(PTEST, pTestPre + "a non-unique element:", [[["section", ".test-two"]]], true);
  runTest(PTEST, pTestPre + "a unique element that has a non-unique class:", [[["section", ".test-body"]]]);

  console.log("---Testing isPresent() with several elements.---");
  runTest(PTEST, pTestPre + "several absent elements:", [[["section", ".test-zero"], ["section", ".test-missing"]]]);
  runTest(PTEST, pTestPre + "a combo of absent and present elements:", [[["section", ".test-two"], ["section", ".test-missing"], ["section", ".test-zero"], ["section", ".test-one"]]]);
  runTest(PTEST, pTestPre + "several present elements:", [[["section", ".test-one"], ["section", ".test-two"]]], true);
  runTest(PTEST, pTestPre + "a combo of absent, present and non-specific (multi-tag) elements:", [[["section", ".test-body"], ["section", ".test-two"], ["body", ".test-body"], ["section", ".test-zero"]]]); /*The console might log two of these on the same line as repeats.*/
}

/*Function for testing the isUnique() function.
Runs a number of tests on different kinds of input.
Covers most kinds of input that should cause error messages along with some that shouldn't.
Since the bundleTest() and selectorTest() errors should be the same as for isPresent(),
these will not be tested here.
Logs test output to the console. Returns nothing.*/
function test_isUnique(){
  const uTestPre = "When giving isUnique() ";

  /*Testing isUnique()*/
  console.log("---Testing isUnique() with different classes.---");
  runTest(UTEST, uTestPre + "an absent element:", [[["section", ".test-zero"]]]);
  runTest(UTEST, uTestPre + "a unique element:", [[["section", ".test-one"]]], true);
  runTest(UTEST, uTestPre + "a non-unique element:", [[["section", ".test-two"]]]);
  runTest(UTEST, uTestPre + "a unique element that has a non-unique class:", [[["section", ".test-body"]]]);

  console.log("---Testing isUnique() with several elements.---");
  runTest(UTEST, uTestPre + "several absent elements:", [[["section", ".test-zero"], ["section", ".test-missing"]]]);
  runTest(UTEST, uTestPre + "a combo of absent and present elements:", [[["section", ".test-two"], ["section", ".test-missing"], ["section", ".test-zero"], ["section", ".test-one"]]]);
  runTest(UTEST, uTestPre + "several present elements, one being unique:", [[["section", ".test-one"], ["section", ".test-two"]]]);
  runTest(UTEST, uTestPre + "several unique elements:", [[["section", ".test-one"], ["section", ".test-unique"]]], true);
  runTest(UTEST, uTestPre + "a combo of absent, present and non-specific (multi-tag) elements:", [[["section", ".test-body"], ["section", ".test-two"], ["section", ".test-one"], ["body", ".test-body"], ["section", ".test-zero"], ["section", ".test-unique"]]]); /*The console might log two of these on the same line as repeats.*/
}

/*Function for testing the isNonPlural() function.
Runs a number of tests on different kinds of input.
Covers most kinds of input that should cause error messages along with some that shouldn't.
Since the bundleTest() and selectorTest() errors should be the same as for isPresent(),
these will not be tested here.
Logs test output to the console. Returns nothing.*/
function test_isNonPlural(){
  const npTestPre = "When giving isNonPlural() ";

  /*Testing isUnique()*/
  console.log("---Testing isNonPlural() with different classes.---");
  runTest(NPTEST, npTestPre + "an absent element:", [[["section", ".test-zero"]]], true);
  runTest(NPTEST, npTestPre + "a unique element:", [[["section", ".test-one"]]], true);
  runTest(NPTEST, npTestPre + "a non-unique element:", [[["section", ".test-two"]]]);
  runTest(NPTEST, npTestPre + "a unique element that has a non-unique class:", [[["section", ".test-body"]]]);

  console.log("---Testing isNonPlural() with several elements.---");
  runTest(NPTEST, npTestPre + "several absent elements:", [[["section", ".test-zero"], ["section", ".test-missing"]]], true);
  runTest(NPTEST, npTestPre + "a combo of absent and present (including plural) elements:", [[["section", ".test-two"], ["section", ".test-missing"], ["section", ".test-zero"], ["section", ".test-one"]]]);
  runTest(NPTEST, npTestPre + "several present elements, one being plural:", [[["section", ".test-one"], ["section", ".test-two"]]]);
  runTest(NPTEST, npTestPre + "several unique elements:", [[["section", ".test-one"], ["section", ".test-unique"]]], true);
  runTest(NPTEST, npTestPre + "a combo of absent, present and non-specific (multi-tag) elements:", [[["section", ".test-body"], ["section", ".test-two"], ["section", ".test-one"], ["body", ".test-body"], ["section", ".test-zero"], ["section", ".test-unique"]]]); /*The console might log two of these on the same line as repeats.*/
}

/*Function for testing the isTagSpecific() function.
Runs a number of tests on different kinds of input.
Covers most kinds of input that should cause error messages along with some that shouldn't.
Since the bundleTest() and selectorTest() errors should be the same as for isPresent(),
these will not be tested here.
Logs test output to the console. Returns nothing.*/
function test_isTagSpecific(){
  const tTestPre = "When giving isTagSpecific() ";

  /*Testing isTagSpecific()*/
  console.log("---Testing isTagSpecific() with different classes.---");
  runTest(TTEST, tTestPre + "an absent element:", [[["section", ".test-zero"]]], true);
  runTest(TTEST, tTestPre + "a unique element:", [[["section", ".test-one"]]], true);
  runTest(TTEST, tTestPre + "a non-unique element:", [[["section", ".test-two"]]], true);
  runTest(TTEST, tTestPre + "a unique element that has a non-unique class:", [[["section", ".test-body"]]]);

  console.log("---Testing isTagSpecific() with several elements.---");
  runTest(TTEST, tTestPre + "several absent elements:", [[["section", ".test-zero"], ["section", ".test-missing"]]], true);
  runTest(TTEST, tTestPre + "a combo of absent and present elements:", [[["section", ".test-two"], ["section", ".test-missing"], ["section", ".test-zero"], ["section", ".test-one"]]], true);
  runTest(TTEST, tTestPre + "several present elements, one being unique:", [[["section", ".test-one"], ["section", ".test-two"]]], true);
  runTest(TTEST, tTestPre + "several unique elements:", [[["section", ".test-one"], ["section", ".test-unique"]]], true);
  runTest(TTEST, tTestPre + "a combo of absent, present and non-specific (multi-tag) elements:", [[["section", ".test-body"], ["section", ".test-two"], ["section", ".test-one"], ["body", ".test-body"], ["section", ".test-zero"], ["section", ".test-unique"]]]); /*The console might log two of these on the same line as repeats.*/
}

/*Function for running all test functions containing test cases for argument validation and element occurence (JQuery selections).
Returns nothing.*/
function runAllTests(){
  /*Test the argument validation tests*/
  test_bundleTest();
  test_selectorTest();

  /*Test the occurence tests*/
  test_isAbsent();
  test_isPresent();
  test_isUnique();
  test_isNonPlural();
  test_isTagSpecific();

  /*Indicate that all tests have been run.
  Could consider logging number of failed tests too.*/
  console.log("---All tests are finished---\n\n");
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
    }
  }

  /**Testing uniqueness(non-multiplicity and optionally existence) before DOM manipulation starts**/
  if(testing){
    /*Uniques*/
    const base = ["body", ".base", true];
    const banWrap = ["section", ".banner-wrapper", true];

    if(!(isUnique([base, banWrap]))){
      logProgress(before, progress);
      return;
    }


    /*Non-plurals*/
    const mainWrap = ["section", ".content-wrapper"];
    const topWrap = ["section", ".top-wrapper"];
    const servWrap = ["section", ".service-wrapper"];
    const empWrap = ["section", ".employee-wrapper"];

    if(!(isNonPlural([mainWrap, topWrap, servWrap, empWrap]))){
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
  $baseBody.prepend('<div class="test"></div>');
  let realCol = $baseBody.children().first().css("background-color");
  let browserCol = $baseBody.css("background-color");
  if(browserCol !== realCol){
    alert("Your browser doesn't support custom properties in the layout. The layout will not look as intended. See https://developer.mozilla.org/en-US/docs/Web/CSS/--*");
  }
  $baseBody.children().first().remove();




  /*** Create banner ***/

  /*Read banner file.*/
  let bannerCode = readFile(partPath + "banner.html");

  if(bannerCode === null){
    /*If the file reading failed, give an error message alert and disable further file reading.*/
    readSuccess = false;
    if(online){
      alert("Web server file reading error. JS File needs to be changed by site admins."); /*Change file reading code and this message appropriately for online environment.*/
    }
    else{
      alert("Failed to load page banner. This is likely due to browser restrictions on reading local files.");
    }
  }
  else{
    /*Test that the initial DOM doesn't contain the class for the banner navbar.*/
    if(testing){
      if(!(isAbsent(".nav-top"))){
        console.log("Occurred before adding banner code.");
        return;
      }
    }

    /*Add banner code.*/
    $banWrap.append(bannerCode);

    /*Test that the banner code adds the banner nav bar.*/
    if(testing){
      if(!(showUniqueness([["nav", ".nav-top", true]]))){
        console.log("Occurred after adding banner code.");
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
      /*-Give classes with a footer a contact link. Otherwise, make an unclickable link.-*/
      else if(testing){
        console.log("Check that the nav-top in banner.html does not contain links without the href attribute.");
        console.log("Occurred while processing banner code.")
        return;
        /*let dest = "#";

        if($foot[0]){
          dest += $foot.attr("id");
        }
        else{
          $(this).addClass("unlink");
        }

        $(this).attr("href", dest);*/
      }
    });
  }

  /*** Create top wrapper (for navigating through dynamic content) ***/
  if($topWrap.length){
    /*Read top-wrapper file*/
    let topCode = readFile(partPath + "tops.html");

    if(topCode === null){
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
      /*Test that the DOM doesn't yet contain the scroll-menu wrapper*/
      if(testing){
        if(!(isAbsent(".scroll-menu"))){
          console.log("Occurred before adding top-wrapper code.")
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
