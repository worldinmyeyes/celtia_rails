class PlayerPlayingGame < ActiveRecord::Base
  attr_accessible :player_side, :player_id, :game_id
  
  belongs_to :game
  belongs_to :player

end
  

