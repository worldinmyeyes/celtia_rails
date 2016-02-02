$ ->
	setInterval () ->
      $(".player2").html("<%= escape_javascript(render partial: "games/turn") %>")
    , 10000
    	
