class GamesController < ApplicationController

protect_from_forgery :except => [:update, :enginemove2] #MAJOR, MAJOR, REPEAT MAJOR security flaw here. A more robust AJAX solution is needed.

before_filter :authorize, only: [:create, :show]

  def show
        
    @game_id = params[:game_id] if params[:game_id]
    @game_id = params[:id] if params[:id]
    
    @game = Game.find_by_id(@game_id)
    
     
   
    @messages = Message.where("game_id = ?", params[:id]).order( 'created_at ASC' )
     
  

    @player_playing_game = PlayerPlayingGame.all

    #@messages = Message.where("game_token = ?", params[:game_token]).order( 'created_at ASC' )

    
    #gon.eng_game = GameWrapper.find_by_id(@game.game_wrapper_id)
    
    
    eng = ObjectCache.find(@game_id)
    
    @eng_game = eng.games[eng.current_game]
    
    gon.game_state = @game.game_state

    gon.watch.turn_counter = @game.turn_counter
    
	if !params[:_method].present?

    respond_to do |format|
       format.html
       format.json
       end
    end
    
  end

  def index
    @games = Game.where("num_players = 4").reject{|g| ObjectCache.find(g.id.to_s).nil?}
    @games2 = Game.where("num_players = 2").reject{|g| ObjectCache.find(g.id.to_s).nil?}
    @games3 = Game.where("num_players = 3").reject{|g| ObjectCache.find(g.id.to_s).nil?}
  end

  def create

    @game = Game.new({:num_players => params[:num_players].to_i})
    @game.save!
    e = ObjectCache.find(@game.id.to_s)
    eng_game = e.games[e.current_game]
    case @game.num_players
    when 3
      eng_game.players[3].piece_list.each do |p|
        p.mercenary= true
      end
      eng_game.players[3].mercenary= true
      eng_game.players[3].active= false
      eng_game.get_moves(eng_game.players[0])
    else
    
    end

    #@game_wrapper = GameWrapper.create(game: @eng_game)
    
    0.upto(3) do |i|
      PlayerPlayingGame.create(:game_id => @game.id, :player_side => "player#{i}")

    end
    @game.update_attributes(:turn_counter => "player0")
    redirect_to game_path(@game)
  end
  
  def update
    @game = Game.find(params[:id])
    
    if @game.black && @game.red && @game.white && @game.green
      @game.update_turn_counter
      @game.update_attributes(game_state: params[:data])
      @game.update_attributes(params[:game])
      
      render nothing: true
    else
      @game.update_attributes(params[:game])
      @game.update_attributes(game_state: params[:data])
      
      update_game_side
      @game.update_turn_counter
      
      redirect_to game_path(@game)

    end

  end
  
  def enginemove2
    @game = Game.find_by_id(params[:id])
    engine = ObjectCache.find(@game.id.to_s)
    engine.handle_line("move #{params[:fromx]} #{params[:fromy]} #{params[:tox]} #{params[:toy]}")
    render text: engine.games[engine.current_game].last_move_okay
  end
  
  def enginemovepromote
    @game = Game.find_by_id(params[:id])
    engine = ObjectCache.find(@game.id.to_s)
    engine.handle_line("move_special 9 #{params[:fromx]} #{params[:fromy]} #{params[:piece]}")
    render text: engine.games[engine.current_game].last_move_okay  
  end
  
  def enginemoveshapeshift
    @game = Game.find_by_id(params[:id])
    engine = ObjectCache.find(@game.id.to_s)
    engine.handle_line("move_special 6")
    render text: engine.games[engine.current_game].last_move_okay  
  end
  
  def enginemovepossession
    @game = Game.find_by_id(params[:id])
    engine = ObjectCache.find(@game.id.to_s)
    engine.handle_line("move_special 5")
    render text: engine.games[engine.current_game].last_move_okay  
  end
  
  def enginemoveflight
    @game = Game.find_by_id(params[:id])
    engine = ObjectCache.find(@game.id.to_s)
    engine.handle_line("move_special 7")
    render text: engine.games[engine.current_game].last_move_okay  
  end
  
  def enginemoveresurrect
    @game = Game.find_by_id(params[:id])
    engine = ObjectCache.find(@game.id.to_s)
    engine.handle_line("move_special 10 #{params[:piece]}")
    render text: engine.games[engine.current_game].last_move_okay 
  end
  
  def enginemovefreeze
    @game = Game.find_by_id(params[:id])
    engine = ObjectCache.find(@game.id.to_s)
    engine.handle_line("move_special 3 #{params[:x]} #{params[:y]}")
    render text: engine.games[engine.current_game].last_move_okay 
  end
  
  def enginemovezap    
    @game = Game.find_by_id(params[:id])
    engine = ObjectCache.find(@game.id.to_s)
    engine.handle_line("move_special 2 #{params[:x]} #{params[:y]}")
    render text: engine.games[engine.current_game].last_move_okay 
  end
  
  def enginemoveshield
    @game = Game.find_by_id(params[:id])
    engine = ObjectCache.find(@game.id.to_s)
    engine.handle_line("move_special 8 #{params[:x]} #{params[:y]}")
    render text: engine.games[engine.current_game].last_move_okay 
  end
  
  def enginemovemist
    @game = Game.find_by_id(params[:id])
    engine = ObjectCache.find(@game.id.to_s)
    engine.handle_line("move_special 1 #{params[:x]} #{params[:y]}")
    render text: engine.games[engine.current_game].last_move_okay 
  end
  
  def current_side
    current_player.username
  end

  def turn_counter
     
    @game_id = params[:game_id] if params[:game_id]
    @game_id = params[:id] if params[:id]
    
    @game = Game.find_by_id(@game_id)
    
    render :partial => "games/turn", locals: {game: @game}
  end

  
  def unset_current_colour
    @game = Game.find_by_id(params[:id])
    engine = ObjectCache.find(@game.id.to_s)
    if @game.red == current_player.email
      @game.red = nil
      engine.games[engine.current_game].players[0].name = ""
    elsif @game.white == current_player.email
      @game.white = nil
      engine.games[engine.current_game].players[1].name = ""
    elsif @game.black == current_player.email
      @game.black = nil
      engine.games[engine.current_game].players[2].name = ""
    elsif @game.green == current_player.email
      @game.green = nil
      engine.games[engine.current_game].players[3].name = ""
    end
  end
  
  def play_as_white
    unset_current_colour
    @game.update_attributes :white => current_player.email
    engine = ObjectCache.find(@game.id.to_s)
    engine.games[engine.current_game].players[1].name = current_player.username
    redirect_to game_path(@game)
  end

  def play_as_red
    unset_current_colour
    @game.update_attributes :red => current_player.email
    engine = ObjectCache.find(@game.id.to_s)
    engine.games[engine.current_game].players[0].name = current_player.username
    redirect_to game_path(@game)
  end

  def play_as_black
    unset_current_colour
    @game.update_attributes :black => current_player.email
    engine = ObjectCache.find(@game.id.to_s)
    engine.games[engine.current_game].players[3].name = current_player.username
    redirect_to game_path(@game)
  end

  def play_as_green
    unset_current_colour
    @game.update_attributes :green => current_player.email
    engine = ObjectCache.find(@game.id.to_s)
    engine.games[engine.current_game].players[2].name = current_player.username
    redirect_to game_path(@game)
  end

  def usage
  end

private
  
  #VERY messy. A slight gotcha here, update_game_side will not set
  #the participant side correctly if the email already exists. If you choose green with the same email
  #as say black, args will get set as player3, NOT player2.
  # Graham: renaming "args" to something a little more descriptive ("side")


  def update_game_side
      side = nil
      case current_player.email
      when @game.black
        side = "player3"
      when @game.red
        side = "player0"
      when @game.white
        side = "player1"
      when @game.green
        side = "player2"
      end
      
      @player_playing_game = PlayerPlayingGame.where(:game_id => @game.id, :player_side => "#{side}").first
      @player_playing_game.player_id = current_player.id
      @player_playing_game.save!
  end  
  

end
