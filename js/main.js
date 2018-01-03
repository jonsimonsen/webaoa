/*Function for reading a file (Should use a different one when going live)*/
function readFile(file){
  let rawFile = new XMLHttpRequest();
  let allText = "";
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    if(rawFile.readyState === 4) {
      if(rawFile.status === 200 || rawFile.status == 0) {
        allText = rawFile.responseText;
      }
      else {
        allText = "";
      }
    }
    else {
      allText = "";
    }
  }
  rawFile.send(null);
  return allText;
}

/*Generate html for storylinks for user stories*/
$(document).ready( () => {

  /*** Identify the current page ***/
  let page = "";
  let path = window.location.pathname;

  if (path.endsWith("/index.html")) {
    page = "Arbeid og Aktivitet";
  }
  else if (path.endsWith("/dreis.html")) {
    page = "DREIS";
  }
  else if (path.endsWith("/dagsjobb.html")) {
    page = "DagsJobben";
  }

  /*** Banner ***/

  /*Map with link address as key and link text as value*/
  let links = new Map();
  links.set("./index.html", "Hjem");
  links.set("./arbeid.html", "Arbeid");
  links.set("./aktiv.html", "Aktivitet");

  let addendum = "";
  let contact = "";
  console.log("before");
  let bannerCode = readFile("./bannerz.html");
  $(".banner-wrapper").append(bannerCode);
  console.log("after");

  /*Add links, but give self-pointing links class unlink (not clickable)*/
  links.forEach(function(text, address) {
    addendum = '<a href="' + address;

    if(window.location.pathname.endsWith(address.slice(1))) {
      addendum += '" class="unlink';
    }

    addendum += '">' + text + '</a>';

    $(".nav-top").append(addendum);
  });

  /*Add contact link. Should not be clickable if there is no contact info on the current page.*/
  if(page === "Arbeid og Aktivitet") {
    $(".nav-top").append('<a href="#con_aoa">Kontakt</a>');
  }
  else if (page === "DREIS") {
    $(".nav-top").append('<a href="#con_dreis">Kontakt</a>');
  }
  else if (page === "DagsJobben") {
    $(".nav-top").append('<a href="#con_djob">Kontakt</a>');
  }
  else {
    $(".nav-top").append('<a href="#" class="unlink">Kontakt</a>');
  }

  /*** Footer ***/

  /*Add footer*/
  $(".footer").append('<h2>Kontakt</h2>');

  /*If a facebook attribute exists, add a link*/
  let fadr = $(".footer").attr("fb");

  if ((typeof fadr !== typeof undefined) && fadr !== false) {
    $(".footer").append('<a href="' + fadr + `" class="logo-link">
      <img src="Bilder/fb_logo.jpg" alt="` + page + ` på Facebook">
    </a>`);
  }

  /*Add contact info*/
  const SEPS = ' <span class="sep">| </span><span class="newline"><br /></span>'

  $(".footer").append('<p>' + $(".footer").attr("adr") + SEPS +
  $(".footer").attr("padr") + SEPS + 'Telefon: <span class="tlf">' +
  $(".footer").attr("tel") + "</span></p>");

  /*** Story link creation ***/

  /*Add arrow symbol to each storylink*/
  $(".storylink").append('<div class="arrow"></div>');

  /*Add the actual link to each storylink by reading the linksrc attribute.*/
  $(".storylink").each( function(index) {
    $(this).append('<a href=' + $(this).attr("linksrc") + '>Les mer...</a>');
  });

});
