/*** Main JS file for the website of "Arbeid og Aktivitet, Tromsø" (by Jon Simonsen). ***/

/**Since importing seems to be a new feature in JS (perhaps not well supported yet),
all used functions will be included in this file.
Three star comments with newlines start a new section.
Three star comments without newlines starts a major subsection.
Two star comments are for minor subsections or important information.
More trivial comments use one star.**/

/*Sections (130218):
-Introductory comment section
-Global constants
-Global variables
-Functions by others
-Functions by me
-html generation (when document is ready)*/


/*** Global consts ***/

/**Environments**/
const ONLINE = false;   /*When the site is put on a webserver, the JS file should be checked to make sure that stuff that needs changing gets changed.*/
const TESTING = true;   /*Since running tests takes time, this enables tests to be turned off. Having certain tests on in a dev environment and disabled in a live environment seems like a good idea.*/

/**Pages**/
const HOMEPAGE = "index.html";
const JOBPAGE = "arbeid.html";
const EMPPAGE = "ansatte.html";
const ACTPAGE = "aktiv.html";
const TESTPAGE = "test.html";
const ALLPAGES = [HOMEPAGE, JOBPAGE, EMPPAGE, ACTPAGE, TESTPAGE];

/**Paths and files for pictures, html partials and textfile info**/
const PART_PATH = "./html/";
const INFO_PATH = "./Info/";
const IMG_PATH = "./Bilder/";
const PART_END = ".html"
const TXT_END = ".txt";
const IMG_END = ".jpg";

/**Employees, activities and workplaces**/
const EMPS = ["alice", "charlie", "espen", "hallstein", "intro"]; /*Should consider reading in the users in some way (possibly by filename)*/
const DREIS = ["dreis/", "almehaven", "kurskonf", "bilservice", "produksjon", "serviceavd", "admin"];
const DJOB = ["djob/", "djob"];
const ACTIVITIES = ["akts/", "værftet", "tindfoten", "gimle", "kvaløya", "dagsenter"];
const JOBS = ["DREIS", "DagsJobben", "Jobs"];
const SERVICES = [DREIS, DJOB, ACTIVITIES];   /*Except for the last item, these should correspond to the item with the same index in JOBS.*/

/**Input types (used in testSelector to differentiate between differently formatted input).**/
const BAD_INPUT = -1      /*Used for testing. Do not include this value in INPUTTYPES.*/
const CLASS = 1;        /*For a string corresponding to a class name.*/
const COMPOSITE = 2;    /*For a combination of class name and a string corresponding to a tag.*/
const INPUTTYPES = [CLASS, COMPOSITE];        /*Allowed values of inputType.*/

/**Tag types. Controls what kind of tags are allowed for elements that are tested for occurrence in the html document.**/
const DEF_TAG = "section";    /*Default tag when testing. Should be in TAGTYPES and fit in there.*/
const TAGTYPES = [DEF_TAG, "body", "nav", "div"];    /*Allowed tags when testing occurrence.*/

/**Default garbage of different types**/
const BAD_TAG = "h7";       /*Used for testing. Do not include this value in TAGTYPES.*/
const BAD_SSTR = ".test";   /*Assuming that the test document does not use this class in its html.*/
const BAD_STR = "test";     /*Not correctly formatted for a classname string*/
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

/**Error message partials for identifying where an error occurred.**/
const ERR_POST = "() error: "
const ERR_BUNDERR = BTEST + ERR_POST;
const ERR_SELERR = STEST + ERR_POST;
const ERR_VALIDERR = VTEST + ERR_POST;
const ERR_RUNTESTERR = "runTest" + ERR_POST;
const BUGALERT_POST = " Site admins have to update JS code.";

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


/*** Global variables (variables that needs to be accessible from several functions) ***/
let progress = "any DOM-manipulation";    /*Update this to keep track of where errors occur*/
let before = true;    /*Tells if an error occured before or after reaching the stage determined by progress.*/
let readSuccess = true; /*Stop trying to read files when this becomes false.*/


/*** Functions made by others ***/

/**Function for reading a file (Should use a different one/load when going live)**/
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

/**Function for capitalizing a string (Make the first letter uppercase)**/
/*https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
*/
function capitalizeFirstLetter(string){
  return string.charAt(0).toUpperCase() + string.slice(1);
}


/*** Functions made by Jon Simonsen ***/

/**Function that processes a path (url with no attributes).
It returns the name of the associated file (ending with .html)
if that file is an element in ALLPAGES.
It returns an empty string if the associated file was not found.
Be aware that it assumes that it does not matter where the file is located
(it ignores the folders in the url).
**/
function findPageName(path){
  for(let i=0 ; i < ALLPAGES.length ; i++){
    if(path.endsWith("/" + ALLPAGES[i])){
      return ALLPAGES[i];
    }
  }

  /*If the page was not found, return an empty string*/
  return "";
}

/**Function for reading a file and returning an array of paragraphs
using double newlines as separators.
Note that the function currently assumes that XMLHttpRequest interprets a newline as "\r\n".
If the file reading failed, the function returns null.**/
function readParas(file){
  fileStr = readFile(file);
  if(fileStr === null){
    return null;
  }
  else{
    return fileStr.split("\r\n\r\n");
  }
}

/**Function for giving an alert if local file reading was used in an online environment.
When the current file reading gets disabled,
the alert should instead be about a failed load (if this function is kept around).
**/
function webReadAlert(){
  /*Change file reading code and this message appropriately for online environment.*/
  alert("Web server file reading error." + BUGALERT_POST);
  return;
}

/**Function for extracting userid from url. Returns null if the url has no attributes.
Returns null and displays an alert if there's something wrong with the attribute.
Otherwise, the value of the attribute (as a number) is returned.
Attributes other than userid is not allowed.
Could have more detailed error checks and messages.**/
/*For more advanced url extraction, check out
https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
*/
function getUserId(){
  let match = "userid=";
  let errPrefix = "Incorrect url. ";
  let url = window.location.href;
  let start = url.indexOf("?") + 1;

  /*Test that the string contains the separator and that it occurs early enough that there is room for the attribute name and value.*/
  if(start <= 0){
    alert(errPrefix + "It contains no attribute.")
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

  /*Test if the value of the candidate is a number.*/
  if(isNaN(candidate)){
    alert(errPrefix + "Either the userid is not a number or the url contains garbage otherwise.");
    return null;
  }
  else{
    return Number(candidate);   /*Return the candidate as a number*/
  }
}

/**Function for counting number of true and false values in an array.
The function might work on other arguments than arrays,
but its behavior is undefined for such arguments.
boolArray is assumed to be an array of booleans.
The function counts the number of values that equals true.
It assumes that all other values are false.
It returns an array with the number of true as the first element
and the number of false as the second element.**/
function countBools(boolArray){
  let passes = (boolArray.filter(val => val === true)).length;
  let fails = boolArray.length - passes;
  return [passes, fails];
}

/**Function for logging the DOM-manipulation progress to the console.
Uses values from the global variables before and progress in the logging.
before should be a boolean telling if the message is logged before(true) or after(false) the step.
progress should be a string saying what step was just finished or is just starting.
If it is called incorrectly or the globals are undefined or have an unexpected type,
this is logged instead. It returns nothing.**/
function logProgress(){
  let errPre = "logProgress" + ERR_POST;
  /*Test arguments*/
  if(arguments.length > 0){
    console.log(errPre + "The function expects no arguments.");
    return;
  }
  if(typeof(before) !== "boolean"){
    console.log(errPre + 'The variable "before" should be a (global) bool.');
    return;
  }
  if(typeof(progress) !== "string"){
    console.log(errPre + 'The variable "progress" should be a (global) string.');
    return;
  }

  /*Construct progress message*/
  let timing = "";

  if(before){
    timing = "-Before ";
  }
  else{
    timing = "-After ";
  }

  console.log(timing + progress);
  return;
}

/**Function that logs a description of a test, then number of passes,
then number of fails followed by an empty line. Returns nothing.**/
function logTestRes(description, passes, fails){
  console.log("For " + description + ":");
  console.log("\t" + passes + " passes");
  console.log("\t" + fails + " fails\n\n");
  return;
}

/**Function for testing that inputArray is an array.
It also test that it contains at least minElems items.
arrayText is used for describing the element (assumed array) that is being tested.
Look at the function or returned error message for its value range.
Returns a description of the error. If no error, it returns an empty string.
If any of the arguments to the function does not have the expected type
or is outside the value range,
the returned error message will inform about this.**/
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

/**Function for testing inputs according to inputType.
All legal inputTypes should be members of a global INPUTTYPES array.
inputOne should be a string corresponding to a classname (starting with a dot).
inputTwo should be a string containing an html tag (without the "<" and ">" chars)
that is expected to be a member of a global TAGTYPES array.
Returns an error message if an error was found or an empty string otherwise.**/
function testSelector(inputType, inputOne, inputTwo = ""){
  /*Test that the inputType has an expected value*/
  if(!(INPUTTYPES.includes(inputType))){
    return ERR_SELERR + "The inputType argument must be equal to an element in the global const Array INPUTTYPES.";
  }

  /*Test that the callee doesn't give too many arguments*/
  if(arguments.length > 3){
    return ERR_SELERR + "Do not pass more than three arguments."
  }

  /*Test that inputTwo has an expected value for the given inputType
  and that the inputType is actually included in this function.*/
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
    return ERR_SELERR + "The inputTypes are not processed correctly." + BUGALERT_POST;
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

/**Function for testing if the occurence of all elements are as specified by constraint.
If constraint is not included in CONSTRAINTS, this counts as a format error.
The function also tests that the selectorArray is formatted according to constraint.
ABSENT expects an array of strings (class names, each starting with a dot).
The other constraint types expect an array of arrays of two strings
(the first being a tag and the second being a class name).
Each tag should be one of the tags in TAGTYPES.
No element with other tag types should have the same class as any of those tags
(counts as an occurence error).

If the format is broken, a message for the first error is logged to the console.
The function might or might not log further errors.
Otherwise (constraint broken or tag restriction on classes broken),
messages for all encountered errors are logged.
Returns true if the constraints are met and no format errors occurred.
Returns false otherwise.**/
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

/**Function that acts as a helper.
It will run test cases on functions corresponding to the names in ALLTESTS.
fName is a string that should match a function name in ALLTESTS.
description should describe the kind of input to fName() that is given
(focused on its flaws if any).
argArray is an array containing every argument to be passed to fName().
passExpected is a boolean that tells if the test case is expected to pass.
The function logs the given description and the output from fName().
If this output suggests the same as passExpected, it logs "pass".
Otherwise, it logs "fail".
In both cases, it logs a newline to signify the end of this logging.
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
    and a non-empty string on failing. Therefore, the truth value has to be swapped.*/
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

/**Function for testing the testBundle() function.
Runs a number of test cases with different kinds of input.
Covers most kinds of input that should cause error messages along with some that shouldn't.
Logs test output to the console.
Returns a bool array containing number of passed tests followed by number of failed tests.
**/
function test_testBundle(){
  const bTestPre = "When giving testBundle() ";
  const aString = TESTSUBPRE + BAD_INT + TESTSUBPOST;
  let resArray = [];    /*Array used for logging the number of successful and failed tests*/

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

/**Function for testing the testSelector() function.
Runs a number of tests on different kinds of input.
Covers most kinds of input that should cause error messages along with some that shouldn't.
Logs test output to the console.
Returns a bool array containing number of passed tests followed by number of failed tests.
**/
function test_testSelector(){
  const sTestPre = "When giving testSelector() ";
  let resArray = [];    /*Array used for logging the number of successful and failed tests*/

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

/**Function for testing the testValidity() function.
Runs a number of tests on different kinds of input.
Covers most kinds of input that should cause error messages along with some that shouldn't.
Logs test output to the console.
Returns a bool array containing number of passed tests followed by number of failed tests.
**/
function test_testValidity(){
  const vTestPre = "When giving testValidity() ";
  const tZero = ".test-zero";
  const tOne = ".test-one";
  const tTwo = ".test-two";
  const tMiss = ".test-missing";
  const tUno = ".test-unique";
  const tBody = ".test-body";
  let resArray = [];    /*Array used for logging the number of successful and failed tests*/

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

/**Function for running all test case functions
(test cases for argument validation and element occurence on selections).
Returns nothing.**/
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

/**Function for reading main content and applying it to the document.
Can be used during page loading or in response to events.
Returns true if the reading and updating proceeded as expected.
Returns true but sets readSuccess to false if a file read failed.
Returns false otherwise.**/
function readContent(fName){
  let errPre = "readContent" + ERR_POST;

  /*Make variables for frequently used selections.
  It's the job of the callee to ensure that the selections are unique.*/
  let $illWrap = $(".illustration");
  let $textWrap = $(".ill-text");
  let $linkWrap = $(".ill-link");
  let $infoWrap = $(".info");
  let $foot = $(".footer");

  /*Read all paragraphs from the content file*/
  let paragraphs = readParas(INFO_PATH + fName + TXT_END);

  if(paragraphs === null){
    /*If the file reading failed, disable further file reading.*/
    readSuccess = false;

    /*Make an alert for the current environment*/
    if(ONLINE){
      webReadAlert();
    }
    else{
      alert("Failed to load unit-specific content from " + fName + " file.");
    }
    return true;    /*readSuccess will signify that the file reading failed*/
  }
  else if(paragraphs.length !== 4){
    console.log(errPre + "The content file should contain exactly four of paragraphs.");
    return false;
  }

  /*Update picture*/
  let imgParas = paragraphs[0].split("\r\n");

  if(imgParas.length !== 2){
    console.log(errPre + "The first paragraph of the content file should contain exactly two lines.");
    return false;
  }
  else{
    $illWrap.children("img").attr("src", IMG_PATH + imgParas[0] + IMG_END);
    $illWrap.children("img").attr("alt", imgParas[1]);
  }

  /*Update picture text(step one)*/
  let imgText = paragraphs[1].split("\r\n");

  if(imgText.length > 1){
    console.log(errPre + "The second paragraph of the content file should contain a single line.");
    return false;
  }

  /*Remove old heading*/
  $textWrap.children("h3").remove();

  /*Add a new one*/
  $textWrap.append("<h3>" + imgText[0] + "</h3>");
  if(imgText[0] === "-"){
    $textWrap.children("h3").addClass("usynlig");
  }

  /*Update info section*/
  let infoText = paragraphs[2].split("\r\n");

  /*Remove old heading and paragraph*/
  $infoWrap.children("h2").remove();
  $infoWrap.children("p").remove();

  /*Add new ones*/
  $infoWrap.append("<h2>" + infoText[0] + "</h2>");
  $infoWrap.append("<p></p>");
  infoText.slice(1).forEach(function(line) {
    $infoWrap.children("p").append(line + "<br>");
  });

  /*Remove old footer content*/
  $foot.children("h2").remove();
  $foot.children(".socials").remove();
  $foot.children(".contacts").remove();

  if(!(readPartial("footer", $foot))){
    return true;
  }
  else{
    /*Add structure to the footer wrapper*/
    $foot.append(footCode);
  }

  /*Add content to the footer*/
  footLines = paragraphs[3].split("\r\n");
  if(footLines[footLines.length - 1] === ""){
    /*In case the final newline has been included in the paragraph, remove the last element*/
    footLines = footLines.slice(0, footLines.length - 1);
  }

  if(footLines[0] !== "-"){
    if(footLines.length < 5){
      console.log(errPre + "The fourth (last) paragraph of the content file should contain at least five lines when the first line consists of something else than a single dash.");
      return false;
    }

    /*Update contact link in banner and illustration*/
    $foot.attr("id", footLines[0]);
    $("nav.nav-top").children(':contains("Kontakt")').remove();  /*Remove old link if any*/
    $("nav.nav-top").append('<a href="#' + footLines[0] + '">Kontakt</a>');
    $illWrap.find("a").attr("href", "#" + footLines[0]);
    $illWrap.find("a").removeClass("usynlig");    /*Make sure the contact link is displayed*/
    $foot.removeClass("inactive");    /*Make sure the footer is displayed*/
  }
  else{
    if(footLines.length > 2){
      console.log(errPre + "The fourth (last) paragraph of the content file should contain exactly two lines when the first line consists of a single dash.");
      return false;
    }
    /*Hide contact link from image text and remove hide the footer*/
    $illWrap.find("a").addClass("usynlig");
    $foot.addClass("inactive");
  }

  if(!footLines[1]){
    console.log(errPre + "The fourth (last) paragraph of the content file should contain at least two lines.");
    return false;
  }
  else{
    /*Update image text with the name of the unit/workplace*/
    $textWrap.children("h2").remove();                    /*Remove old header*/
    $textWrap.prepend("<h2>" + footLines[1] + "</h2>");   /*Add a new one*/
  }

  /*Read file containing a separator for contact fields*/
  let sepCode = readFile(PART_PATH + "seps.html");

  if(sepCode === null){
    return false;
  }

  const seps = " " + sepCode;

  $(".adr").append(footLines[2] + seps);
  $(".padr").append(footLines[3] + seps);
  $(".tlf").append(footLines[4]);

  /*Add address to facebook link if it's given. Otherwise, hide the link.*/
  if(footLines[5]){
    $(".fb-link").attr("href", footLines[5]);
  }
  else{
    $(".fb-link").addClass("usynlig");
  }

  if(footLines[6]){
    console.log(errPre + "The fourth (last) paragraph of the content file should not contain more than six lines.");
    return false;
  }

  return true;
}

/*Function for reading content into the services section for workplaces or activities.
workPlace should only be given as an argument if pName is equal to JOBPAGE.
*/
function readServices(pName, workPlace = ""){
  progress = "reading service files";
  before = true;

  let errPre = "readServices()" + ERR_POST;
  let servArray = [];
  let i = undefined;    /*iterator for the JOBPAGES array*/

  /*Test that the arrays for jobs and services match*/
  if(JOBS.length !== SERVICES.length){
    console.log(errPre + "The global const arrays JOBS and SERVICES should have equal length.");
    return false;
  }

  /*Test arguments. Initialize servArray if arguments are ok.*/
  if(pName !== JOBPAGE && pName !== ACTPAGE){
    console.log(errPre + "Its first argument doesn't equal JOBPAGE or ACTPAGE.");
    return false;
  }

  if(pName === ACTPAGE){
    if(workPlace){
      console.log(errPre + "Its second argument should not be given when the first equals ACTPAGE.");
      return false;
    }
    else{
      servArray = SERVICES[SERVICES.length - 1];
    }

  }
  else if(pName === JOBPAGE){
    for(i = 0 ; i < JOBS.length - 1 ; i++){
      if(workPlace === JOBS[i]){
        break;
      }
    }

    if(i >= JOBS.length - 1){
      console.log(errPre + "Its second argument should equal an element in JOBS (but not the last) when the first equals JOBPAGE.");
      return false;
    }
    else{
      servArray = SERVICES[i];
    }

  }

  let $servWrap = $(".services");
  let servFolder = servArray[0];

  /*Remove existing storyboxes and paragraphs from the services content*/
  $servWrap.children(".storybox").remove();
  $servWrap.children("p").remove();

  /*Test that the divs that are about to be added and updated does not yet exist in the DOM*/
  if(!(testValidity(ABSENT, [".imgcell", ".infotext"]))){
    return false;
  }

  /*Read service box structure*/
  let sBoxCode = readFile(PART_PATH + "serv_story.html");

  if(sBoxCode === null){
    return false;
  }

  /*For each service, read the service's file, add a service box structure, and update the service box content*/
  servArray.slice(1).forEach(function(sName) {
    let fPath = INFO_PATH + servFolder + sName + TXT_END;
    let paragraphs = readParas(fPath);

    if(paragraphs === null){
      console.log("bad file path " + fPath);
      return false;
    }
    else{
      if(paragraphs.length !== 3){
        console.log(errPre + "The file " + fPath + " must contain exactly three paragraphs.");
        return false;
      }

      /*Add structure*/
      $servWrap.append(sBoxCode);

      /*Process first paragraph (img and heading)*/
      let imgParas = paragraphs[0].split("\r\n");

      if(imgParas.length > 2){
        console.log(errPre + "The first paragraph in " + fPath + " must contain at most two lines.");
        return false;
      }
      else{
        let $currImg = $(".imgcell").last().children("img");
        let iPath = "";
        if(imgParas.length === 1){
          iPath = IMG_PATH + servArray[0] + sName + IMG_END;
        }
        else if(imgParas[1] === "-"){
          iPath = IMG_PATH + "no_img" + IMG_END;
        }
        else{
          iPath = IMG_PATH + servArray[0] + sName + IMG_END;
          $(".imgcell").last().addClass("debug");
          $(".infocell").last().addClass("debug");
          $(".infotext").last().addClass("debug");
        }
        $currImg.attr("src", iPath);
        $currImg.attr("alt", imgParas[0]);

        let $currTextbox = $(".infotext").last();
        $currTextbox.children("h4").append(imgParas[0]);

        /*Process second paragraph (treat is as a single html paragraph)*/
        $currTextbox.children("p").append(paragraphs[1]);   /*Not bothering testing that the input is correctly formatted*/

        /*Process third paragraph*/
        let lines = paragraphs[2].split("\r\n");
        if(!(lines[lines.length - 1])){
          lines = lines.slice(0, lines.length - 1);
        }

        lines.forEach(function(line) {
          $currTextbox.children("ul").append("<li>" + line + "</li>");
        });

      }
    }

  });

  return true;
}

function readPartial(pName, target, part, addArray = []){
  let errPre = "readPartial" + ERR_POST;

  /*Test that the arguments are as expected*/
  if(typeof(pName) !== "string"){
    console.log(errPre + "The first argument must be a string.");
    return false;
  }

  if(!(target instanceof jQuery)){
    console.log(errPre + "The second argument must be a jQuery selection.");
    return false;
  }

  if(typeof(part) !== "string"){
    console.log(errPre + "The third argument must be a string.");
    return false;
  }

  if(!(Array.isArray(addArray))){
    console.log(errPre + "The fourth arguments must be an array.");
    return false;
  }

  let partCode = readFile(PART_PATH + pName + PART_END);

  if(partCode === null){
    /*If the file reading failed, disable further file reading.*/
    readSuccess = false;

    /*Make an alert for the current environment*/
    if(ONLINE){
      webReadAlert();
    }
    else{
      alert("Failed to load " + part + " code.");
    }
  }
  else{
    if(TESTING && addArray.length){
      /*Unpack to be able to test the validity with constraint ABSENT*/
      let classArray = [];

      addArray.forEach(function(subArray) {
        /*Test that the array has at least two elements*/
        if(!(Array.isArray(subArray))){
          console.log(errPre + "The fourth argument (array) must contain exclusively arrays as its elements.");
          return false;
        }
        classArray.push(subArray[1]);
      });

      if(!(testValidity(ABSENT, classArray))){
        logProgress();
        return false;
      }
    }

    target.append(partCode);

    if(TESTING && addArray.length){
      if(!(testValidity(UNIQUE, addArray))){
        logProgress();
        return false;
      }
    }
  }

  /*No errors encountered. If the file read failed,
  this should be apparent from the global var readSuccess.*/
  return true;
}

/*** Generate additional html for the current site ***/
$(document).ready( () => {

  /**Flow controlling variables**/

  /**Find out what page is being readied**/
  let pageName = findPageName(window.location.pathname);


  /***Test section***/
  if(TESTING){
    /**Testing the test framework**/
    if(pageName === TESTPAGE){
      runAllTests();
      return;     /*The test framework page has done its job, so the JS code can stop here.*/
    }

    /**Testing element occurrence before DOM manipulation starts**/

    /*Uniques*/
    const base = ["body", ".base"];
    const banWrap = ["section", ".banner-wrapper"];

    if(!(testValidity(UNIQUE, [base, banWrap]))){
      logProgress();
      return;
    }

    /*Non-plurals*/
    const mainWrap = ["section", ".content-wrapper"];
    const topWrap = ["section", ".top-wrapper"];
    const empWrap = ["section", ".employee-wrapper"];

    if(!(testValidity(NON_PLURAL, [mainWrap, topWrap, empWrap]))){
      logProgress();
      return;
    }
  }


  /***JQuery constants for step-1 html selections.***/
  const $baseBody = $("body.base");
  const $banWrap = $("section.banner-wrapper");
  const $topWrap = $("section.top-wrapper");
  const $mainWrap = $("section.content-wrapper");
  const $empWrap = $("section.employee-wrapper");


  /***Browser compatibility testing (custom properties).***/
  /*The code is more complex than ideal since the css method doesn't specify the format of the return value (it is assumed that the browser does it in  the same way every time, though)*/
  /*Note that non-careful modifications to the test (in its current form) might break the site layout.*/

  /**Testing the absence of a test section.**/
  if(TESTING){
    if(!(testValidity(ABSENT, [".test"]))){
      logProgress();
      return;
    }
  }

  /*Add test section at the start of the body*/
  $baseBody.prepend('<section class="test"></section>');
  progress = "browser compatibility test";    /*No need to change the before variable this time*/

  /**Test that the test section was added.**/
  if(TESTING){
    if(!(testValidity(UNIQUE, [["section", ".test"]]))){
      logProgress();
      return;
    }
  }

  /**Test that an element (basebody) using custom properties has the same colors as an element using direct assignment (.test)**/
  let realCol = $(".test").css("background-color");
  let browserCol = $baseBody.css("background-color");

  if(browserCol !== realCol){
    alert("Your browser doesn't support custom properties in the layout. The layout will not look as intended. See https://developer.mozilla.org/en-US/docs/Web/CSS/--*");
  }

  before = false;         /*Test completed*/
  $(".test").remove();    /*Remove the test section*/

  /**Test that the test section was successfully removed.**/
  if(TESTING){
    if(!(testValidity(ABSENT, [".test"]))){
      logProgress();
      return;
    }
  }


  /***Create banner***/

  /*Update the progress*/
  progress = "adding banner code";
  before = true;

  /**Read banner file**/

  /*If an error occurs while the banner is being populated, stop loading the page.*/
  if(!(readPartial("banner", $banWrap, [["nav", ".nav-top"]]))){
    /*Since this should be the first file read attempt, give an alert with the probable cause of failure.*/
    alert("There might be browser restrictions on reading local files.");
    return;
  }
  else{
    before = false;
  }

  /*If the last file read succeeded, add formatting to the nav links.
  An idea for later is to add the links dynamically based on ALLPAGES
  (make sure not to add links for pages that are not supposed to be in the navbar).
  */
  if(readSuccess){
    $("nav.nav-top").children().each(function (){
      let target = $(this).attr("href");

      /*Give self-pointing links class unlink (not clickable).*/
      if(typeof target !== typeof undefined){
        if(pageName === target.slice(2)){
          $(this).addClass("unlink");
        }
      }
      else if(TESTING){
        console.log("Do not add anchors without a href attribute to the banner navbar.");
        logProgress();
        return;
      }
    });
  }

  /***Create top wrapper (for navigating through dynamic content)***/
  if(readSuccess && $topWrap.length){
    progress = "adding structure to the top wrapper (navigation of dynamic content)";
    before = true;

    /**Read top-wrapper file**/
    if(!(readPartial("tops", $topWrap, [["div", ".scroll-menu"]]))){
      return;
    }
    else{
      before = false;
    }

    /*If file read succeeded, add content inside the top wrapper structure*/
    if(readSuccess){
      progress = "adding page-specific code to the top wrapper (navigation of dynamic content)";
      before = true;

      /*Test that the page is one of the ones that is expected to have a top wrapper.
      Find the file name for the top wrapper content.*/
      let buttonFile = "";

      if(pageName === JOBPAGE){
        buttonFile = "top_jobs";
      }
      else if(pageName === EMPPAGE){
        buttonFile = "top_emps";
      }

      /*If there's no defined file for the top wrapper content of the current page, stop loading the page.*/
      if(!buttonFile){
        alert("Top wrapper exists on a page that doesn't have a defined buttonFile." + BUGALERT_POST);
        logProgress();
        return;
      }

      /**Populate top wrapper from file**/
      if(!(readPartial(buttonFile, $(".scroll-menu")))){
        return;
      }
      else{
        before = false;
      }

    }
  }


  /***Create main content (initially consists of an img section, an info section and a footer).***/
  if(readSuccess && $mainWrap.length){
    progress = "adding structural code to the main content wrapper";
    before = true;

    /**Read main content file**/
    let mainElems = [["section", ".illustration"], ["section", ".info"],
    ["section", ".footer"], ["div", ".ill-text"], ["div", ".ill-link"]];
    if(!(readPartial("content", $mainWrap, mainElems))){
      return;
    }
    else{
      before = false;
    }

    /*If the file read succeeded, add page-specific content between the info and the footer.*/
    if(readSuccess){
      progress = "adding page-specific content to subwrappers of the main content wrapper";
      before = true;

      /*Test that the page is one of those that is expected to have a content wrapper.
      Find the file for the content wrapper content.*/
      let contentFile = "";

      if(pageName === HOMEPAGE){
        contentFile = "index";
      }
      else if(pageName === JOBPAGE){
        contentFile = "jobs";
      }

      /*Stop loading the page if it doesn't have a page-specific content file.*/
      if(!contentFile){
        alert("Content wrapper exists on a page that doesn't have a defined contentFile." + BUGALERT_POST);
        logProgress();
        return;
      }

      /**Read page-specific content file**/
      let newContent = readContent(contentFile);   /*Made a function, since reading the content could happen as an onclick event too.*/

      if(!newContent){
        logProgress();
        return;
      }
    }

    /**Create additional home page content**/
    if(readSuccess && pageName === HOMEPAGE){
      /*Make options section*/
      progress = "adding options section to home page";
      before = true;

      /*Test that the DOM doesn't yet contain the elements that are supposed to get added.*/
      if(testing){
        if(!(testValidity(ABSENT, [".options", ".storygrid"]))){
          logProgress();
          return;
        }
      }

      let optCode = readFile(PART_PATH + "opts.html");

      if(optCode === null){
        /*If the file reading failed, give an error message alert and disable further file reading.*/
        readSuccess = false;
        before = false;

        /*Make alert for the current environment*/
        if(online){
          webReadAlert();
        }
        else{
          alert("Failed to load options section for home page. Unknown cause.");
        }
      }
      else{
        /*Insert the option code directly before the footer element*/
        $(".footer").before(optCode);
        before = false;
      }

      /*Make storygrid section*/

      progress = "adding storygrid section to home page";
      before = true;

      let gridCode = readFile(PART_PATH + "storygrid.html");

      if(gridCode === null){
        /*If the file reading failed, give an error message alert and disable further file reading.*/
        readSuccess = false;
        before = false;

        if(online){
          webReadAlert();
        }
        else{
          alert("Failed to load storygrid structure for home page. Unknown cause.");
        }
      }
      else{
        /*Insert the storygrid code directly before the footer element*/
        $(".footer").before(gridCode);
        before = false;
      }

      /**Populate employee storygrid**/

      $sGrid = $(".storygrid");

      if(readSuccess && $sGrid.length){
        progress = "populating storygrid";
        before = true;

        /*Add storyboxes*/
        let boxCode = readFile(PART_PATH + "empboxes.html");

        if(boxCode === null){
          /*If the file reading failed, give an error message alert and disable further file reading.*/
          readSuccess = false;
          before = false;

          if(online){
            webReadAlert();
          }
          else{
            alert("Failed to load storybox structure for home page. Unknown cause.");
          }
        }
        else{
          /*Populate the story grid with boxes for each employee story*/
          for(let i = 0; i < EMPS.length - 1; i++){
            $sGrid.append(boxCode);
          }
        }

        if(readSuccess){
          /*Add storylinks to each storybox*/
          let linkCode = readFile(PART_PATH + "storylink.html");

          if(linkCode === null){
            /*If the file reading failed, give an error message alert and disable further file reading.*/
            readSuccess = false;
            before = false;

            if(online){
              webReadAlert();
            }
            else{
              alert("Failed to load storylink content for storyboxes on the home page. Unknown cause.");
            }
          }
          else{
            $sGrid.find(".storylink").append(linkCode);
          }

          /*Update paragraphs and signature for each employee box*/
          if($(".employee").length !== EMPS.length - 1){
            alert("Home page has the wrong number of employee boxes.");
          }
          else{
            for(let j = 0; j < EMPS.length - 1; j++ ){
              let $empbox = $(".employee").eq(j);
              let paragraphs = readParas(INFO_PATH + "ansatte/" + EMPS[j] + TXT_END);

              $empbox.find("p.excerpt").append(paragraphs[0]);
              $empbox.find("p.sign").append("-" + capitalizeFirstLetter(EMPS[j]));

              /*Update the address of the storylink*/
              $empbox.find(".storylink").children("a").attr("href", "./ansatte.html?userid=" + j);
            }
          }

          before = false;
        }
      }
    }
  }

  /*** Create services content for job page or activity page. ***/
  if(readSuccess && (pageName === JOBPAGE || pageName === ACTPAGE)){
    progress = "adding service section to JOBPAGE or ACTPAGE";
    before = true;

    /*Test that the DOM doesn't yet contain a service section.*/
    if(testing){
      if(!(testValidity(ABSENT, [".services"]))){
        logProgress();
        return;
      }
    }

    /*Read structure file*/
    let servCode = readFile(PART_PATH + "service.html");

    if(servCode === null){
      /*If the file reading failed, give an error message alert and disable further file reading.*/
      readSuccess = false;
      before = false;

      /*Make alert for the current environment*/
      if(online){
        webReadAlert();
      }
      else{
        alert("Failed to load service structure for job page. Unknown cause.");
      }
    }
    else if(pageName === JOBPAGE){
      /*Insert the service code directly before the footer element*/
      $(".footer").before(servCode);
      before = false;
    }
    else if(pageName === ACTPAGE){
      /*Insert the service code directly after the banner element*/
      $banWrap.after(servCode);
      before = false;
    }
    else{
      alert("Service section was attempted to be loaded from a page that isn't defined as having services. Site admins have to fix this.");
      logProgress();
      return;
    }

    /*Test that exactly one service section now exists*/
    if(testing){
      if(!(testValidity(UNIQUE, [["section", ".services"]]))){
        logProgress();
        return;
      }
    }

    if(readSuccess){
      progress = "populating service section on JOBPAGE or ACTPAGE";
      before = true;

      let $servWrap = $(".services");

      /*Update service section based on page*/
      if(pageName === JOBPAGE){
        /*Since no button should be active yet, the user is told that the section is empty for now.
        The empty paragraph is there to push the text to the next grid position to prevent a small column width.
        It is not an optimal solution, but it isn't straightforward to get something better within the grid.*/
        $servWrap.append("<p></p><p>Ingen tjenester blir vist før du velger en arbeidsplass fra knapperaden.</p>");
        before = false;
      }
      else if(pageName === ACTPAGE){
        let serviceUpdate = readServices(ACTPAGE);

        if(!serviceUpdate){
          logProgress();
          return;
        }

        before = false;
      }
      else{
        alert("Service section was attempted to be updated from a page that isn't defined as having services. Site admins have to fix this.");
        logProgress();
        return;
      }
    }
  }

  /*** Create employee window with content inside the employee wrapper ***/
  if(readSuccess && $empWrap.length){
    progress = "adding structural code to the employee wrapper";
    before = true;

    /*Read structure file*/
    let empCode = readFile(PART_PATH + "empwindow.html");

    if(empCode === null){
      /*If the file reading failed, give an error message alert and disable further file reading.*/
      readSuccess = false;
      before = false;

      /*Make alert for the current environment*/
      if(online){
        webReadAlert();
      }
      else{
        alert("Failed to load employee window. Unknown cause.");
      }
    }
    else{
      /*Add content to the employee wrapper*/
      $empWrap.append(empCode);
    }

    /*Find out what user to display based on url attribute*/
    let current = getUserId();
    if(current === null){
      current = EMPS.length - 1; /*Start at intro page*/
    }
    else if (current < 0 || current >= EMPS.length - 1) {
      alert("userid attribute in url is outside the range of valid userids");
      current = EMPS.length - 1;
    }

    /*Fix the links so they direct to the right user. Since JS doesn't have a proper modulo operator,
    this is a little more complex than it would otherwise have to be.*/
    let next = current + 1;
    let prev = current -1;

    if(current === (EMPS.length - 1) || current === (EMPS.length - 2)) {
      next = 0;
    }
    else if(current === 0){
      prev = EMPS.length - 2;
    }

    $empButtons = $(".stealthy");
    /*Test that the correct number of navigation objects (buttons with class stealthy) exists.*/
    if($empButtons.length !== 2){
      alert("Default employee navigation is broken. Site admins have to update the code.");
    }
    else{
      $(".stealthy").eq(0).attr("href", "./ansatte.html?userid=" + (prev));
      $(".stealthy").eq(1).attr("href", "./ansatte.html?userid=" + (next));
    }

    /*Add the storybox class to the employee wrapper*/
    $empWrap.addClass("storybox");

    /*Append employee window code to the employee window*/
    progress = "adding employee-specific content to the employee window"
    before = true;

    let paragraphs = readParas(INFO_PATH + "ansatte/" + EMPS[current] + TXT_END);

    if(paragraphs === null){
      /*If the file reading failed, give an error message alert and disable further file reading.*/
      readSuccess = false;
      before = false;

      /*Make alert for the current environment*/
      if(online){
        webReadAlert();
      }
      else{
        alert("Failed to read employee content. Unknown cause.");
      }
    }
    else{
      /*Add img to the html*/
      $empWrap.children("img").attr("src", IMG_PATH + "ansatte/" + EMPS[current] + IMG_END);
      $empWrap.children("img").attr("alt", paragraphs[paragraphs.length - 1]);

      /*Add paragraphs to the html code*/
      for(let i=0; i < paragraphs.length - 1; i++){
        if($.trim(paragraphs[i]).length > 0){
          $("<p>" + paragraphs[i] + "</p>").insertBefore($empWrap.children("p.sign"));
        }
      }

      /*Add signature*/
      $empWrap.children("p.sign").append("-" + capitalizeFirstLetter(EMPS[current]));

      before = false;
    }

  }

  /***Event handling for workplaces***/
  if(readSuccess && pageName === JOBPAGE){
    progress = "adding event handling to the job page"
    before = true;
    /*Confirm that the page has the expected wrappers*/
    if(!(testValidity(UNIQUE, [["section", ".illustration"], ["div", ".ill-text"], ["div", ".ill-link"], ["section", ".info"], ["section", ".footer"], ["section", ".services"], ["div", ".scroll-menu"]]))){
      logProgress();
      return;
    }
    else{
      const $wbuttons = $(".scroll-menu").find("a");

      for(let j=0; j < $wbuttons.length; j++){
        $wbuttons.eq(j).on("click", () => {
          /*Make the clicked button the only active one*/
          $wbuttons.removeClass("active");
          $wbuttons.eq(j).addClass("active");

          /*Update initial content sections*/
          let fileName = $wbuttons.eq(j).text().toLowerCase();
          let updateContent = readContent(fileName);

          if(!updateContent){
            logProgress();
            return;
          }

          /*Update serviceboxes*/
          let updateServices = readServices(JOBPAGE, $wbuttons.eq(j).text());

          if(!updateContent){
            logProgress();
            return;
          }
        });
      }
    }

    before = false;
  }

  return;

  /***Add content to the JOBPAGE***/
  if(readSuccess)

  /***Workplace creation***/
  if(readSuccess && $jobwindow[0]){
    let jobWinCode = readFile("./jobwindow.html"); /*Can probably delete this file...*/
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

});
