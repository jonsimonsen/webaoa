# webaoa
Using my repo for these files for now. The project owner is Tromsø kommune. It does not seem like they are going to implement the project, so I'll rewrite the project to use it as a part of my portfolio (partially because the original version might contain some material that is not actually publishable).  
A different solution for version control should probably be implemented for this kind of project before the scope of it becomes too large.  

There is currently something wrong with the latest versions, possibly due to changes in browsers. I'm planning to check if version 0.54 (5. jan 18 or 8. jan 18) seems ok, and then evaluate if the later versions can be fixed.

At the start of the project, it was based on just html and css (scss was attempted, but is not being used anymore).  

Relatively early, some machanism for global constants were considered. The decision was to use global attributes. These are not compatible with all browsers (especially outdated ones like IE).  

Bootstrap is being imported, but the design has not been done with bootstrap in mind. Maybe it would be ok to not import it. Uncommenting to see the effects of Bootstrap is probably ok for aynone that is curious about this.  

Around version 0.5, the project started using JavaScript and JQuery to prevent unnecessary code duplication and enable reading content from files. Note that a new function must probably be written for file reading before the site is published, since the current version isn't made with the online environment in mind.  

# browser compatibility
-Chrome  (Versions prior to 0.55 work in Chrome. The current file reading function is not automatically allowed in Chrome. See the notes in the version history for details)  
-Firefox (seems to give about the same result as Chrome until version 0.55). After that, Firefox actually allows the site to be displayed as intended without having to provide any flags.    
-Early versions of Edge yields poor layout. Should presumably be fixable (for pre-v0.55) by updating Windows. For the later versions, it seems like Edge will have the same kinds of issues as Chrome.  
-Internet Explorer does not support the CSS syntax used, and there is no current plans to make the site compatible with IE.  

# Summary of major versions
Version 0.7  
-----------  

-All pages for the web site are located directly under the root folder.  
-All content on the pages (with a few exceptions) are organized in sections.  
-The pages initially contain a few sections that will wrap most content.  
-All pages have a section named banner-wrapper that is used to navigate to the other pages (and sometimes within the current page).  
-The other initial sections have classes named banner-wrapper, content-wrapper, top-wrapper and employee-wrapper. There should be only one section of each class.  
-The sections are populated by reading html partials from the "html" folder.  

-The home page (index.html) contains a description of the unit including a picture and contact info. It also contains excerpts of histories from the employees.  
-The job page (arbeid.html) contains descriptions of each sub-unit
(that focuses on regular work) with a description of each service provided in addition to its picture and contact info. A default page with instructions is shown until the user selects one of the sub-units.  
-The service description contains an image, a general info text and a list of specifics.  
-The activity page (aktiv.html) contains a grid that looks the same as the service description grid for sub-units. Instead of services, each line in the grid corresponds to an activity center.  
-The employee page (ansatte.html) will contain a picture and a history from all employees that have provided such. For now, it contains default stories. Until the user starts to navigate within the page, a default page with instructions is shown (unless a user-id was given in the url).  
-Text files in the folder Info/ are used to populate unit- or person-specific parts of pages.  

-A test framework is provided so a developer can test that things have not been broken.  
-A global constant named TESTING determines if tests are run while browsing the site.  
-Error messages from tests are logged to the console.  
-If the error would cause the site to stop loading, an alert might be printed for the user.  
-An alert might also be used to give the user other info (for example if an unsupported browser is being used).  
-A class named debug is available for debugging some elements on the pages.
When doing this, comment out the line that sets display to none from the css file.
Set display back to none before making the site publicly available.  

-The current version uses global attributes, causing it to not be compatible with all browsers
(IE and old versions of Edge does not handle this). Some kind of fallback should probably be considered in later versions.  
-The current version reads html partials and text files using synchronous XMLHttpRequests.
This is not supported in many browsers (only Firefox of the ones that have been tested).
Loading from server should be used when going live (need to redefine the readFile function).  
-The JavaScript onload function proceeds sequentially adding content based on the page and its sections.
The global variable readSuccess starts off as true and becomes false when/if a file read fails.
Any additional content (except possibly stuff that doesn't require more file reads) will not be added.
If event handling was added, certain on-click events will cause a page to modify its content.  

# Feature suggestions
There are certain features that have been considered but not implemented so far. For each, it is still uncertain if they will be implemented later. These are listed here:  

-Write a function that handles null returns from the file reading functions (DRY).  
-Handle ABSENT constraint using the tag- and class-approach. This would be especially useful for readPartial() to avoid having to reformat its arguments before passing them to testValidity().  
-Consider a global variable for error prefixes instead of defining an errPre variable in
several functions. Not sure how to handle this elegantly. Perhaps some kind of inheritance for functions or maybe it is possible to use a prototype (haven't studied those yet). A potential issue is that there is no standard format for the error prefixes so far.  
-Find some fallback for browsers that can't handle global attributes in css. There is probably code for transpiling that can be downloaded somewhere.  
-Find a way to ignore global constants that are not used for the current page.  

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
-Used the experiences from combining employees into a single page to take a similar approach here.  
-Made a separate folder for html files that are not standalone files.  
-Added more subfolders for grouping content and renamed some files and folders.  
-Added a substantial amount of tests using the global variable named testing to determine if these are run or not.  
-Fixed it so all job pages can be viewed from arbeid.html.  
-Loading html code into the pages in several steps using JS.  
-It seems like the home link will not be used anymore.  

v0.7: Being able to reach the goal of version 0.63 actually "required" a substantial amount of refactoring of code and reorganization of the file system. As a result, the information about 0.63 could probably be assumed to be part of 0.7 instead. 0.63 was pushed with some unsatisfactory code. It seems to behave as intended, but the error testing and messaging is unsatisfactory enough that major cleanup, and probably a bit of more refactoring is desirable. The agenda of this version will therefore be to clean up after 0.63.  
-The constants online and testing have been made global since there are functions that would greatly benefit from having access to their values.  The variable readSuccess has also been made global.  
-Refactored so that most string concatenation combining more than two elements use
string interpolation (template literals).  
-To reduce code duplication significantly, readPartial() was written to read an html file
and append the code to an element defined by a JQuery selection.
It can also check that new elements that are supposed to be unique
are not already in the document and that only one is added.  
-To avoid browser warnings complaining about XML parsing,
all textfiles have had their content placed inside txt tags (`<txt>...</txt>`).  
-Updated readParas() to remove txt tags and anything outside them.  
-Deleted everything that has to do with the home link.  
-Deleted other deprecated stuff, and reorganized some files and folders.  
-Made some changes to the formatting of JS comments.  
-Tested that everything seems to work as intended.  

-TODO: Consider writing a function for handling null returns from file reading functions (to reduce code duplication).  
-TODO: Consider finding a way to handle ABSENT elements using the tag- and class-approach to
simplify testValidity() and functions like readPartial().  

v0.71: Refactor the css file to get rid of more old stuff that is now deprecated.  
-Removed old stuff and fixed some comments in the css file.  
-Made some updates to the JS file. Fixed some bugs/errors and cleaned up some code.  
-Made a separate function for the browser compatibility testing.  
-Reordered the functions to have them grouped in a more intuitive way.  

v0.72: Unclear agenda. Probably more cleanup.  
-Fixed some newly discovered bugs caused by not knowing exactly how forEach() works. Now using every() instead if there is a chance that there are elements that doesn't need to be processed.  

v0.73: More of the same as for 0.72.  
-Made a class for units that have connected services. So far, it's mostly just for testing using classes. Tested and seems to work fine.  
-Started using JQueary for effects like showing and hiding content instead of changing the css.  
-TODO: look into reducing the number of global constants in the main JS file (perhaps using imports or something similiar).  

v0.74: Looking into more advanced error handling in JS.  
-Under development...  
-Throwing exceptions  
-Looking at importing error object from a module. To be able to import locally, use --disable-web-security --user-data-dir  
-Seems like support for ES6 modules are not great, so might look into the other ways of importing.  
