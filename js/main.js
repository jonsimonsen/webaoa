/*Function for reading a file (Should use a different one/load when going live)*/
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

/*Generate html for storylinks for user stories*/
$(document).ready( () => {

  /*** Banner ***/

  /*Read banner file and append it to its wrapper div.*/
  let bannerCode = readFile("./banner.html");
  $(".banner-wrapper").append(bannerCode);

  let links = Array.from($(".nav-top").children());
  console.log(links);
  for(let i = 0; i < links.length; i++){
    let target = $(links[i]).attr("href");

    if(typeof target !== typeof undefined && target !== false){
      if(window.location.pathname.endsWith(target.slice(1))){
        $(links[i]).addClass("unlink");
      }
    }
    else{
      if($(".footer")[0]){
        $(links[i]).attr("href", "#" + $(".footer").attr("id"));
      }
      else{
        $(links[i]).attr("href", "#");
        $(links[i]).addClass("unlink");
      }
    }
  }

  /*Give self-pointing links class unlink (not clickable)*/
  /*Array.from($(".nav.top").children()).forEach(function(link) {
    let target = link.attr("href");
    console.log("a");

    if(typeof target !== typeof undefined && target !== false){
      if(window.location.pathname.endsWith(target.slice(1))){
        link.addClass("unlink");
        console.log("ab");
      }
    }
    else{
      if($(".footer")[0]) {
        link.attr("href", $(".footer").attr("id"));
        console.log("aca");
      }
      else {*/
        /*$(this).addClass("unlink");*/
        /*console.log("acb");
      }
    }
  });*/

  /*Add contact link. Should not be clickable if there is no contact info on the current page.*/
  /*let contact = "";
  if($(".footer")[0]) {
    contact = $(".footer").attr("id");
  }
  else {
    contact = '" class="unlink';
  }

  $(".nav-top").append('<a href="#' + contact + '">Kontakt</a>');*/

  /*** Footer ***/

  /*Add footer*/
  /*if($(".footer")[0]) {
    let footerCode = readFile("./footer.html");
    $(".footer").append(footerCode);
    let fadr = $(".footer").attr("data-fb");

    if ((typeof fadr !== typeof undefined) && fadr !== false) {
      $(".socials").append('<a href="' + fadr + `" class="logo-link">
        <img src="Bilder/fb_logo.jpg" alt="` + ` på Facebook">
      </a>`);
  }*/
  /*$(".footer").append('<h2>Kontakt</h2>');*/

  /*If a facebook attribute exists, add a link*/
  let fadr = $(".footer").attr("data-fb");

  if ((typeof fadr !== typeof undefined) && fadr !== false) {
    $(".footer").append('<a href="' + fadr + `" class="logo-link">
      <img src="Bilder/fb_logo.jpg" alt="` + ` på Facebook">
    </a>`);
  }

  /*Add contact info*/
  const SEPS = ' <span class="sep">| </span><span class="newline"><br /></span>'

  $(".footer").append('<p>' + $(".footer").attr("data-adr") + SEPS +
  $(".footer").attr("data-padr") + SEPS + 'Telefon: <span class="tlf">' +
  $(".footer").attr("data-tel") + "</span></p>");

  /*** Story link creation ***/

  /*Add arrow symbol to each storylink*/
  $(".storylink").append('<div class="arrow"></div>');

  /*Add the actual link to each storylink by reading the linksrc attribute.*/
  $(".storylink").each( function(index) {
    $(this).append('<a href=' + $(this).attr("linksrc") + '>Les mer...</a>');
  });

});
