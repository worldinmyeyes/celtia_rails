class RenamePlayerListsToPlayerPlayingGames < ActiveRecord::Migration
  def change
    rename_table :player_lists, :player_playing_games
  end
end
