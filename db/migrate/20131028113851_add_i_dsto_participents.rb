class AddIDstoParticipents < ActiveRecord::Migration
  def up
  change_table :participents do |t|
  t.belongs_to :games
  t.belongs_to :players
  t.string :player_side
end
  end

  def down
  end
end
