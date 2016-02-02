class AddGameWrapperIdToGame < ActiveRecord::Migration
  def change
    add_column :games, :game_wrapper_id, :integer
  end
end
