# webaoa
Using my repo for these files for now. The project owner is Tromsø kommune.  
A different solution for version control should probably be implemented before the scope of the project becomes too large.

pre-versions:  
-Note that the Author of commits is not always correct, since git wasn't correctly configured on the client at the start of the project.  
-Website files will be added, but no particular setup is currently planned.  
-Moved local git folder. Minor change in index.html.  

v0.1: Have a decent-looking site. The following things to consider:  
-Make images into links.  
-Having some content that is static across the site (banner- and footer elements).  
-Check out external site (carousel, user review etc.).  

v0.15: Going to attempt changing the css to use grid.  
-Grid has been implemented for a section on the page.  
-Updated banner and footer to look more like they're intended to.  

v0.2: Several possibilities. Planning to attempt to make additional pages and links.  
-Could add menus as a next step.  
-Added navbar. No links provided yet (TODO).  
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
-Under development...  
-Starting by adding contact info to dreis.html.  
-Replacing some of the placeholders with actual suggestions.  
-Fixed a bug that caused the banner to not be in a fixed position, and dimensioned it reasonably.  
-Made the logo into an image link to the home page.  Added an image link to facebook.  
-Made a (so far) sketchy page for activities (aktiv.html).  
-Added a debug class for hiding debugging elements (actually remove them from the flow).  
