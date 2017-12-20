/*Generate html for storylinks for user stories*/
$(document).ready( () => {

  /*Add banner*/
  const START = `<div class="banner">
  <a href="./index.html">
    <img src="Bilder/logo_aoa.jpg" alt="Logoen til Arbeid og Aktivitet">
  </a>
  <nav class="nav-top">`;

  let links = new Map();
  links.set("./index.html", "Hjem");
  links.set("./dreis.html", "Arbeid");
  links.set("./aktiv.html", "Aktivitet");

  const END = `</nav>
</div>`;

  let total = START;
  let contact = "";

  links.forEach(function(text, address) {
    total += '<a href="' + address;

    if(window.location.pathname.endsWith(address.slice(1))) {
      total += '" class="unlink';
    }

    total += '">' + text + '</a>';
  });

  if(window.location.pathname.endsWith("/index.html")) {
    total += '<a href="#con_aoa">Kontakt</a>';
  }
  else if (window.location.pathname.endsWith("/dreis.html")) {
    total += '<a href="#con_dreis">Kontakt</a>';
  }
  else {
    total += '<a href="#" class="unlink">Kontakt</a>';
  }

  total += END;

  $(".banner-wrapper").append(total);

  /*Add arrow symbol to each storylink*/
  $(".storylink").append('<div class="arrow"></div>');

  /*Add the actual link to each storylink by reading the linksrc attribute.*/
  $(".storylink").each( function(index) {
    $(this).append('<a href=' + $(this).attr("linksrc") + '>Les mer...</a>');
  });
});
