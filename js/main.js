/*** Main JS file for the website of "Arbeid og Aktivitet, Tromsø" (by Jon Simonsen) ***/


/*** Functions made by others ***/

/*Function for reading a file (Should use a different one/load when going live)*/
/*https://stackoverflow.com/questions/14446447/how-to-read-a-local-text-file*/
function readFile(file){
  let rawFile = new XMLHttpRequest();
  let allText = "";
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    if(rawFile.readyState === 4) {
      if(rawFile.status === 200 || rawFile.status == 0) {
        allText = rawFile.responseText;
      }
    }
  }
  rawFile.send(null);
  return allText;
}

/*Function for capitalizing a string (Make the first letter uppercase)*/
/*https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript*/
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}


/*** Functions made by Jon Simonsen ***/

/*Function for reading a file and returning an array of paragraphs using double newlines as separators.*/
/*Note that the function currently assumes that XMLHttpRequest interprets a newline as "\r\n"*/
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

  if(start <= 0){
    return null;
  }
  else if(start > url.length - (match.length + 1)){ /*+1 since indices start at 0 while lengths start at 1.*/
    alert("Incorrect url. Wrongly named attribute or no value.");
    return null;
  }
  else{
    if(!(url.slice(start,(start + match.length)) === match)){
      alert("Incorrect url. Wrongly named attribute.");
      return null;
    }
    else{
      let candidate = url.slice(start + match.length);

      if(isNaN(candidate)){
        alert("Incorrect url. Either the userid is not a number or the url contains garbage otherwise.");
        return null;
      }
      else{
        return Number(candidate);
      }
    }
  }
}


/***Generate html for banners, footers and other page elements***/
$(document).ready( () => {

  /*** JQuery variables that are used multiple times below. ***/
  /* Should consider testing that there are not multiple footers or hlinks on a single page. */
  let $foot = $(".footer");
  let $empwindow = $(".employees");
  let $sgrid = $(".stories");
  let $hlink = $(".home");


  /*** Global constants ***/

  /*Paths and files for employees*/
  const storyPath = "./Info/";
  const imgPath = "./Temp/";
  const textEnding = ".txt";
  const imgEnding = ".jpg";
  const users = ["alice", "charlie", "espen", "hallstein", "intro"]; /*Should consider reading in the users in some way (possibly by filename)*/


  /*** Banner ***/

  /*Read banner file and append it to its wrapper div.*/
  let bannerCode = readFile("./banner.html");
  $(".banner-wrapper").append(bannerCode);

  $(".nav-top").children().each(function (){
    let target = $(this).attr("href");

    /*Give self-pointing links class unlink (not clickable).*/
    if(typeof target !== typeof undefined && target !== false){
      if(window.location.pathname.endsWith(target.slice(1))){
        $(this).addClass("unlink");
      }
    }
    /*Give classes with a footer a contact link. Otherwise, make an unclickable link.*/
    else {
      let dest = "#";

      if($foot[0]){
        dest += $foot.attr("id");
      }
      else{
        $(this).addClass("unlink");
      }

      $(this).attr("href", dest);
    }
  });


  /*** Footer ***/

  if($foot[0]) {
    /*Read footer file and append it to the footer div.*/
    let footerCode = readFile("./footer.html");
    $foot.append(footerCode);

    /*Add social media links (initially Facebook)*/
    let fadr = $foot.attr("data-fb");
    let $fblink = $(".fb-link");

    if ((typeof fadr !== typeof undefined) && fadr !== false) {
      $fblink.attr("href", fadr);
      $fblink.attr("alt", $foot.attr("data-avd") + " på Facebook");
    }
    else{
      $fblink.addClass("usynlig");
    }

    /*Add contact info*/
    const SEPS = " " + readFile("./seps.html");

    $(".adr").append($foot.attr("data-adr") + SEPS);
    $(".padr").append($foot.attr("data-padr") + SEPS);
    $(".tlf").append($foot.attr("data-tel"));
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

  if($sgrid[0]){
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
  if($empwindow[0]){

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

  /*Home link creation*/
  if($hlink[0]){
    $hlink.append(readFile("./homelink.html"));
  }
});
