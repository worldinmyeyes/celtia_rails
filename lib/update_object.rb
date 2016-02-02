class UpdateObject
  attr_accessor :last_update, :update_count
  
  def initialize(last_update, update_count)
    @last_update = last_update
    @update_count = update_count
  end
end
