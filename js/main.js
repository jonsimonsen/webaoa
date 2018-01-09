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

/*Generate html for banners, footers and other page elements*/
$(document).ready( () => {

  /*** JQuery variables that are used multiple times below. ***/
  /* Should consider testing that there are not multiple footers or hlinks on a single page. */
  let $foot = $(".footer");
  let $slinks = $(".storylink");
  let $hlink = $(".home");
  let $emps = $(".employee");

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
  const SEPS = ' <span class="sep">| </span><span class="newline"><br /></span>';

  $(".adr").append($foot.attr("data-adr") + SEPS);
  $(".padr").append($foot.attr("data-padr") + SEPS);
  $(".tlf").append($foot.attr("data-tel"));

  /*** Story link creation ***/

  /*Read storylink file and append it to the storylink divs*/
  if($slinks[0]){
    let linkCode = readFile("./storylink.html");
    $slinks.append(linkCode);

    $slinks.each(function (){
      $(this).find("a").attr("href", $(this).attr("data-src"));
    });

  }

  /*User story creation*/
  if($emps[0]){
    /*If there is a section on the employee, add all text to the html.*/
    if($("section.employee")[0]){
      let storyCode = readFile($emps.attr("data-textsrc"));
      let paragraphs = storyCode.split("\r\n\r\n");

      /*Add paragraphs to the html code*/
      for(let i=0; i < paragraphs.length; i++){
        if($.trim(paragraphs[i]).length > 0){
          $emps.append("<p>" + paragraphs[i] + "</p>");
        }
      }

    }
    /*If there isn't a section, add only the first and last(signature) paragraphs.*/
    else{
      $emps.each(function (){
        let storyCode = readFile($(this).attr("data-textsrc"));
        let paragraphs = storyCode.split("\r\n\r\n");

        /*Add paragraphs to the html code*/
        $(this).prepend("<p>" + paragraphs[0] + "</p>");
        $(this).append("<p>" + paragraphs[paragraphs.length - 1] + "</p>");

      });

      $emps.find("p").addClass("excerpt");
    }

    /*Make the last paragraph into a signature*/
    $emps.each(function() {
      $(this).children().last().removeClass("excerpt");
      $(this).children().last().addClass("sign");
    });
  }

  /*Home link creation*/
  if($hlink[0]){
    $hlink.append(readFile("./homelink.html"));
  }
});
