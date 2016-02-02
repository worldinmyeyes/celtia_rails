class RenameParticipantsToPlayerLists < ActiveRecord::Migration
  def change
    rename_table :participants, :player_lists
  end
end
