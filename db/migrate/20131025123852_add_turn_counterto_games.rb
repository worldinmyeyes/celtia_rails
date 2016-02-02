class AddTurnCountertoGames < ActiveRecord::Migration
  def up
  add_column :games, :turn_counter, :string 
  end

  def down
  end
end
