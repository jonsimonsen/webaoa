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

/*Broadly scoped variables:
-globals
--------
progress
before
readSuccess

-inside ready function parameter scope
--------
pageName*/

/*The ready-function and the filtering in countBools() have anonymous arrow function parameters.
All other functions are defined using the function key word with curly brackets
(no arrow functions).*/


/*** Imports ***/
import TestError from './js/errors.js';


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
const JOBS = ["DREIS", "DagsJobben", "Jobs"]; /*Precise name of workplace. Except for the last one, these can be used to find the corresponding entry in SERVICES (the indexes should match).*/

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
let readSuccess = true;   /*Stop trying to read files when this becomes false.*/


/*** Classes and instances of them ***/
class ServiceProvider{
  constructor(path, services){
    /*It will assumed that the callee provides valid parameters (string, Array)*/
    this._path = path;
    this._services = services;
    this._length = this._services.length;
  }

  get path() {
    return this._path;
  }

  service(index) {
    if(index >= this._length){
      return "";
    }
    else{
      return this._services[index];
    }
  }

  get length() {
    return this._length;
  }
}

const DREIS = new ServiceProvider("dreis/", ["almehaven", "kurskonf", "bilservice", "produksjon", "serviceavd", "admin"]);
const DJOB = new ServiceProvider("djob/", ["dags"]);
const ACTS = new ServiceProvider("akts/", ["værftet", "tindfoten", "gimle", "kvaløya", "dagsenter"]);
const SERVICES = [DREIS, DJOB, ACTS];    /*Except for the last item, these should correspond to the item with the same index in JOBS.*/


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
  catch (exception){
    /*console.log("XMLHttpRequest error.");
    return null;*/
    throw new Error("XMLHttpRequest error.");
  }
  finally{
    return allText;
  }
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
  console.log("findPageName logging.")
  throw new TestError("The page was not found.", "findPageName");
  return "";
}

/**Function for extracting userid from url. Returns null if the url has no attributes.
Returns null and displays an alert if there's something wrong with the attribute.
Otherwise, the value of the attribute (as a number) is returned.
Attributes other than userid is not allowed.**/
/*For more advanced url extraction, check out
https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
*/
function getUserId(){
  let match = "userid=";
  let errPre = "Incorrect url. ";
  let url = window.location.href;
  let start = url.indexOf("?") + 1;

  /*Test that the string contains the separator
  and that it occurs early enough that there is room for the attribute name and value.*/
  if(start <= 0){
    /*Since an attribute isn't necessarily required, no kind of error message is given.*/
    return null;
  }
  else if(start > url.length - (match.length + 1)){ /*+1 since indices start at 0 while lengths start at 1.*/
    alert(errPre + "Wrongly named or formatted attribute (too short).");
    return null;
  }

  /*Test that the expected attribute string occurs directly after the separator.*/
  if(!(url.slice(start,(start + match.length)) === match)){
    alert(errPre + "Wrongly named attribute (should be userid).");
    return null;
  }

  let candidate = url.slice(start + match.length);

  /*Test if the value of the candidate is a number.*/
  if(isNaN(candidate)){
    alert(errPre + "Either the userid is not a number or the url contains unexpected symbols after the userid.");
    return null;
  }
  else{
    return Number(candidate);   /*Return the candidate as a number*/
  }
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

/**Function for reading a file and returning an array of paragraphs
using double newlines as separators.
The file must start with <txt> and end with </txt>
(it can have other content before and after, but this will be ignored).
Note that the function currently assumes that XMLHttpRequest interprets a newline as "\r\n".
If the file reading failed, the function returns null.**/
function readParas(file){
  let fileStr = readFile(file);
  if(fileStr === null){
    return null;
  }
  else{
    let text = fileStr.match(/<txt>[\s]*([^<]*)<\/txt>/);    /*remove the tags (including trailing whitespace) and anything before or after*/
    if(!text || text.length < 2){
      return null;
    }
    return text[1].split("\r\n\r\n");
  }
}

/**Function for reading an html file in the html folder
and adding the code to a JQuery selection.
pName is the name of the file (without path and ending) or
an array with the name as the first element
and a description of the file code as the second element.
target is the JQuery selector where the code is appended.
addArray is an array of arrays of strings that will (conditionally) be passed to testValidity
(See that function for further specification of its format)
or an empty array (default) if there are no constraints that need to be checked.
If the global var TESTING is true, the validity of addArray will be tested.
The elements are assumed to be ABSENT before the code is added, and UNIQUE afterwards.
Returns false if one of the arguments is wrongly formatted or the constraint is broken.
Returns true otherwise.
Sets readSuccess to false if the file reading failed.**/
function readPartial(pName, target, addArray = []){
  let errPre = "readPartial" + ERR_POST;
  let partName = "";
  let partText = "";

  /*Test that the arguments are as expected*/
  if(typeof(pName) === "string"){
    if(!pName){
      console.log(errPre + "The first (string) argument must be non-empty.");
      return false;
    }
    else{
      partName = pName;
      partText = pName;
    }
  }
  else if(Array.isArray(pName)){
    if(pName.length !== 2){
      console.log(errPre + "The first (array) argument must contain exactly two elements.");
      return false;
    }
    else if(typeof(pName[0]) !== "string" || typeof(pName[1]) !== "string"){
      console.log(errPre + "The first (array) argument must contain two strings as its (first) elements.");
      return false;
    }

    if(!pName[0].length || !pName[1].length){
      console.log(errPre + "The first (array) argument must contain non-empty strings as its (first) elements.");
      return false;
    }

    partName = pName[0];
    partText = pName[1];
  }
  else{
    console.log(errPre + "The first element must be either a string or an array.");
    return false;
  }

  if(!(target instanceof jQuery)){
    console.log(errPre + "The second argument must be a jQuery selection.");
    return false;
  }

  if(!(Array.isArray(addArray))){
    console.log(errPre + "The third argument must be an array.");
    return false;
  }

  if(!partName || !partText){
    console.log(errPre + "It seems like partName or partText still has the initial value.");
    return false;
  }

  /*Read partial code from file*/
  let partCode = readFile(PART_PATH + partName + PART_END);

  if(partCode === null){
    /*If the file reading failed, disable further file reading.*/
    readSuccess = false;

    /*Make an alert for the current environment*/
    if(ONLINE){
      alertWebReadError();
    }
    else{
      alert(`Failed to load ${partText} code.`);
    }
  }
  else{
    if(TESTING && addArray.length){
      /*Unpack to be able to test the validity with constraint ABSENT.
      It is possible that the shift method could be used instead, but that's also messy.*/
      const classArray = [];

      let isValid = addArray.every(function(subArray) {
        /*Test that the subelement is an array and has at least two elements*/
        if(!(Array.isArray(subArray))){
          console.log(errPre + "The third argument (array) must contain exclusively arrays as its elements.");
          return false;
        }
        else if(subArray.length < 2){
          console.log(errPre + "The subarrays of the third argument (array) must contain at least two elements.");
          return false;
        }

        classArray.push(subArray[1]);
        return true;
      });

      /*Return false if the addArray isn't correctly formatted*/
      if(!isValid){
        return false;
      }

      /*Test absence of elements that should get added from the partial*/
      if(!(testValidity(ABSENT, classArray))){
        logProgress();
        return false;
      }
    }

    /*Add partial code*/
    target.append(partCode);

    /*Test uniqueness of elements that should have been added.*/
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
  let $infoWrap = $(".info");
  let $foot = $(".footer");

  /*Read all paragraphs from the content file*/
  const paragraphs = readParas(INFO_PATH + fName + TXT_END);

  if(paragraphs === null){
    /*If the file reading failed, disable further file reading.*/
    readSuccess = false;

    /*Make an alert for the current environment*/
    if(ONLINE){
      alertWebReadError();
    }
    else{
      alert(`Failed to load unit-specific content from ${fName} file.`);
    }
    return true;    /*readSuccess will signify that the file reading failed*/
  }
  else if(paragraphs.length !== 4){
    console.log(errPre + "The content file should contain exactly four paragraphs.");
    return false;
  }

  /*Update picture*/
  const imgParas = paragraphs[0].split("\r\n");

  if(imgParas.length !== 2){
    console.log(errPre + "The first paragraph of the content file should contain exactly two lines.");
    return false;
  }
  else{
    $illWrap.children("img").attr("src", IMG_PATH + imgParas[0] + IMG_END);
    $illWrap.children("img").attr("alt", imgParas[1]);
  }

  /*Update picture text(step one)*/
  const imgText = paragraphs[1].split("\r\n");

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
  const infoText = paragraphs[2].split("\r\n");

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

  /**Read footer structure file**/
  if(!(readPartial(["footer", "footer structure"], $foot))){
    readSuccess = false;    /*Make sure that the callee knows to stop loading the page*/
    return true;
  }
  else if(!readSuccess){
    return true;
  }

  /*Add content to the footer*/
  const footLines = paragraphs[3].split("\r\n");

  if(footLines.length && footLines[footLines.length - 1] === ""){
    /*In case the final newline has been included in the paragraph, remove the last element*/
    footLines.pop();
  }

  if(footLines.length < 2){
    console.log(errPre + "The fourth (last) paragraph of the content file must contain at least two lines.");
    return false;
  }

  /*Update image text with the name of the unit/workplace*/
  $textWrap.children("h2").remove();                    /*Remove old header*/
  $textWrap.prepend("<h2>" + footLines[1] + "</h2>");   /*Add a new one*/

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
    $foot.show();    /*Make sure the footer is displayed*/
  }
  else{
    if(footLines.length !== 2){
      console.log(errPre + "The fourth (last) paragraph of the content file should contain exactly two lines when the first line consists of a single dash.");
      return false;
    }
    /*Hide contact link from image text and hide the footer*/
    $illWrap.find("a").addClass("usynlig");
    //$foot.addClass("inactive");
    $foot.hide();

    /*No need to manage the footer, so return from the function*/
    return true;
  }

  /**Read file containing a separator for contact fields**/
  let sepCode = readFile(PART_PATH + "seps.html");

  if(sepCode === null){
    /*If the file reading failed, disable further file reading*/
    readSuccess = false;

    /*Make an alert for the current environment*/
    if(ONLINE){
      alertWebReadError();
    }
    else{
      alert("Failed to load contact field separator code.");
    }

    return true;
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

/**Function for reading content into the services section for workplaces or activities.
Can be used during page loading or in response to events.
workPlace should only be given as an argument if pName is equal to JOBPAGE.
Returns true if the reading and updating proceeded as expected.
Returns true but sets readSuccess to false if a file read failed.
Returns false otherwise.**/
function readServices(pName, workPlace = ""){
  let errPre = "readServices()" + ERR_POST;
  let servUnit = {};
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
      servUnit = SERVICES[SERVICES.length - 1];    /*ACTPAGE is connected to the last element in SERVICES*/
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
      servUnit = SERVICES[i];
    }

  }

  let $servWrap = $(".services");

  /*Confirm that the service array has been initialized (is not empty)*/
  if(!servUnit.length){
    alert(errPre + "The list of services is empty." + BUGALERT_POST);
    return false;
  }

  /*Remove existing content from the services*/
  $servWrap.empty();

  /**Read service storybox structure**/
  if(!(readPartial(["serv_story", "service storybox structure"], $servWrap, [["div", ".imgcell"], ["div", ".infocell"], ["div", ".infotext"]]))){
    readSuccess = false;
    return true;
  }
  else if(!readSuccess){
    return true;
  }

  /*Define structure code for a single service.*/
  let sBoxCode = $servWrap.html();
  $servWrap.empty();    /*So that sBoxCode can be added for each service.*/
  $servWrap.append("<h2>Tjenester</h2>");   /*Could consider a different header for activities*/

  /*Becomes false if any subarray is not correctly formatted. The function will return this value before it ends.*/
  let validFormat = true;

  /*For each service, read the service's file, add a service box structure, and update the service box content*/
  for(let j = 0 ; j < servUnit.length ; j++){
    let fPath = INFO_PATH + servUnit.path + servUnit.service(j) + TXT_END;
    let paragraphs = readParas(fPath);

    if(paragraphs === null){
      /*If the file reading failed, disable further file reading.*/
      readSuccess = false;

      /*Make an alert for the current environment*/
      if(ONLINE){
        alertWebReadError();
      }
      else{
        alert(`Failed to load service-specific content from ${fPath} path.`);
      }
      return true;    /*readSuccess will signify that the file reading failed*/
    }
    else{
      if(paragraphs.length !== 3){
        console.log(`${errPre}The file ${fPath} must contain exactly three paragraphs.`);
        validFormat = false;
        return false;
      }

      /*Add structure*/
      $servWrap.append(sBoxCode);

      /*Process first paragraph (img and heading)*/
      let imgParas = paragraphs[0].split("\r\n");

      if(!imgParas.length){
        console.log(`${errPre}The first paragraph in ${fPath} must contain text (non-empty lines).`);
        validFormat = false;
        return false;
      }
      else if(imgParas.length > 2){
        console.log(`${errPre}The first paragraph in ${fPath} must contain at most two lines.`);
        validFormat = false;
        return false;
      }
      else{
        let iPath = "";

        if(imgParas.length === 1){
          iPath = IMG_PATH + servUnit.path + servUnit.service(j) + IMG_END;
        }
        else if(imgParas[1] === "-"){
          iPath = IMG_PATH + "no_img" + IMG_END;
        }
        else{
          iPath = IMG_PATH + servUnit.path + servUnit.service(j) + IMG_END;
          $(".imgcell").last().addClass("debug");
          $(".infocell").last().addClass("debug");
          $(".infotext").last().addClass("debug");
        }

        let $currImg = $(".imgcell").last().children("img");
        $currImg.attr("src", iPath);
        $currImg.attr("alt", imgParas[0]);

        let $currTextbox = $(".infotext").last();
        $currTextbox.children("h4").append(imgParas[0]);

        /*Process second paragraph (treat is as a single html paragraph)*/
        $currTextbox.children("p").append(paragraphs[1]);   /*Not bothering testing that the input is correctly formatted*/

        /*Process third paragraph*/
        const lines = paragraphs[2].split("\r\n");
        if(lines.length && !(lines[lines.length - 1])){
          lines.pop();
        }

        /*Add list elements for each line in the paragraph*/
        lines.forEach(function(line) {
          $currTextbox.children("ul").append(`<li>${line}</li>`);
        });

      }
    }
  }

  return validFormat;
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

/**Function that logs a description of a test, then number of passes,
then number of fails followed by an empty line. Returns nothing.**/
function logTestRes(description, passes, fails){
  console.log(`For ${description}:`);
  console.log(`\t${passes} passes`);
  console.log(`\t${fails} fails\n\n`);
  return;
}

/**Function for testing that inputArray is an array.
It also test that it contains at least minElems items.
arrayText is used for describing the element (assumed array) that is being tested.
Its value should either equal TESTMAIN
or TESTSUBPRE followed by an integer followed by TESTSUBPOST.
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
    return `${arrayText} (array) is expected to contain at least ${minElems} elements`;
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
    return ERR_SELERR + "Do not pass more than three arguments.";
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
        return `${JSON.stringify(inputTwo)} is not in the list of allowed tags (TAGTYPES).`;
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
    return `"${JSON.stringify(inputOne)}" (without the quotes) is not a string.`;
  }
  else if(inputOne[0] !== "."){
    return `"${inputOne}" does not start with a dot.`;
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

  /*Iterate over each element in selectorArray looking for format errors and constraint errors.
  Could probably use an ordinary for-loop instead of forEach().*/
  selectorArray.forEach(function(subElem) {
    if(constraint === ABSENT){
      errorMsg = testSelector(CLASS, subElem);
      if(errorMsg){
        validity = false;    /*Since a correct classname cannot be determined, validity has an unknown value and is assumed to be false.*/
        console.log(`${ERR_VALIDERR}While checking absence - ${errorMsg}`);
      }
      else{
        /*Test if subElem exists in the document*/
        if($(subElem).length){
          validity = false;
          console.log(`${ERR_VALIDERR}There exists elements of class ${subElem}.`);
        }

      }
    }
    else{
      /*Test that subElem is an array with at least two elements.*/
      errorMsg = testBundle(subElem, `Subelement ${counter} of the function argument`, 2);

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
            /*This should never happen unless there is something wrong with the JQuery selections.*/
            validity = false;
            console.log(ERR_VALIDERR + "The function suggests that the specified selector has more elements than the number of elements of its class.");
          }
          else if(classCount > tagCount){
            validity = false;
            console.log(`${ERR_VALIDERR}There exists ${subElem[1]} elements that has the wrong html tag.`);
          }
          else{
            /*Test presence of subElem*/
            if((constraint === PRESENT || constraint === UNIQUE) && tagCount === 0){
              validity = false;
              console.log(`${ERR_VALIDERR}Selector "${subElem[0] + subElem[1]}" does not exist in the document.`);
            }
            /*Test uniqueness of subElem*/
            if((constraint === UNIQUE || constraint === NON_PLURAL) && tagCount > 1){
              validity = false;
              console.log(`${ERR_VALIDERR}Selector "${subElem[0] + subElem[1]}" is not unique in the document.`);
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
  let errPre = "runTest" + ERR_POST;
  /*Test that the given fName is a function name in the global const ALLTESTS.*/
  if(!(ALLTESTS.includes(fName))){
    console.log(errPre + fName + " is not in the ALLTESTS array.");
    return false;
  }

  /*Test that the description is a string*/
  if(typeof(description) !== "string"){
    console.log(errPre + "Its second argument should be a string.");
    return false;
  }

  /*Test that the final element is a boolean*/
  if(typeof(passExpected) !== "boolean"){
    console.log(errPre + "Its fourth argument should be a boolean.");
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
  const resArray = [];    /*Array used for logging the number of successful and failed tests*/

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
  resArray.push(runTest(BTEST, bTestPre + "a non-number as its third argument:", [BAD_ARR, aString, "1"]));
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
  resArray.push(runTest(BTEST, bTestPre + "a string that fits the regex matching:", [BAD_ARR, aString], true));
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
  const resArray = [];    /*Array used for logging the number of successful and failed tests*/

  /*Testing selectorTest()*/
  console.log("---Testing testSelector() expecting error messages.---");
  resArray.push(runTest(STEST, sTestPre + "a negative (non-allowed) inputType:", [BAD_INPUT, BAD_STR]));
  resArray.push(runTest(STEST, sTestPre + "more than three arguments:", [CLASS, BAD_STR, BAD_STR, BAD_STR]));
  resArray.push(runTest(STEST, sTestPre + "three arguments with the first being CLASS:", [CLASS, BAD_STR, BAD_STR]));
  resArray.push(runTest(STEST, sTestPre + "two arguments with the first being COMPOSITE:", [COMPOSITE, BAD_STR]));
  resArray.push(runTest(STEST, sTestPre + "a third argument that is not in the TAGTYPES list:", [COMPOSITE, BAD_STR, BAD_TAG]));
  resArray.push(runTest(STEST, sTestPre + "a second element that is not a string:", [CLASS, BAD_INT]));
  resArray.push(runTest(STEST, sTestPre + "a second element that is an array:", [CLASS, BAD_ARR]));
  resArray.push(runTest(STEST, sTestPre + "a second element that does not start with a dot:", [CLASS, BAD_STR]));

  /*Arg combos that are supposed to be valid (returning an empty string)*/
  console.log("---Testing testSelector() expecting no error message.---");
  resArray.push(runTest(STEST, sTestPre + "CLASS followed by a classname:", [CLASS, BAD_SSTR], true));
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
  const resArray = [];    /*Array used for logging the number of successful and failed tests*/

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
  /*Expecting errors from testBundle() or testSelector().
  Since it is assumed that the same code that handles PRESENT also handles UNIQUE, NON_PLURAL and FREE,
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
  resArray.push(runTest(VTEST, vTestPre + "an absent element:", [NON_PLURAL, [[DEF_TAG, tZero]]], true));
  resArray.push(runTest(VTEST, vTestPre + "a unique element:", [NON_PLURAL, [[DEF_TAG, tOne]]], true));
  resArray.push(runTest(VTEST, vTestPre + "a non-unique element:", [NON_PLURAL, [[DEF_TAG, tTwo]]]));
  resArray.push(runTest(VTEST, vTestPre + "a unique element that has a non-unique class:", [NON_PLURAL, [[DEF_TAG, tBody]]]));
  /*multi-elems...*/
  console.log("---Subtests for multi-element arrays---");
  resArray.push(runTest(VTEST, vTestPre + "several absent elements:", [NON_PLURAL, [[DEF_TAG, tZero], [DEF_TAG, tMiss]]], true));
  resArray.push(runTest(VTEST, vTestPre + "a combo of absent and present (including plural) elements:", [NON_PLURAL, [[DEF_TAG, tTwo], [DEF_TAG, tMiss], [DEF_TAG, tZero], [DEF_TAG, tOne]]]));
  resArray.push(runTest(VTEST, vTestPre + "several present elements, one being plural:", [NON_PLURAL, [[DEF_TAG, tOne], [DEF_TAG, tTwo]]]));
  resArray.push(runTest(VTEST, vTestPre + "several unique elements:", [NON_PLURAL, [[DEF_TAG, tOne], [DEF_TAG, tUno]]], true));
  resArray.push(runTest(VTEST, vTestPre + "a combo of absent, present and non-specific (multi-tag) elements:", [NON_PLURAL, [[DEF_TAG, tBody], [DEF_TAG, tTwo], [DEF_TAG, tOne], ["body", tBody], [DEF_TAG, tZero], [DEF_TAG, tUno]]])); /*The console might log two of these on the same line as repeats.*/

  /*Testing for elements with no constraint (except that for each, there should be no other elements of that class.)*/
  console.log("---Testing testValidity() with FREE as constraint (no constraint)---");
  /*one-elems...*/
  console.log("\n---Subtests for one-element arrays---");
  resArray.push(runTest(VTEST, vTestPre + "an absent element:", [FREE, [[DEF_TAG, tZero]]], true));
  resArray.push(runTest(VTEST, vTestPre + "a unique element:", [FREE, [[DEF_TAG, tOne]]], true));
  resArray.push(runTest(VTEST, vTestPre + "a non-unique element:", [FREE, [[DEF_TAG, tTwo]]], true));
  resArray.push(runTest(VTEST, vTestPre + "a unique element that has a non-unique class:", [FREE, [[DEF_TAG, tBody]]]));
  /*multi-elems...*/
  console.log("---Subtests for multi-element arrays---");
  resArray.push(runTest(VTEST, vTestPre + "several absent elements:", [FREE, [[DEF_TAG, tZero], [DEF_TAG, tMiss]]], true));
  resArray.push(runTest(VTEST, vTestPre + "a combo of absent and present elements:", [FREE, [[DEF_TAG, tTwo], [DEF_TAG, tMiss], [DEF_TAG, tZero], [DEF_TAG, tOne]]], true));
  resArray.push(runTest(VTEST, vTestPre + "several present elements:", [FREE, [[DEF_TAG, tOne], [DEF_TAG, tTwo]]], true));
  resArray.push(runTest(VTEST, vTestPre + "several unique elements:", [FREE, [[DEF_TAG, tOne], [DEF_TAG, tUno]]], true));
  resArray.push(runTest(VTEST, vTestPre + "a combo of absent, present and non-specific (multi-tag) elements:", [FREE, [[DEF_TAG, tBody], [DEF_TAG, tTwo], [DEF_TAG, tOne], ["body", tBody], [DEF_TAG, tZero], [DEF_TAG, tUno]]])); /*The console might log two of these on the same line as repeats.*/

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

/**Function for testing if the browser handles custom properties.
It will display an alert if the test failed.
The code is more complex than ideal since the css method doesn't specify the format of the return value
(it is assumed that the browser does it in the same way every time, though).
The argument should always be $baseBody from the ready function
(at least if the callee doesn't know the specifics of the function, the html and the css).
Returns false if the argument is not a jQuery selection or the constraint for the test section is broken
(should be ABSENT before and after the compatibility check, UNIQUE during the check).
Otherwise it returns true.**/
function testBrowser(selection){
  /*Test that the argument is actually a selection*/
  if(!(selection instanceof jQuery)){
    console.log(`testBrowser${ERR_POST}The argument must be a jQuery selection.`);
    return false;
  }

  /**Test that there is no test section**/
  if(TESTING){
    if(!(testValidity(ABSENT, [".test"]))){
      return false;
    }
  }

  /*Add test section at the start of the body*/
  progress = "browser compatibility test";
  before = true;
  selection.prepend('<section class="test"></section>');

  /**Test that the test section was added.**/
  if(TESTING){
    if(!(testValidity(UNIQUE, [["section", ".test"]]))){
      return false;
    }
  }

  let realCol = $(".test").css("background-color");
  let browserCol = selection.css("background-color");

  /**Test that an element (selection) using custom properties
  has the same colors as an element using direct assignment (.test)**/
  if(browserCol !== realCol){
    alert("Your browser doesn't support custom properties in the layout. The layout will not look as intended. See https://developer.mozilla.org/en-US/docs/Web/CSS/--*");
  }

  $(".test").remove();    /*Remove the test section*/
  before = false;         /*Test completed*/

  /**Test that the test section was successfully removed.**/
  if(TESTING){
    if(!(testValidity(ABSENT, [".test"]))){
      return false;
    }
  }

  return true;
}

/**Function for giving an alert if local file reading was used in an online environment.
When the current file reading gets disabled,
the alert should instead be about a failed load (if this function is kept around).
**/
function alertWebReadError(){
  /*Change file reading code and this message appropriately for online environment.*/
  alert("Web server file reading error." + BUGALERT_POST);
  return;
}


/*window.addEventListener('load', function () {
  function appendModule(code) {
    console.log("apped");
    let url = URL.createObjectURL(new Blob([code], { type: 'text/javascript' })); // create url from code

    let script = document.createElement('script');
    script.type = 'module';
    script.src = url;
    document.head.appendChild(script);
  }

  let scripts = document.querySelectorAll('script');
  console.log(scripts);
  for (let script of scripts) {
    script.parentElement.removeChild(script);
    if (script.getAttribute('type') !== 'module') continue; // found normal script
    if (script.getAttribute('src') !== null) {
      console.log("loadin");
      // load a file
      var request = new XMLHttpRequest();
      console.log("loadin2");
      request.open('GET', script.getAttribute('src'), false); //+ '?_=' + Date.now(), true);
      console.log("loadin3");
      request.onload = function () {
        if (this.status >= 200 && this.status < 400) {
          // file loaded
          console.log("processing");
          appendModule(this.response);
          console.log("processing2");
        } else {
          // error loading file
          console.log("error " + this.status);
          console.error('Not able to load module:', script.getAttribute('src'));
          console.log("error2");
        }
      };
      console.log("loadin4");
      request.onerror = function () {
        // error loading file
        console.error('Not able to load module:', script.getAttribute('src'));
      };
      request.send();
    }
  }
  console.log(scripts);
});*/


/*** Generate additional html for the current site ***/
$(document).ready( () => {
  console.log("aaaaaaaaaaaaaaaaa");
  /*import TestError from './js/errors.js';*/
  //appendModule("./js/errors.js");
  console.log("bbbbbbbbbbbbbbbbbb");
  //import TestError from './js/errors';
  let pageName = "";
  /**Find out what page is being readied**/
  try{
    pageName = findPageName(window.location.pathname);
  }
  catch(e){
    if(e instanceof TestError){
      console.log("TestError" + e.message);
    }
    else{
      console.log("Exception of unexpected type was thrown");
    }
    return;
  }

  console.log("control has reached here.");


  /***Initial test section***/
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
  if(!(testBrowser($baseBody))){
    logProgress();
    return;
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
        if(target.endsWith(pageName)){
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
    if(!(readPartial(["tops", "top wrapper structure"], $topWrap, [["div", ".scroll-menu"]]))){
      return;
    }
    else{
      before = false;
    }

    /**If file read succeeded, add content inside the top wrapper structure**/
    if(readSuccess){
      progress = "adding page-specific code to the top wrapper (navigation of dynamic content)";
      before = true;

      /*Test that the page is one of the ones that is expected to have a top wrapper.
      Find the file name for the top wrapper content.*/
      let buttonFile = "";
      let fileText = "";

      if(pageName === JOBPAGE){
        buttonFile = "top_jobs";
        fileText = "jobs top wrapper content";
      }
      else if(pageName === EMPPAGE){
        buttonFile = "top_emps";
        fileText = "employees top wrapper content";
      }

      /*If there's no defined file for the top wrapper content of the current page, stop loading the page.*/
      if(!buttonFile || !fileText){
        alert("Top wrapper exists on a page that doesn't have a defined buttonFile or doesn't have corresponding fileText." + BUGALERT_POST);
        logProgress();
        return;
      }

      /**Populate top wrapper from file**/
      if(!(readPartial([buttonFile, fileText], $(".scroll-menu")))){
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
    const mainElems = [["section", ".illustration"], ["section", ".info"],
    ["section", ".footer"], ["div", ".ill-text"], ["div", ".ill-link"]];
    if(!(readPartial(["content", "main content"], $mainWrap, mainElems))){
      return;
    }
    else{
      before = false;
    }

    /**If the file read succeeded, add page-specific content to the current content structure.**/
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
      if(!(readContent(contentFile))){    /*Since reading content can also be part of event handling, a function was made for it.*/
        logProgress();
        return;
      }

      before = false;
    }

    /**Create additional home page content**/
    if(readSuccess && pageName === HOMEPAGE){
      /*Make options section*/
      progress = "adding options and storygrid sections to home page";
      before = true;

      /*Test that the DOM doesn't yet contain the elements that are supposed to get added.*/
      if(TESTING){
        if(!(testValidity(ABSENT, [".options", ".storygrid"]))){
          logProgress();
          return;
        }
      }

      /*Add options and storygrid sections directly before the footer element*/
      $(".footer").before('<section class="options"></section><section class="storygrid"></section>');

      /**Read options content from file**/
      if(!(readPartial(["opts", "options"], $(".options")))){
        return;
      }
      else{
        before = false;
      }

      /**Populate employee storygrid**/
      if(readSuccess){
        progress = "populating storygrid";
        before = true;
        $sGrid = $(".storygrid");

        /*Add storyboxes*/
        if(!(readPartial(["empboxes", "employee storybox structure"], $sGrid))){
          return;
        }

        /*Copy the storybox structure for each additional employee*/
        let boxCode = $sGrid.html();

        for(let i = 1; i < EMPS.length - 1; i++){
          $sGrid.append(boxCode);
        }

        /*Add a header*/
        $sGrid.prepend("<h2>Innspill fra de ansatte</h2>");
      }

      /**Read storylink file and update all storylinks**/
      if(readSuccess){
        if(!(readPartial("storylink", $(".storylink")))){
          return;
        }

        /*Update paragraphs and signature for each employee box*/
        if($(".employee").length !== EMPS.length - 1){
          alert("Home page has the wrong number of employee boxes." + BUGALERT_POST);
        }
        else{
          for(let i = 0; i < EMPS.length - 1; i++ ){
            let paragraphs = readParas(INFO_PATH + "ansatte/" + EMPS[i] + TXT_END);

            if(paragraphs === null){
              /*If the file reading failed, disable further file reading.*/
              readSuccess = false;

              /*Make an alert for the current environment*/
              if(ONLINE){
                alertWebReadError();
              }
              else{
                alert("Failed to load employee-specific content from its file.");
              }
              break;
            }

            let $empbox = $(".employee").eq(i);
            $empbox.find("p.excerpt").append(paragraphs[0]);
            $empbox.find("p.sign").append("-" + capitalizeFirstLetter(EMPS[i]));

            /*Update the address of the storylink*/
            $empbox.find(".storylink").children("a").attr("href", "./ansatte.html?userid=" + i);
          }
        }

        before = false;
      }
    }
  }


  /***Create services content for job page or activity page.***/
  if(readSuccess && (pageName === JOBPAGE || pageName === ACTPAGE)){
    progress = "adding service section to JOBPAGE or ACTPAGE";
    before = true;

    /*Test that the DOM doesn't yet contain a service section.*/
    if(TESTING){
      if(!(testValidity(ABSENT, [".services"]))){
        logProgress();
        return;
      }
    }

    /*Add a service section (placement depends on the kind of page)*/
    let servText = '<hr /><section class="services"><h2>Tjenester</h2></section>';
    if(pageName === JOBPAGE){
      $(".footer").before(servText);
    }
    else if(pageName === ACTPAGE){
      $banWrap.after(servText);
    }
    else{
      alert("Handling of services on this page is missing." + BUGALERT_POST);
      logProgress();
      return;
    }

    /*Add content to the service section*/
    progress = "populating service section on JOBPAGE or ACTPAGE";
    before = true;

    /*Update service section based on page*/
    if(pageName === JOBPAGE){
      /*Since no button should be active yet, the user is told that the section is empty for now.
      The empty paragraph is there to push the text to the next grid position to prevent a small column width.
      It is not an optimal solution, but it isn't straightforward to get something better within the grid.*/
      $(".services").append("<p></p><p>Ingen tjenester blir vist før du velger en arbeidsplass fra knapperaden.</p>");
      before = false;
    }
    else if(pageName === ACTPAGE){
      if(!(readServices(ACTPAGE))){
        logProgress();
        return;
      }

      before = false;
    }
    else{
      alert("Handling of services on this page is missing." + BUGALERT_POST);
      logProgress();
      return;
    }
  }


  /***Event handling for workplaces***/
  if(readSuccess && pageName === JOBPAGE){
    progress = "adding event handling to the job page";
    before = true;

    /*Confirm that the page has the expected wrappers*/
    if(!(testValidity(UNIQUE, [["section", ".illustration"], ["div", ".ill-text"], ["div", ".ill-link"], ["section", ".info"], ["section", ".footer"], ["section", ".services"], ["div", ".scroll-menu"]]))){
      logProgress();
      return;
    }
    else{
      const $wbuttons = $(".scroll-menu").find("a");

      for(let i=0; i < $wbuttons.length; i++){
        $wbuttons.eq(i).on("click", () => {
          /*Make the clicked button the only active one*/
          $wbuttons.removeClass("active");
          $wbuttons.eq(i).addClass("active");

          /*Update initial content sections*/
          let fileName = $wbuttons.eq(i).text().toLowerCase();

          if(!(readContent(fileName))){
            logProgress();
            return;
          }

          /*Update serviceboxes*/
          if(readSuccess){
            if(!(readServices(JOBPAGE, $wbuttons.eq(i).text()))){
              logProgress();
              return;
            }
          }
        });
      }
    }

    before = false;
  }


  /***Create employee window with content inside the employee wrapper***/
  if(readSuccess && $empWrap.length){
    progress = "adding structural code to the employee wrapper";
    before = true;

    /**Read employee structure file**/
    if(!(readPartial(["empwindow", "employee window structure"], $empWrap))){
      return;
    }
    else{
      before = false;
    }

    /*Find out what user to display based on url attribute*/
    let current = getUserId();
    if(current === null){
      current = EMPS.length - 1; /*Start at intro page*/
    }
    else if (current < 0 || current >= EMPS.length - 1) {
      alert("userid attribute in url is outside the range of valid userids.");
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
      alert("Employee navigation is broken." + BUGALERT_POST);
    }
    else{
      $empButtons.eq(0).attr("href", "./ansatte.html?userid=" + (prev));
      $empButtons.eq(1).attr("href", "./ansatte.html?userid=" + (next));
    }

    /*Add the storybox class to the employee wrapper*/
    $empWrap.addClass("storybox");

    /**Append employee window code to the employee window**/
    if(readSuccess){
      progress = "adding employee-specific content to the employee window"
      before = true;

      const paragraphs = readParas(INFO_PATH + "ansatte/" + EMPS[current] + TXT_END);

      if(paragraphs === null){
        /*If the file reading failed, give an error message alert and disable further file reading.*/
        readSuccess = false;
        before = false;

        /*Make alert for the current environment*/
        if(online){
          alertWebReadError();
        }
        else{
          alert("Failed to read employee content. Unknown cause.");
        }
      }
      else if(!paragraphs.length){
        console.log("The employee text file seems to be empty.");
        logProgress();
        return;
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
  }
});
