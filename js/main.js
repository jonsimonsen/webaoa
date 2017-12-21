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

  /*Site wide content*/
  const START = `<div class="banner">
  <a href="./index.html">
    <img src="Bilder/logo_aoa.jpg" alt="Logoen til Arbeid og Aktivitet">
  </a>
  <nav class="nav-top">`;

  const END = `</nav>
</div>`;

  /*Map with link address as key and link text as value*/
  let links = new Map();
  links.set("./index.html", "Hjem");
  links.set("./arbeid.html", "Arbeid");
  links.set("./aktiv.html", "Aktivitet");

  let total = START;
  let contact = "";

  /*Add links, but give self-pointing links class unlink (not clickable)*/
  links.forEach(function(text, address) {
    total += '<a href="' + address;

    if(window.location.pathname.endsWith(address.slice(1))) {
      total += '" class="unlink';
    }

    total += '">' + text + '</a>';
  });

  /*Add contact link. Should not be clickable if there is no contact info on the current page.*/
  if(page === "Arbeid og Aktivitet") {
    total += '<a href="#con_aoa">Kontakt</a>';
  }
  else if (page === "DREIS") {
    total += '<a href="#con_dreis">Kontakt</a>';
  }
  else if (page === "DagsJobben") {
    total += '<a href="#con_djob">Kontakt</a>';
  }
  else {
    total += '<a href="#" class="unlink">Kontakt</a>';
  }

  total += END;

  /*Append the banner to its wrapper div*/
  $(".banner-wrapper").append(total);

  /*** Footer ***/

  /*Add header*/
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
  $(".footer").attr("padr") + SEPS + '<span class="tlf">Telefon:</span> ' +
  $(".footer").attr("tel") + "</p>");

  /*** Story link creation ***/

  /*Add arrow symbol to each storylink*/
  $(".storylink").append('<div class="arrow"></div>');

  /*Add the actual link to each storylink by reading the linksrc attribute.*/
  $(".storylink").each( function(index) {
    $(this).append('<a href=' + $(this).attr("linksrc") + '>Les mer...</a>');
  });

});
