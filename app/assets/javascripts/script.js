/*jslint white: true, browser: true, undef: true, nomen: true, eqeqeq: true, plusplus: false, bitwise: true, regexp: true, strict: true, newcap: true, immed: true, maxerr: 14 */
/*global window: false, REDIPS: true */


/* enable strict mode */
"use strict";

var redipsInit;

var colours = ["R", "W", "G", "B"];
var pieces = {"Bansidh" : 7, "Seannaiche" : 6, "SquareChieftain" : 5, "LeapingChieftain" : 4, "DiagonalChieftain" : 3, "Champion" : 2, "Clansman" : 1};
var pieces2 = {"B" : 7, "S" : 6, "R" : 5, "L" : 4, "D" : 3, "C" : 2, "P" : 1};
var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P"];
        
var coloured_spells = ["M"];        
var images = {"G7" : ["green/Bansidh.png", "Green Bansidh", "30x30"], "G6" : ["green/Seannaiche.png", "Green Seannaiche", "30x30"], "G5" : ["green/square.png", "Green Square", "30x30"], "G4" : ["green/leaping.png", "Green Leaping", "30x30"], "G3" : ["green/diagonal.png", "Green Diagonal", "30x30"], "G2" : ["green/champion.png", "Green Champion", "30x30"], "G1" : ["green/clansman.png", "Green Clansman", "30x30"], "W7" : ["white/Bansidh.png", "White Bansidh", "30x30"], "W6" : ["white/Seannaiche.png", "White Seannaiche", "30x30"], "W5" : ["white/square.png", "White Square", "30x30"], "W4" : ["white/leaping.png", "White Leaping", "30x30"], "W3" : ["white/diagonal.png", "White Diagonal", "30x30"], "W2" : ["white/champion.png", "White Champion", "30x30"], "W1" : ["white/clansman.png", "White Clansman", "30x30"], "R7" : ["red/Bansidh.png", "Red Bansidh", "30x30"], "R6" : ["red/Seannaiche.png", "Red Seannaiche", "30x30"], "R5" : ["red/square.png", "Red Square", "30x30"], "R4" : ["red/leaping.png", "Red Leaping", "30x30"], "R3" : ["red/diagonal.png", "Red Diagonal", "30x30"], "R2" : ["red/champion.png", "Red Champion", "30x30"], "R1" : ["red/clansman.png", "Red Clansman", "30x30"], "B7" : ["black/Bansidh.png", "Black Bansidh", "30x30"], "B6" : ["black/Seannaiche.png", "Black Seannaiche", "30x30"], "B5" : ["black/square.png", "Black Square", "30x30"], "B4" : ["black/leaping.png", "Black Leaping", "30x30"], "B3" : ["black/diagonal.png", "Black Diagonal", "30x30"], "B2" : ["black/champion.png", "Black Champion", "30x30"], "B1" : ["black/clansman.png", "Black Clansman", "30x30"], "F" : ["spells/harp.png", "Dagda's Harp", "30x30"], "GM" : ["green/mist.png", "Green Mist", "30x30"], "RM" : ["red/mist.png", "Red Mist", "30x30"], "WM" : ["white/mist.png", "White Mist", "30x30"], "BM" : ["black/mist.png", "Black Mist", "30x30"]};
var FREEZE = 3;
var ZAP = 2;
var SHIELD = 8;
var MIST = 1;

var dragging = false;
var shown_lpk = null;
var shown_result = false;
var selected_spell = null;
var engine_response = "";
var engine_json = null;

function update(engine_json){
        window.engine_json = engine_json;
        load_position(engine_json["eng_game"]["board"]);
        set_turn_indicator(engine_json["eng_game"]["side_to_move"]);
        $("#game_info").html("<h2>" + engine_json["eng_game"]["message_log_html"] +"</h2>");
        var lpk;
        if (engine_json["eng_game"]["last_player_killed"] && shown_lpk!=engine_json["eng_game"]["last_player_killed"]["name"]){
                alert(engine_json["eng_game"]["last_player_killed"]["name"] + " was eliminated.");
                shown_lpk = engine_json["eng_game"]["last_player_killed"]["name"];
        }
        var result = engine_json["eng_game"]["result"];
        
        if (result && !shown_result){
          alert(result);
          shown_result = true;
        }
        
        $("red_td").html("<h2>Red: " + engine_json["eng_game"]["players"][0]["name"] + "</h2>");
        $("white_td").html("<h2>White: " + engine_json["eng_game"]["players"][1]["name"] + "</h2>");
        if (engine_json["eng_game"]["players"][2]){
        $("green_td").html("<h2>Green: " + engine_json["eng_game"]["players"][2]["name"] + "</h2>");}
        if (engine_json["eng_game"]["players"][3]){
        $("black_td").html("<h2>Black: " + engine_json["eng_game"]["players"][3]["name"] + "</h2>");}
        
        // urgh
        
        for (var i=0;i<engine_json["eng_game"]["max_players"];i+=1){
          if (engine_json["eng_game"]["players"][i]["player"]["waiting_piece"]){
            var colour = colours[engine_json["eng_game"]["players"][i]["player"]["waiting_piece"]["owner"]]
            var piece = pieces[engine_json["eng_game"]["players"][i]["player"]["waiting_piece"]["class"]]
            var id = colour + piece;
            var image = images[id];
            $("#_14_2").html('<div id="'+id+'" style="border-style: solid; cursor: move;"'+'><img src="' + document.URL + '/../../../assets/' + image[0] + '" alt="' + image[1] + '" width=30 height=30></div>');
          }
        }
}

setInterval(function(){
        if (!dragging){$.ajax({	
                type: "GET",
                url: "/games/" + game_id + ".json",
                failure: function(msg) {
                alert("Request unsuccessful, check your internet connection.")},
                dataType: "json",
                success: update});
        }
}, 10000);

var start_square = null;


// redips initialization
redipsInit = function () {
	// reference to the REDIPS.drag library and message line
	var	rd = REDIPS.drag,
		//msg = document.getElementById('out'),
		msg2 =  document.getElementById('datastring'),
		_common;


  rd.style.borderEnabled = 'none';
	// how to display disabled elements
	rd.style.borderDisabled = 'solid';	// border style for disabled element will not be changed (default is dotted)
	rd.style.opacityDisabled = 60;		// disabled elements will have opacity effect
	// initialization
	rd.init();
	// only "smile" can be placed to the marked cell
	rd.mark.exception.d8 = 'smile';
  
  $.ajax({	
        type: "GET",
        url: "/games/" + game_id + ".json",
        failure: function(msg) {
        alert("Request unsuccessful")},
        dataType: "json",
        success: update});
  
  
	// prepare handlers
	rd.event.clicked = function(currentCell) {

		var pos = currentCell.id.split("_");
		start_square = find_square(pos[1], pos[2]);
    dragging = true;
    
    switch (selected_spell){
    case FREEZE:
      freeze(start_square);
      selected_spell = null;
      dragging = false;
      alert("Spell invoked!");
    case ZAP:
      zap(start_square);
      selected_spell = null;
      dragging = false;
      alert("Spell invoked!");
    case SHIELD:
      shield(start_square);
      selected_spell = null;
      dragging = false;
      alert("Spell invoked!");
    case MIST:
      mist(start_square);
      selected_spell = null;
      dragging = false;
      alert("Spell invoked!");
    }
	};
	rd.event.moved  = function() {
	};
	rd.event.notMoved = function() {
	};
	rd.event.droppedBefore = function(targetCell) {
    dragging = false;
    if (selected_spell){
      return false;
    }
    var pos = targetCell.id.split("_");
		
		var to_square = null;

    if (targetCell.id == "_16_16" && REDIPS.drag.obj.id[1] == "1"){
            $("#promotion_window").dialog({
                    modal: true,
                    width: 600,
                    autoOpen: true,
                    resizable: false,
                    dialogClass: "promotion",
                    buttons: [
                    {
                            
                            "id": "bansidh_button",
                            click: function(){
                                    promote('B');
                            }
                    }, 
                    {
                            
                            "id": "clansman_button",
                            click: function(){
                                    promote('P');
                            }
                    },
                    {
                            
                            "id": "champion_button",
                            click: function(){
                                    promote('C');
                            }
                    },
                    {
                            
                            "id": "leapingchieftain_button",
                            click: function(){
                                    promote('L');
                            }
                    },
                    {
                            
                            "id": "squarechieftain_button",
                            click: function(){
                                    promote('R');
                            }
                    },
                    {
                            
                            "id": "diagonalchieftain_button",
                            click: function(){
                                    promote('D');
                            }
                    }]
                    
            });
                    
          return false;
      } else if (start_square["misted_piece"] && start_square["piece"]){
        
      } else {
              to_square = {"x": pos[1], "y": pos[2]};
      }
            
      var params = {"fromx" : start_square["x"], "fromy" : start_square["y"], "tox" : to_square["x"], "toy" : to_square["y"]};
      
      var response = send_command("enginemove2", params);
      if (response != "true"){
              alert("Illegal move!");
              dragging = false;
              return false;
      }
      $.ajax({	
      type: "GET",
      url: "/games/" + game_id + ".json",
      failure: function(msg) {
      alert("Request unsuccessful, check your internet connection.")},
      dataType: "json",
      success: update});
      return true;
                
	};
	rd.event.switched = function () {
	};
	rd.event.clonedEnd1 = function () {
	};
	rd.event.clonedEnd2 = function () {
	};
	rd.event.notCloned = function () {
	};
	rd.event.deleted = function (cloned) {
		// if cloned element is directly moved to the trash
		if (cloned) {
			// set id of original element (read from redips property)
			// var id_original = rd.obj.redips.id_original;
		}
		else {
		}
	};
	rd.event.undeleted = function () {
	};
	rd.event.cloned = function () {
	};
	rd.event.changed = function () {
	};
};


// toggles trash_ask parameter defined at the top
function toggleConfirm(chk) {
	if (chk.checked === true) {
		REDIPS.drag.trash.question = 'Are you sure you want to delete DIV element?';
	}
	else {
		REDIPS.drag.trash.question = null;
	}
}


// toggles delete_cloned parameter defined at the top
function toggleDeleteCloned(chk) {
	REDIPS.drag.clone.drop = !chk.checked;
}


// enables / disables dragging
function toggleDragging(chk) {
	REDIPS.drag.enableDrag(chk.checked);
}


// function sets drop_option parameter defined at the top
function setMode() {
	REDIPS.drag.dropMode = "overwrite";
}



var images_path = document.URL + '/../../../images/';

function set_turn_indicator(player_num){
        var images = [images_path + "Turn_red.png", images_path + "Turn_white.png", images_path + "Turn_green.png", images_path + "Turn_black.png"];
        $(".player2").html('<img src="'+images[parseInt(player_num)] + '" alt="Celtia" height="120" width="120">');
}

function send_command(command, params){
        var response = $.ajax({	
        type: "POST",
        url: "/games/" + game_id + "/" + command,
        data: params,
        async: false
        });
        
        return response.responseText;
        
}

function clear_board(board){
    for (var i=0;i<16;i++){
            for (var j=0;j<16;j++){
                    $("#_"+i+"_"+j).html("");
            }
    }
    $("#_16_16").html("");
    $(".mist").off("mouseover");
    $(".mist").removeClass("mist");
}

Array.prototype.contains = function(obj) {
    var i = this.length;
    while (i--) {
        if (this[i] === obj) {
            return true;
        }
    }
    return false;
}

function set_image(square, ignore_spells){
  var square_to_s = ignore_spells ? square["to_s_ignoring_spells"] : square["to_s"];
  var i = square["x"];
  var j = square["y"];
  if (pieces2.hasOwnProperty(square_to_s)){
    var piece = ignore_spells ? square["misted_piece"] : square["piece"];
    var col = colours[piece["owner"]["turn_order"]];
    var id;
    id = col + pieces2[square_to_s];
    var image = images[id];
    $("#_"+i+"_"+j).html('<div class="drag" id="'+id+'" style="border-style: solid; cursor: move;"'+'><img src="' + document.URL + '/../../../assets/' + image[0] + '" alt="' + image[1] + '" width=30 height=30></div>');
    return;
  } else if (coloured_spells.contains(square_to_s)){
    var colour = colours[square["mist_spell_owner"]["turn_order"]];
    var id = colour + square_to_s;
    var image = images[id];
    $("#_"+i+"_"+j).html('<div class="drag" id="'+id+'" style="border-style: solid; cursor: move;"'+'><img src="' + document.URL + '/../../../assets/' + image[0] + '" alt="' + image[1] + '" width=30 height=30></div>');
    $("#_"+i+"_"+j).addClass("mist");
    $("#_"+i+"_"+j).on("mouseover", function(){
      set_image(square, true);
    });
    return;
  
  } else if (images.hasOwnProperty(square_to_s)){
    var image = images[square_to_s];
    $("#_"+i+"_"+j).html('<div class="drag" style="border-style: solid; cursor: move;"'+'><img src="' + document.URL + '/../../../assets/' + image[0] + '" alt="' + image[1] + '" width=30 height=30></div>');
    return;
  }
  throw "image not found"
}

function load_position(board){
        clear_board(board);
        var skippable_letters = ["-", "p", "a", "z", "f", "i", "h", "m", "s", "'", "=", "+", "*", "d", "b", "o"];
        //var b = document.getElementById("chess_board");
        for (var k=0;k<board["squares"].length;k++){
                var square = board["squares"][k]["square"];
                
                //if (skippable_letters.contains(square["to_s"])) continue;
                
                try {
                  set_image(square, false);                  
                } catch (err) {
                  //console.error(err);
                }
                
                
        }
        
        
        REDIPS.drag.init();
        
}


if (window.addEventListener) {
	window.addEventListener('load', redipsInit, false);
}
else if (window.attachEvent) {
	window.attachEvent('onload', redipsInit);
}


function promote(piece){
        var params = {"fromx" : start_square["x"], "fromy" : start_square["y"], "piece" : piece};
        var response = send_command("enginemovepromote", params);
        if (response != "true"){
                alert("Illegal move!");
                return false;
        }
        
        REDIPS.drag.deleteObject(REDIPS.drag.obj);
        $(this).dialog("close");
        return true;
}

function shapeshift(){
        var response = send_command("enginemoveshapeshift");
        if (response=="true"){
          alert("Shapeshift activated!");
        } else {
          alert("Illegal move.");
        }
}

function possession(){
        var response = send_command("enginemovepossession");
        if (response=="true"){
          alert("Possession activated!");
        } else {
          alert("Illegal move.");
        }
}

function flight(){
        var response = send_command("enginemoveflight");
        if (response=="true"){
          alert("Flight activated!");
        } else {
          alert("Illegal move.");
        }
}

function resurrect_window() {
	$("#promotion_window").dialog({
                                modal: true,
                                width: 600,
                                autoOpen: true,
                                resizable: false,
                                dialogClass: "promotion",
                                buttons: [
                                {
                                        
                                        "id": "bansidh_button",
                                        click: function(){
                                                resurrect('B');
                                        }
                                }, 
                                {
                                        
                                        "id": "clansman_button",
                                        click: function(){
                                               resurrect('P');
                                        }
                                },
                                {
                                        
                                        "id": "champion_button",
                                        click: function(){
                                                resurrect('C');
                                        }
                                },
                                {
                                        
                                        "id": "leapingchieftain_button",
                                        click: function(){
                                                resurrect('L');
                                        }
                                },
                                {
                                        
                                        "id": "squarechieftain_button",
                                        click: function(){
                                                resurrect('R');
                                        }
                                },
                                {
                                        
                                        "id": "diagonalchieftain_button",
                                        click: function(){
                                               resurrect('D');
                                        }
                                }]
                                
                        });

}

function resurrect(piece) {
	var params = {"piece" : piece};
	var response = send_command("enginemoveresurrect", params);
    if (response != "true"){
                alert("Illegal move!");
                return false;
        }  
}         

function select_freeze(){
  if (selected_spell != FREEZE){
    selected_spell = FREEZE;
    alert("Dagda's Harp spell selected.  Click on a square to invoke.");
  } else {
    selected_spell = null;
  }
}

function select_zap(){
  if (selected_spell != ZAP){
    selected_spell = ZAP;
    alert("Dagda's Harp spell selected.  Click on a square to invoke.");
  } else {
    selected_spell = null;
    
  }
}

function select_shield(){
  if (selected_spell != SHIELD){
    selected_spell = SHIELD;
    alert("Shield spell selected.  Click on a square to invoke.");
  } else {
    selected_spell = null;
    
  }
}

function select_mist(){
  if (selected_spell != MIST){
    selected_spell = MIST;
    alert("Mist spell selected.  Click on a square to invoke.");
  } else {
    selected_spell = null;
    
  }
}

function freeze(params){
        var response = send_command("enginemovefreeze", params);
        if (response=="true"){

        } else {
          engine_response = "Illegal move."
        }
}

function zap(params){
        var response = send_command("enginemovezap", params);
        if (response=="true"){
          
        } else {
          engine_response = "Illegal move."
        }
}

function shield(params){
        var response = send_command("enginemoveshield", params);
        if (response=="true"){
          
        } else {
          engine_response = "Illegal move."
        }
}

function mist(params){
        var response = send_command("enginemovemist", params);
        if (response=="true"){

        } else {
          engine_response = "Illegal move."
        }
}

function find_square(x, y){
  for (var i=0;i<engine_json["eng_game"]["board"]["squares"].length;i+=1){
    var square = engine_json["eng_game"]["board"]["squares"][i]["square"];
    if (square.x==x && square.y==y){
      return square;
    }
  }
}
