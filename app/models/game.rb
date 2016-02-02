class Game < ActiveRecord::Base
has_many :player_lists
has_many :messages
has_many :players, :through => :player_lists

  attr_accessible :black, :forfeit, :game_state, :green, :last_moved, :red, :white, :turn_counter, :game_wrapper_id, :num_players
  attr_accessor :engine, :eng_game
  after_create :create_engine

  has_one :game_wrapper

  def create_engine
    
    #@turn_count = 0
    @engine = Engine::CeltiaRulesEngine.new(false, false, false)
    @engine.handle_line("new #{id} #{num_players == 3 ? 4 : num_players}")
    ObjectCache.add(id.to_s, @engine)
  end
  
  #Probably there exists a better way of doing this. - Sherer
  def update_turn_counter
    case @turn_counter 
    when "player0"
      update_attributes(:turn_counter => "player1")
    when "player1"
      update_attributes(:turn_counter => "player2")
    when "player2"
      update_attributes(:turn_counter => "player3")
    when self.turn_counter == "player3"
      update_attributes(:turn_counter => "player0") 	
    end
  end
  
  # Graham: I think what you had didn't work at all, putting this in for now instead
   #@turn_count = (@turn_count + 1) % 4
   #update_attributes(:turn_counter => "player#{@turn_count}")
    
end
