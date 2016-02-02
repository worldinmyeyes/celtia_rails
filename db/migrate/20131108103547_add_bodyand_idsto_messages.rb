class AddBodyandIdstoMessages < ActiveRecord::Migration
  def up
  change_table :messages do |t|
  t.belongs_to :game
  t.belongs_to :player
  t.text :body
  end
end

  def down
  end
end
