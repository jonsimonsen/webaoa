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

  /*Add links to banner.*/
  for(let i = 0; i < links.length; i++){
    let target = $(links[i]).attr("href");

    if(typeof target !== typeof undefined && target !== false){
      /*Give self-pointing links class unlink (not clickable).*/
      if(window.location.pathname.endsWith(target.slice(1))){
        $(links[i]).addClass("unlink");
      }
    }
    else{
      /*Give classes with a footer a contact link. Otherwise, make an unclickable link.*/
      let dest = "#";

      if($(".footer")[0]){
        dest += $(".footer").attr("id");
      }
      else{
        $(links[i]).addClass("unlink");
      }

      $(links[i]).attr("href", dest);
    }
  }

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
  const SEPS = ' <span class="sep">| </span><span class="newline"><br /></span>';

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
