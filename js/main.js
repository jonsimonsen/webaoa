/*Generate html for storylinks for user stories*/
$(document).ready( () => {

  /*Add banner*/
  const START = `<div class="banner">
  <a href="./index.html">
    <img src="Bilder/logo_aoa.jpg" alt="Logoen til Arbeid og Aktivitet">
  </a>
  <nav class="nav-top">
    <a href="./index.html#top">Hjem</a>
    <a href="./dreis.html">Arbeid</a>
    <a href="./aktiv.html">Aktivitet</a>
    <a href="./index.html#employee">Ansatte</a>
    <a href="./index.html#con_aoa">Kontakt</a>
  </nav>
</div>`;

$(".banner-wrapper").append(START);

  /*Add arrow symbol to each storylink*/
  $(".storylink").append('<div class="arrow"></div>');

  /*Add the actual link to each storylink by reading the linksrc attribute.*/
  $(".storylink").each( function(index) {
    $(this).append('<a href=' + $(this).attr("linksrc") + '>Les mer...</a>');
  });
});
