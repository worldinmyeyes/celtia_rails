class CreateGameWrapper < ActiveRecord::Migration
    def change
        create_table :game_wrappers do |t|
            t.string :game
        end
    end
end
        
        
