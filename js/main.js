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
const NO_INPUT = -1      /*Used for testing. Do not include this value in INPUTTYPES*/
const BUNDLED = 0;      /*For an array (presumably of arrays or strings).*/
const CLASS = 1;        /*For a string corresponding to a class name.*/
const COMPOSITE = 2;    /*For a combination of class name and a string corresponding to a tag.*/
const INPUTTYPES = [BUNDLED, CLASS, COMPOSITE];
const TAGTYPES = ["body", "section"];

/**Errors**/
const ERR_ARGERR = "argumentError error: ";
const ERR_ABSERR = "isAbsent error: ";
const ERR_PRESERR = "isPresent error: ";
const ERR_UNOERR = "showUniqueness error: ";

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
/*https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript*/
function capitalizeFirstLetter(string){
  return string.charAt(0).toUpperCase() + string.slice(1);
}


/*** Functions made by Jon Simonsen ***/

/*Function for reading a file and returning an array of paragraphs using double newlines as separators.
Note that the function currently assumes that XMLHttpRequest interprets a newline as "\r\n"*/
function readParas(file){
  return readFile(file).split("\r\n\r\n");
}

/*Function for extracting userid from url. Returns null if the url has no attributes.
Returns null and displays an alert if there's something wrong with the attribute.
Attributes other than userid is not allowed. Could have more detailed error checks and messages.*/
/*For more advanced url extraction, check out https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript*/
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

/*Function for use when a JQuery selection contains the wrong number of elements.
collection can be an array containing two strings. The first should correspond to the html tag of the element. The second should be the class name.
Otherwise, collection should be a string containing the class name. If this is the case, the function assumes that there exists an element of this class that has a tag it is not supposed to have.
multiples says if the uniqueness was violated by having too many elements (true) or too few (false). This argument doesn't matter if the first one was a string.
Returns a string containing a message specifying how the uniqueness has been violated. If the function arguments are not as expected, the returned string specifies this instead.*/
function makeUniquenessError(collection, multiples = true){
  let description = "";
  let argErrorPrefix = "makeUniquenessError function ";
  let quantity = "Multiple "
  if(!multiples){
    quantity = "No "
  }

  /*Test validity of arguments*/
  if(Array.isArray(collection)){
    if(collection.length !== 2){
      return argErrorPrefix + "expects the array argument to contain exactly two items (when an array argument is given)";
    }
    if(typeof(collection[0]) !== "string" || typeof(collection[1]) !== "string"){
      return argErrorPrefix + "expects both items in the array argument to be of type string.";
    }
  }
  else if(typeof(collection) !== "string") {
    return argErrorPrefix + "expects an array or a string as first argument.";
  }

  if(typeof(multiples) !== "boolean"){
    return argErrorPrefix + "expects a bool as second argument if more than one is given.";
  }
  else if(multiples === false && typeof(collection) === "string"){
    return argErrorPrefix + "doesn't accept false as second argument when the first argument is a string.";
  }

  if(typeof(collection) === "string"){
    return "At least one unexpected element of class " + collection + " in html file. The class can only be used for a specific html tag.";
  }
  else{
    return quantity + collection[0] + " elements of class " + collection[1] + " in html file.";
  }
}

/*Function for testing that there are not multiple occurrences of a certain element in the html document the function is called from. If the element is required, it also tests for existence.
The test assumes that there are no other elements (tags) with the same class as the one being tested. If this is violated, an error explaining this should be returned.
The argument is an array that is expected to consist of two strings and optionally a boolean as its last element.
The first string corresponds to a html tag, and must match on of the strings in the allowedTags array in this function.
The second string should be a class name with a dot in front of it (".classname").
The boolean tells if the element is required in the html document.
Returns an empty string if the element satisfies the uniqueness test. Otherwise returns a string containing an error message.*/
function testUniqueness(elemArray){
  const allowedTags = ["body", "section", "nav"];
  let required = false;

  /**Test validity of argument**/
  if(!(Array.isArray(elemArray))){
    return "Expected an array argument.";
  }

  if(elemArray.length < 2 || elemArray.length > 3){
    return "The array argument is supposed to contain 2 or 3 elements.";
  }

  if(!allowedTags.includes(elemArray[0])){
    return "The first element in the array argument must be one of a limited number of strings. Read the function for allowed values.";
  }

  if(typeof(elemArray[1]) === "string"){
    if(!elemArray[1].startsWith(".")){
      return "The second element of the array argument must correspond to a class (start with a dot).";
    }
  }
  else{
    return "The second element of the array argument must be a string.";
  }

  /*Process argument as well as testing*/
  if (elemArray.length === 3){
    if(typeof(elemArray[2]) === "boolean"){
      required = elemArray[2];
    }
    else{
      return "The third element of the array argument is expected to be a boolean.";
    }
  }

  /**Do additional processing**/
  /*Test the uniqueness of the object with tag determined by the first element in the array argument and class determined by the second.
  Also test that there are not multiple elements of that class.*/
  $targetSel = $(elemArray[0] + elemArray[1]);
  $classSel = $(elemArray[1]);

  if($targetSel[1]){
    return makeUniquenessError(elemArray.slice(0, 2));
  }
  else if($targetSel[0]){
    if($classSel[1]){
      return makeUniquenessError(elemArray[1]);
    }
  }
  else if($classSel[0]){
    return makeUniquenessError(elemArray[1]);
  }
  else if(required){
    return makeUniquenessError(elemArray.slice(0, 2), false);
  }

  /*If no errors were detected, return an empty string*/
  return "";
}

/*Tests if the elements in the argument array satisfy uniqueness criteria.
setArray should be an array of (sub-)arrays to allow testing multiple elements in one go. It should contain the subarrays to be processed.
See inside this function to inspect how the subarrays are supposed to be built.
For every subarray, the function should log to the console an error message if the subarray doesn't satisfy the uniqueness criteria.
If any error message was logged, the function should return false. Otherwise, it should return true.*/
function showUniqueness(setArray){
  let isSpecial = true;
  let errorMsg = argumentError(setArray, BUNDLED); /*Test argument*/

  if(errorMsg){
    console.log(ERR_UNOERR + errorMsg);
    return false;
  }

  /*For each element in the set, test its uniqueness and log any error messages to the console.*/
  setArray.forEach(function(item){
    errorMsg = testUniqueness(item);    /*Inspect this function to see an explanation of how the subarrays (items) are supposed to look.*/
    if(errorMsg){
      console.log("Error in testUniqueness. " + errorMsg);
      success = false;
    }
  });

  return success;
}

/*Function for testing if all elements in the selectorArray are present in the html document.
Also tests that only the tag type in the selectorArray has the class from the selectorArray.
selectorArray
*/
function isPresentx(selectorArray){
  let exists = true;    /*Assume that argument is correct and its elements are present until otherwise has been determined.*/
  let errorMsg = argumentError(BUNDLED, selectorArray);    /*Test argument*/

  if(errorMsg){
    console.log(ERR_PRESERR + errorMsg);
    return false;
  }

  /*Test the elements of ...*/
  selectorArray.forEach(function(elem) {
    errorMsg = argumentError(elem, PRESENT);
    if(errorMsg){
      exists = false;
      console.log(ERR_PRESERR + errorMsg);
    }
    else{
      /*Test that an elem exists. Tests that the number of elems of the given class is the same as the number of existing elems*/
    }
  });
}

/*Function for testing if all classes in the classArray are absent from the html document.
classArray should be an array of strings where all strings are class names starting with a dot.
Returns true if all classes are absent. It returns false otherwise. It also returns false if there is something wrong with the argument.*/
function isAbsentx(classArray){
  let isMissing = true;   /*Assume that argument is correct and its elements are absent until otherwise has been determined.*/
  let errorMsg = argumentError(classArray, BUNDLED);   /*Test argument*/

  if(errorMsg){
    console.log(ERR_ABSERR + errorMsg);
    return false;
  }

  /*Test the elements of classArray*/
  classArray.forEach(function(className) {
    errorMsg = argumentError(className, ABSENT);
    if(errorMsg){
      isMissing = false;    /*Since a correct classname cannot be determined, isMissing has an unknown value and is assumed to be false.*/
      console.log(errorMsg);
    }
    else{
      /*Test if the className is actually absent from the document*/
      if($(classname).length){
        console.log(ERR_ABSERR + "There exists elements of class " + className + ".");
        isMissing = false;
      }
    }
  });

  return isMissing;
}

/*Function for testing inputElem according to inputType. All legal inputTypes should be members of a global INPUTTYPES array.
Use BUNDLED for testing if the argument is a non-empty array (it is implied that the array contains one or more elements that will be sent to argumentError later).
inputElem should be the array or string to be tested.
inputType determines how to test inputElem.
Returns an empty string if no error was found. Otherwise, returns an error message.
Based on inputTypes, the error message specifies the function that is assumed to have gotten the argument error (including itself). The exception is if inputType is BUNDLED.*/
function argumentErrorx(inputElem, inputType){
  /*If the type is bundled, check that inputElem is an array*/
  if(inputType === BUNDLED){
    if(!(Array.isArray(inputElem))){
      return "BUNDLE test failed. The input is expected to be an array.";
    }
    else if(!(inputElem[0])){
      return "Bundle test failed. The input array is expected to contain at least one element.";
    }
    else{
      return "";
    }
  }

  /*Test that the arguments to this function has the expected types*/
  /*if(typeof(inputElem) !== "string" && !(Array.isArray(inputElem))){
    return ERR_ARGERR + "Its first argument must be a string or an array.";
  }*/
  else if(!(INPUTTYPES.includes(inputType))){
    return ERR_ARGERR + "Its second argument must be equal to an element in the global const Array INPUTTYPES.";
  }

  /*Process the inputElem element (the arguments that the function checks)*/
  if(inputType === ABSENT){
    if(typeof(inputElem !== "string")){
        return ERR_ABSERR + '"' + inputElem + '" is not a string.';
    }
    else if(inputElem[0] !== "."){
      return ERR_ABSERR + '"' + inputElem + '" does not start with a dot.';
    }
  }

  return "";    /*No error detected*/

}

/*Function for testing inputs according to inputType. All legal inputTypes should be members of a global INPUTTYPES array.
Use BUNDLED for testing if inputOne is a non-empty array (it is implied that the array contains one or more elements that will be sent to argumentError later).
inputOne is expected be a string corresponding to a classname (starting with a dot) or (in the case of BUNDLED) a non-empty Array.
inputTwo is expected to be a string containing an html tag that is expected to be a member of a global TAGTYPES array.
Returns an empty string if no error was found. Otherwise, returns an error message.
Based on inputTypes, the error message specifies the function that is assumed to have gotten the argument error (including itself). The exception is if inputType is BUNDLED.*/
function argumentError(inputType, inputOne, inputTwo = ""){

  /*If the type is bundled, check that inputElem is an array*/
  if(inputType === BUNDLED){
    if(!(Array.isArray(inputOne))){
      return "BUNDLE test failed. The argument is expected to be an array.";
    }
    else if(!(inputOne[0])){
      return "BUNDLE test failed. The array argument is expected to contain at least one element.";
    }
    else if(inputTwo){
      return "Do not pass more than two arguments to argumentError when the first is BUNDLED."
    }
    else{
      return "";
    }
  }

  /*Test that the inputType has an expected value*/
  if(!(INPUTTYPES.includes(inputType))){
    return ERR_ARGERR + "The inputType argument must be equal to an element in the global const Array INPUTTYPES.";
  }

  /*Test that inputTwo has an expected value for the given inputType*/
  if(inputType === CLASS){
    if(inputTwo){
      return "Unnecessary argument passed to argumentError function.";
    }
  }
  else if(inputType === COMPOSITE){
    if(!(TAGTYPES.includes(inputTwo))){
      return '"' + inputTwo + '" is not in the list of allowed tags (TAGTYPES).'
    }
  }
  else{
    return ERR_ARGERR + "The function needs to be updated to process all possible inputTypes correctly."
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

/*Function for testing if all classes in the classArray are absent from the html document.
classArray should be an array of strings where all strings are class names starting with a dot.
Returns true if all classes are absent. It returns false otherwise. It also returns false if there is something wrong with the argument.*/
function isAbsent(classArray){
  let isMissing = true;                                 /*Assume that the argument is correct and its elements are absent until otherwise has been determined.*/
  let errorMsg = argumentError(BUNDLED, classArray);    /*Test the classArray argument*/

  if(errorMsg){
    console.log(ERR_ABSERR + errorMsg);
    return false;
  }

  /*Test the elements of classArray*/
  classArray.forEach(function(className) {
    errorMsg = argumentError(CLASS, className);
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

/*Function for testing if all elements in the selectorArray are present in the html document.
Also tests that only the tag type in the selectorArray has the class from the selectorArray.
selectorArray should be an array of arrays of strings.
Each string array should contains a tag first and then a class name (starting with a dot).
The tags should be one of the tags in TAGTYPES.
Returns true if all elements corresponding to tags and classes from the inner arrays are present.
It returns false otherwise. It also returns false if there is something wrong with the argument.*/
function isPresent(selectorArray){
  let exists = true;    /*Assume that argument is correct and its elements are present until otherwise has been determined.*/
  let errorMsg = argumentError(BUNDLED, selectorArray);    /*Test the selectorArray argument*/

  if(errorMsg){
    console.log(ERR_PRESERR + errorMsg);
    return false;
  }

  /*Test the elements of selectorArray*/
  selectorArray.forEach(function(subArray) {
    errorMsg = argumentError(PRESENT, subArray);
    if(errorMsg){
      exists = false;
      console.log(ERR_PRESERR + errorMsg);
    }
    else{
      /*Test that an elem exists. Tests that the number of elems of the given class is the same as the number of existing elems*/
    }
  });

  return exists;
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
      let output = "";

      /*Testing argumentError()*/
      console.log("When giving argumentError a bundle that isn't an array:");
      output = argumentError(BUNDLED, 123);
      console.log(output);
      console.log("");
      console.log("When giving argumentError a bundle that is an empty array:");
      output = argumentError(BUNDLED, []);
      console.log(output);
      console.log("");
      console.log("When giving argumentError a bundle with a total of three elements:");
      output = argumentError(BUNDLED, ["test"], "test");
      console.log(output);
      console.log("");

      console.log("When giving argumentError an invalid inputType:");
      output = argumentError(NO_INPUT);
      console.log(output);
      console.log("");
      console.log("When giving argumentError a class inputType with a total of three elements:");
      output = argumentError(CLASS, "test", "test");
      console.log(output);
      console.log("");

      /*Testing isAbsent()*/
      console.log("When giving isAbsent incorrect type of argument:");
      output = isAbsent(".test-zero");
      console.log("Yields: " + output);
      console.log("");
      console.log("When giving isAbsent an empty array:");
      output = isAbsent([]);
      console.log("Yields: " + output);
      console.log("");

      console.log("When giving isAbsent an array with incorrect type of subelement:");
      output = isAbsent([123]);
      console.log("Yields: " + output);
      console.log("");
      console.log("When giving isAbsent an array with an array subelement (incorrect):");
      output = isAbsent([[".test-zero"]]);
      console.log("Yields: " + output);
      console.log("");
      console.log("When giving isAbsent an array with incorrectly named string:");
      output = isAbsent(["test-zero"]);
      console.log("Yields: " + output);
      console.log("");

      console.log("When giving isAbsent an absent element:");
      output = isAbsent([".test-zero"]);
      console.log("Yields: " + output);
      console.log("");
      console.log("When giving isAbsent a unique element:");
      output = isAbsent([".test-one"]);
      console.log("Yields: " + output);
      console.log("");
      console.log("When giving isAbsent a non-unique element:");
      output = isAbsent([".test-two"]);
      console.log("Yields: " + output);
      console.log("");

      /*Testing isPresent()*/
      console.log("When giving isPresent incorrect type of argument:");
      output = isPresent(".test-zero");
      console.log("Yields: " + output);
      console.log("");
      console.log("When giving isPresent an empty array:");
      output = isPresent([]);
      console.log("Yields: " + output);
      console.log("");

    }
  }

  /**Testing uniqueness(non-multiplicity and optionally existence) before DOM manipulation starts**/
  if(testing){
    const base = ["body", ".base", true];
    const banWrap = ["section", ".banner-wrapper", true];
    const mainWrap = ["section", ".content-wrapper"];
    const topWrap = ["section", ".top-wrapper"];
    const servWrap = ["section", ".service-wrapper"];
    const empWrap = ["section", ".employee-wrapper"];

    if(!(showUniqueness([base, banWrap, mainWrap, topWrap, servWrap, empWrap]))){
      console.log("Occurred before any DOM-manipulation");
      return;
    }

    /*Arrays will contain the selector string, a debugging description of the element and a bool that is true if the element is required*/
    /*const baseBody = ["body.base", "bodies of the base class", true];
    const baseClass = [".base", "elements of the base class (only supposed to be used for the body)", true];
    const bannerSection = [".banner-wrapper", "wrappers for banner code", true];
    const illSection = [".illustration", "illustration section"];
    const infoSection = [".info", "info section"];
    const optSection = [".options", "option section"];*/    /*190118: Note that it's relatively likely that this section is deprecated soon.*/
    /*const storySection = [".stories", "story section"];*/   /*190118: Might want to rename the class/description to story-wrapper, excerpt or something similar.*/
    /*const footerSection = [".footer", "wrappers for footer code"];*/    /*190118: It is possible that footers will soon be exclusively made by DOM-manipulation. In that case, a pure existence test should be used instead.*/
    /*const topWrapper = [".top-wrapper", "top wrappers for navigating through dynamic content"];*/
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
