class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.text :game_state
      t.string :game_token
      t.integer :last_moved
      t.string :white
      t.string :black
      t.string :red
      t.string :green
      t.string :forfeit

      t.timestamps
    end
  end
end
