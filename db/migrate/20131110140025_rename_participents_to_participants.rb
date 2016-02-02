class RenameParticipentsToParticipants < ActiveRecord::Migration
  def change
    rename_table :participents, :participants
  end
end
