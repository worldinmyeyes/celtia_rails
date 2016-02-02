module GameHelper
  def side_finder(arg1,arg2)
    @player_playing_game= PlayerPlayingGame.where(game_id: arg1.to_s, player_side: arg2.to_s).first
    end
				  
end

