/**Read banner file.**/
let bannerCode = readFile(PART_PATH + "banner" + PART_END);

if(bannerCode === null){
  /*If the file reading failed, give an error message alert and disable further file reading.*/
  readSuccess = false;
  before = false;

  /*Make an alert for the current environment*/
  if(online){
    webReadAlert();
  }
  else{
    alert("Failed to load page banner. There might be browser restrictions on reading local files.");
  }
}
else{
  /*Test that the document doesn't contain the class for the banner navbar.*/
  if(testing){
    if(!(testValidity(ABSENT, [".nav-top"]))){
      logProgress();
      return;
    }
  }

  /*Add banner code.*/
  $banWrap.append(bannerCode);
  before = false;

  /*Test that the banner code added the banner nav bar.*/
  if(testing){
    if(!(testValidity(UNIQUE, [["nav", ".nav-top"]]))){
      logProgress();
      return;
    }
  }
}

/**Read top-wrapper file**/
let topCode = readFile(PART_PATH + "tops" + PART_END);

if(topCode === null){
  /*If the file reading failed, give an error message alert and disable further file reading.*/
  readSuccess = false;
  before = false;

  /*Make alert for current environment*/
  if(online){
    webReadAlert();
  }
  else{
    alert("Failed to load top wrapper structure. Unknown cause.");
  }
}
else{
  /*Test that the DOM doesn't yet contain the scroll-menu wrapper*/
  if(testing){
    if(!(testValidity(ABSENT, [".scroll-menu"]))){
      logProgress();
      return;
    }
  }

  /*Add top-wrapper code*/
  $topWrap.append(topCode);
  before = false;

  /*Test that the DOM has gotten a scroll-menu wrapper*/
  if(testing){
    if(!(testValidity(UNIQUE, [["div", ".scroll-menu"]]))){
      logProgress();
      return;
    }
  }
}

/**Read content file for top wrapper**/
let buttonCode = readFile(PART_PATH + buttonFile + PART_END);

if(buttonCode === null){
  /*If the file reading failed, give an error message alert and disable further file reading.*/
  readSuccess = false;
  before = false;

  /*Make alert for the current environment*/
  if(online){
    webReadAlert();
  }
  else{
    alert("Failed to load top wrapper content. Unknown cause.");
  }
}
else{
  $(".scroll-menu").append(buttonCode);
  before = false;

  /*Since there are no common classes for the buttonCode content, no tests are made.*/
}

/**Read main content file**/
let mainCode = readFile(PART_PATH + "content" + PART_END);

if(mainCode === null){
  /*If the file reading failed, give an error message alert and disable further file reading.*/
  readSuccess = false;
  before = false;

  /*Make alert for the current environment*/
  if(online){
    webReadAlert();
  }
  else{
    alert("Failed to load main content. Unknown cause.");
  }
}
else{
  /*Test that the DOM doesn't yet contain the elements that are supposed to be in the content code.*/
  if(testing){
    let classes = [".illustration", ".info", ".footer", ".ill-text", ".ill-link"];
    if(!(testValidity(ABSENT, classes))){
      logProgress();
      return;
    }
  }

  /*Add content to the content wrapper*/
  $mainWrap.append(mainCode);
  before = false;

  if(testing){
    const illWrap = ["section", ".illustration"];
    const infoWrap = ["section", ".info"];
    const foot = ["section", ".footer"];
    const illText = ["div", ".ill-text"];
    const illLink = ["div", ".ill-link"];

    if(!(testValidity(UNIQUE, [illWrap, infoWrap, foot, illText, illLink]))){
      logProgress();
      return;
    }
  }
}

/*In readContent:*/
/*Read footer file*/
let footCode = readFile(PART_PATH + "footer.html");

if(footCode === null){
  return false;
}

/*Read file containing a separator for contact fields*/
let sepCode = readFile(PART_PATH + "seps.html");

if(sepCode === null){
  return false;
}

/*Read options file*/
let optCode = readFile(PART_PATH + "opts.html");

if(optCode === null){
  /*If the file reading failed, give an error message alert and disable further file reading.*/
  readSuccess = false;
  before = false;

  /*Make alert for the current environment*/
  if(online){
    webReadAlert();
  }
  else{
    alert("Failed to load options section for home page. Unknown cause.");
  }
}
else{
  /*Insert the option code directly before the footer element*/
  $(".footer").before(optCode);
  before = false;
}


/*Make storygrid section*/
progress = "adding storygrid section to home page";
before = true;

let gridCode = readFile(PART_PATH + "storygrid.html");

if(gridCode === null){
  /*If the file reading failed, give an error message alert and disable further file reading.*/
  readSuccess = false;
  before = false;

  if(online){
    webReadAlert();
  }
  else{
    alert("Failed to load storygrid structure for home page. Unknown cause.");
  }
}
else{
  /*Insert the storygrid code directly before the footer element*/
  $(".footer").before(gridCode);
  before = false;
}


/*Add storyboxes*/
let boxCode = readFile(PART_PATH + "empboxes.html");

if(boxCode === null){
  /*If the file reading failed, give an error message alert and disable further file reading.*/
  readSuccess = false;
  before = false;

  if(online){
    webReadAlert();
  }
  else{
    alert("Failed to load storybox structure for home page. Unknown cause.");
  }
}

/*Add storylinks to each storybox*/
let linkCode = readFile(PART_PATH + "storylink.html");

if(linkCode === null){
  /*If the file reading failed, give an error message alert and disable further file reading.*/
  readSuccess = false;
  before = false;

  if(online){
    webReadAlert();
  }
  else{
    alert("Failed to load storylink content for storyboxes on the home page. Unknown cause.");
  }
}
else{
  $sGrid.find(".storylink").append(linkCode);
}
