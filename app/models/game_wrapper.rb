class GameWrapper < ActiveRecord::Base
    attr_accessible :game

    serialize :game, JSON
end
