# webaoa
Using my repo for these files for now. The project owner is Tromsø kommune.  
A different solution for version control should probably be implemented before the scope of the project becomes too large.  

At the start of the project, it was based on just html and css (scss was attempted, but is not being used anymore).  

Relatively early, some machanism for global constants were considered. The decision was to use global attributes. These are not compatible with all browsers (especially outdated ones like IE).  

Bootstrap is being imported, but the design has not been done with bootstrap in mind. Maybe it would be ok to not import it. Uncommenting to see the effects of Bootstrap is probably ok for aynone that is curious about this.  

Around version 0.5, the project started using JavaScript and JQuery to prevent unnecessary code duplication and enable reading content from files. Note that a new function must probably be written for file reading before the site is published, since the current version isn't made with the online environment in mind.  

# browser compatibility
-Chrome  (Versions prior to 0.55 work in Chrome. The current file reading function is not automatically allowed in Chrome. See the notes in the version history for details)  
-Firefox (seems to give about the same result as Chrome)  
-Early versions of Edge yields poor layout. Should presumably be fixable by updating Windows.  
-Internet Explorer does not support the CSS syntax used, and there is no current plans to make the site compatible with IE.  

# pre-versions:
-Note that the Author of commits is not always correct, since git wasn't correctly configured on the client at the start of the project.  
-Website files will be added, but no particular setup is currently planned.  
-Moved local git folder. Minor change in index.html.  

# version history:
v0.1: Have a decent-looking site. The following things to consider:  
-Make images into links.  
-Having some content that is static across the site (banner- and footer elements).  
-Check out external site (carousel, user review etc.).  

v0.15: Going to attempt changing the css to use grid.  
-Grid has been implemented for a section on the page.  
-Updated banner and footer to look more like they're intended to.  

v0.2: Several possibilities. Planning to attempt to make additional pages and links.  
-Could add menus as a next step.  
-Added navbar. No links provided yet.  
-Refactored banner to use flexbox (easier vertical alignment inside divs).  
-Added some links (so far only internal). Some are styled as buttons.  
-Using fixed position for the banner, and added a placeholder image under it.  
-Made slight fixes to the layout. Have a reasonably-looking front page. External links does not work correctly, since no external pages exist yet.  

v0.25: Start working on sub-pages and/or making DRY code/common banner and footer.  
-Added some longer text for placeholder user stories with a picture.  
-Should look into how to transfer the content of these directly to the home page.  
-Added a link home from user story pages.  
-Added links from home to the user story pages.  
-Should examine if the user story grid can be simplified using DRY.  
-Did major cleanup of layout file, including "global consts" and more inheritance.  

v0.3: Attempting to write DRY code (common banner and footer, maybe other "deduplication").  
-Decided to keep working before adding and refactoring the common elements (possibly with JS).  
-Did some minor fixes to layout, including alternative color configurations.  
-Made a new subpage for Dreis. Temporarily linking here from "Arbeid".  
-Added Picture and description similar to that on the home page.  Home link as for other subpages.  
-Added description of services as a table.  

v0.35: Planning to try some cleanup.  
-After v0.3, Some elements had the same id on different pages. These have been refactored to use classes instead.  
-Used chaining and started using elements with multiple classes.  
-Fixed some misleading text, and solved an issue that generated a horizontal scroll bar (overflow-x).  
-Refactored more css, and now have a seemingly satisfactory stylesheet for the pages so far.  

v0.4: Either refatoring/DRY or adding more pages and/or content to dreis.html  
-Starting by adding contact info to dreis.html.  
-Replacing many of the placeholders with actual suggestions.  
-Finished initial descriptions of DREIS services.  
-Fixed a bug that caused the banner to not be in a fixed position, and dimensioned it reasonably.  
-Made the logo into an image link to the home page.  Added an image link to facebook.  
-Made a (so far) sketchy page for activities (aktiv.html).  
-Added a debug class for hiding debugging elements (actually remove them from the flow).  

v0.45: Planning to use bootstrap for some content.  
-Since the bootstrap styles tend to override the existing styles, bootstrap might not be the next step after all. In fact, plans of using bootstrap have been scrapped for now.  
-Changed the absolutely positioned image text to be centered inside the image by adjusting it to the right and making the parent div a flexbox.  
-Made an invisible element (p.usynlig) to adjust the position of image text and other elements.  
-Refactored to use sections where appropriate.  
-Went back to using bootstrap by using a class on body elements and giving links high enough specificity not to be overridden by Bootstrap.  
-Fixed the visibility of image text and links by giving them an opaque background instead of a transparent one.  
-Fixed grids to include a header and more easily accept additional items (getting the same height as the previous ones).  
-Changed css rules for browser widths below 600px. Seems ok except that the images for DREIS services have been removed completely in small browsers.  

v0.5: Planning to experiment with JQuery.  
-The user story links are now created by JQuery, using the custom linksrc attribute to store the address.  
-Created banner with JQuery. The current version has some html in the JS file. This is probably not best.  
-Created footer with JQuery. A potential development is to put all social media icons inside a div.  
-Renamed the user pages in accordance with simplicity and policy.  
-Made pages for DagsJobben(DJ) and restructured the rest to link via the new page arbeid.html to DREIS or DJ.  

v0.51: Possibly the last version in 2017. Has slightly more updated info about DREIS (still needs some more input before it's in a reasonably publishable state).  

v0.55: Expand the activity page, and possibly the job pages.  
-Added images and description to the different activity centers.  
-Made a slight change in how phone numbers are displayed.  
-Changed the JS to read additional html from files.  
-Firefox still works fine, but Chrome must be started from cmd (start chrome --allow-file-access-from-files).  
-Now using JS to read user stories from text files.  

v0.56: Clean up the JS file, and try to incorporate more JS in arbeid.html.  
-First part done and tested. Second part delayed to next version.

v0.57: Additional cleanup of JS and layout
-Fixed a bug that made links partly unclickable when they're behind elements that are overlayed on the link. The link overlays now have pointer-events: none  
-Version 0.57 will not be published separately, instead version 0.6 will be the next one since it contains a major change in the page structure.  

v0.6: A new page for all employee stories replaces the old pages for each employee  
-Made buttons for navigating between users. They're currently fixed directly below the banner.  
-Made content that introduces visitors to the employee story page.  It will be available when using a direct link and by clicking the intro button.  
-Intro and all stories are available in a window on the employee page. The navigation is based on reloading the page with the userid attribute added to the url.  
-The stories are saved in text files. The old html files for each employee has been deleted.  
-The home page has been refactored to populate the stories section mostly using external html files and JS.  
-Image alts for employees are now supposed to be supplied as the last paragraph in the employees's text file. Employee names are currently kept in an array in the JS file.  

v0.61: Cleanup of JS and layout. Add navbar link to the employee page.  
-Added link to the employee page.  
-Did quite a bit of cleanup in the css file. Mainly by grouping content in a more orderly fashion and renaming some stuff. Also cleaned up the html files a little.  

v0.62: Do some fixing of browser compatibility issues.  
-Gives an alert if the browser does not support custom properties. The code that does could probably be made shorter and with less potential of breaking the layout.  
-Gives an alert if the browser failed to correctly open a file. In the current version, this implies that the browser doesn't accept synchronous XMLHttpRequests. This should not be a problem when going live, since another method should be used for file access on the web server.  
-Do a console log if the current html page contains multiples of certain elements that shouldn't occur more than one time.  

v0.63: Planning to look more closely into combining DREIS and DagsJobben into a single page (with JS to select the content).  
-Under development...  
-Use the experiences from combining employees into a single page to attempt a similar approach here.  
-Make a separate folder for html files that are not standalone files.  
-Added a substantial amount of tests using the global variable named testing to determine if these are run or not.  
-Some of the tests have a large amount of duplicated code. Especially isPresent, isUnique, isNonPlural and isTagSpecific can be refactored quite a bit.  

TODO: Consider removing the home link completely or replacing it with a different link.  
TODO: An idea of combining DREIS and DagsJobben into a single page with JS to select the content exists, but it is currently unclear if this is a reasonable step (considering resulting design and time usage).  
