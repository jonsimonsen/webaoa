/*Generate html for storylinks for user stories*/
$(document).ready( () => {

  /*Banner*/

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
  links.set("./dreis.html", "Arbeid");
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
  if(window.location.pathname.endsWith("/index.html")) {
    total += '<a href="#con_aoa">Kontakt</a>';
  }
  else if (window.location.pathname.endsWith("/dreis.html")) {
    total += '<a href="#con_dreis">Kontakt</a>';
  }
  else if (window.location.pathname.endsWith("/dagsjobb.html")) {
    total += '<a href="#con_djob">Kontakt</a>';
  }
  else {
    total += '<a href="#" class="unlink">Kontakt</a>';
  }

  total += END;

  /*Append the banner to its wrapper div*/
  $(".banner-wrapper").append(total);

  /*Add arrow symbol to each storylink*/
  $(".storylink").append('<div class="arrow"></div>');

  /*Add the actual link to each storylink by reading the linksrc attribute.*/
  $(".storylink").each( function(index) {
    $(this).append('<a href=' + $(this).attr("linksrc") + '>Les mer...</a>');
  });
});
