class CreateParticipents < ActiveRecord::Migration
  def change
    create_table :participents do |t|

      t.timestamps
    end
  end
end
