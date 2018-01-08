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

/*Function for parsing a text. Returns the index of the last character of the first paragraph. The separator is a double newline.*/
function parsePara(text){
  let lines = text.split("\n");
  let para = "";
  let paras = [];

  for(let i = 0; i < lines.length; i++){
    if(lines[i] === ""){
      if(para !== ""){
        paras.push(para);
      }
      para = "";
    }
    else{
      para += lines[i] + "\n";
    }
  }

  if(para !== ""){
    paras.push(para);
  }

  paras.forEach(function(graph) {
    console.log(graph);
    console.log("-");
  });
}

/*Generate html for storylinks for user stories*/
$(document).ready( () => {

  /*** Banner ***/

  /*Read banner file and append it to its wrapper div.*/
  let bannerCode = readFile("./banner.html");
  $(".banner-wrapper").append(bannerCode);

  let links = $(".nav-top").children();

  /*Add links to banner.*/
  for(let i = 0; i < links.length; i++){
    let target = $(links).eq(i).attr("href");

    if(typeof target !== typeof undefined && target !== false){
      /*Give self-pointing links class unlink (not clickable).*/
      if(window.location.pathname.endsWith(target.slice(1))){
        $(links).eq(i).addClass("unlink");
      }
    }
    else{
      /*Give classes with a footer a contact link. Otherwise, make an unclickable link.*/
      let dest = "#";

      if($(".footer")[0]){
        dest += $(".footer").attr("id");
      }
      else{
        $(links).eq(i).addClass("unlink");
      }

      $(links).eq(i).attr("href", dest);
    }
  }

  /*** Footer ***/

  /*Add footer*/
  if($(".footer")[0]) {
    /*Read footer file and append it to the footer div.*/
    let footerCode = readFile("./footer.html");
    $(".footer").append(footerCode);

    /*Add social media links (initially Facebook)*/
    let fadr = $(".footer").attr("data-fb");

    if ((typeof fadr !== typeof undefined) && fadr !== false) {
      $(".fb-link").attr("href", fadr);
      $(".fb-link").attr("alt", $(".footer").attr("data-avd") + " på Facebook");
    }
    else{
      $(".fb-link").addClass("usynlig");
    }
  }

  /*Add contact info*/
  const SEPS = ' <span class="sep">| </span><span class="newline"><br /></span>';

  $(".adr").append($(".footer").attr("data-adr") + SEPS);
  $(".padr").append($(".footer").attr("data-padr") + SEPS);
  $(".tlf").append($(".footer").attr("data-tel"));

  /*** Story link creation ***/

  /*Read storylink file and append it to the storylink divs*/
  if($(".storylink")[0]){
    let storyCode = readFile("./storylink.html");
    $(".storylink").append(storyCode);

    for(let i = 0; i < $(".storylink").length; i++){
      /*eq is used to target a single tag of the storylink class and being able to use the selector methods on it*/
      let dest = $(".storylink").eq(i).attr("data-src");
      $(".storylink").eq(i).find("a").attr("href", dest);
    }
  }

  testy = readFile("./Info/alice.txt");
  parsePara(testy);

});
