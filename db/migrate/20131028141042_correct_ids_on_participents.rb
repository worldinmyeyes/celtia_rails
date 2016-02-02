class CorrectIdsOnParticipents < ActiveRecord::Migration
  def up
  change_table :participents do |t|
  t.belongs_to :game
  t.belongs_to :player
  t.remove :games_id, :players_id
  end

  def down
  end
end
end
