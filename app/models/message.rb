class Message < ActiveRecord::Base
  attr_accessible :body, :player_id, :game_id
  belongs_to :game
  belongs_to :player
  
end
