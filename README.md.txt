Project Archive: ‘Celtia’
Ruby on Rails Application: Front End

Team Members: 
James Adeola, Matthew Howie, Graham McKay, Surusch Mohammadi, Jacek Mozejko

Introduction
The Celtia Ruby on Rails application provides a digital version of the existing real-world board game to provide for online multi-player gaming.

The application has been based on the standard Model-View-Controller (MVC) architecture with the addition of an AJAX connection to the game rule engine which is hosted on an external web server.

The model game.rb provides the means for creating and storing a unique game id and token which establishes the basis for four URLs for the game players.

There is a controller assigned for each player colour and a games_controller for creating a new game.

The landing page index.html.erb is associated to the games_controller and provides the link for establishing a new game on the rule engine and routes into the black view. URLs for the additional three players are then available from the black view.

The board (_board.html.erb) and spells are partials associated to the games_controller which are rendered into each view.

At current multiplayer is working for one game active at any one time with moves validated through the rule engine. 

Currently functionality for Spells, Reincarnation, Time, Scoring and Messaging are unavailable. 
 
Compatibility
The application has been confirmed to work on the following operating systems:
-	Microsoft
-	Linux

The application has been tested to be compatible on the following web browsers:
-	Firefox
-	Chrome
-	Internet Explorer 9 or higher

Installation Instructions
1.	Download and unzip the application into your directory.
2.	Load the Ruby Command Prompt and change into the application directory.
3.	Once in the application directory enter the ‘rails s’ command in to the prompt.
4.	Open a new window in your browser and redirect to ‘localhost:3000’

Heroku
The application can be accessed online at:
	celtia-rails.herokuapp.com
