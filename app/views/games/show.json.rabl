object @eng_game => :eng_game


    attributes :max_players, :black, :forfeit, :game_state, :green, :last_moved, :red, :white, :turn_counter, :game_wrapper_id, :game_id, :message_log_html, :result, :side_to_move
    child :board => :board do
        child :flattened => :squares do
            extends("squares/_show")
        end
    end
    child :last_player_killed => :last_player_killed do
        attributes :name
    end
    
    child :players => :players do
      extends("players/_show")
    end

