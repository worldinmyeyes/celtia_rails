Database Connectivity

The front-end uses redips Javascript library to initialize actionsand provide 
interactivity for the front engine.

There are two files used for this purpose:

-redips-drag-source.js
-script.js

which are located in the ./app/assets/javascripts folder

redips-drag-source.js contains all the core functions providing interactivity 
and data processing on the front-end while script.js contains event handlers 
and functions responsible for triggering events. Both files include references 
to each other. 

Additionaly rd.event.dropped function in script.js contains AJAX request which 
is passing a string of data with board positions to games/update (controller/action) 
which is responsible for handling the data on the server side and saving it to 
the database.

The string of board data is generated in the redips-drag-source file under the 
'saveContent' function which creates a JSON object. This function is initialized from
the script.js file under rd.event.dropped and stores generated data in the variable
named 'table_content'. The content of this variable is then passed to the server side
using the attached AJAX request.
