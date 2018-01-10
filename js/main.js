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

/*Function for reading a file and returning an array of paragraphs using double newlines as separators.*/
/*Note that the function currently assumes that XMLHttpRequest interprets a newline as "\r\n"*/
function readParas(file){
  return readFile(file).split("\r\n\r\n");
}

/*Function for capitalizing a string (Make the first letter uppercase)*/
/*https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript*/
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

/*Generate html for banners, footers and other page elements*/
$(document).ready( () => {

  /*** JQuery variables that are used multiple times below. ***/
  /* Should consider testing that there are not multiple footers or hlinks on a single page. */
  let $foot = $(".footer");
  let $emps = $(".employee");
  let $sgrid = $(".stories");
  let $hlink = $(".home");

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

  /*Add footer*/
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
  }

  /*Add contact info*/
  const SEPS = " " + readFile("./seps.html");

  $(".adr").append($foot.attr("data-adr") + SEPS);
  $(".padr").append($foot.attr("data-padr") + SEPS);
  $(".tlf").append($foot.attr("data-tel"));

  /*** Story link creation. Might come back in later if the links are used in more places ***/

  /*Read storylink file and append it to the storylink divs*/
  /*if($slinks[0]){
    let linkCode = readFile("./storylink.html");
    $slinks.append(linkCode);

    $slinks.each(function (){
      $(this).find("a").attr("href", $(this).attr("data-src"));
    });

  }*/

  /*User story creation*/
  if($emps[0]){
    /*If there is a section on the employee, add all text to the html.*/
    if($("section.employee")[0]){
      let paragraphs = readParas($emps.attr("data-textsrc"));

      /*Add paragraphs to the html code*/
      for(let i=0; i < paragraphs.length; i++){
        if($.trim(paragraphs[i]).length > 0){
          $emps.append("<p>" + paragraphs[i] + "</p>");
        }
      }

      $emps.children("p").last().addClass("sign");

    }
    /*If there isn't a section, add only the first and last(signature) paragraphs.*/
    else{
      if(!($sgrid[0])){
        alert("Bug. Employee class exists outside its intended scope.")
      }
      else{
        /*Append employee box code to the employee boxes*/
        let empCode = readFile("./empboxes.html");
        $emps.append(empCode);

        /*Read storylink file and append it to the storylink divs*/
        let $slinks = $(".storylink");

        if($slinks[0]){
          let linkCode = readFile("./storylink.html");
          $slinks.append(linkCode);
        }

        /*Update the paragraph, link address and signature for each employee based on the text file and html attributes.*/
        let storyPath = $sgrid.attr("data-storypath");
        let ending = $sgrid.attr("data-filetype");

        $emps.each(function (){
          let userName = $(this).attr("data-username");
          let paragraphs = readParas(storyPath + userName + ending);

          /*Update paragraphs in the html code*/
          $(this).children("p.excerpt").append(paragraphs[0]);
          $(this).children("p.sign").append("-" + capitalizeFirstLetter(userName));

          /*Update address of storylink*/
          $(this).children(".storylink").children("a").attr("href", userName + ".html");
        });
      }
    }
  }

  /*Home link creation*/
  if($hlink[0]){
    $hlink.append(readFile("./homelink.html"));
  }
});
