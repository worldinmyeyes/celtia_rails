class GreensController < GamesController
  def show
    game = Game.find_by_game_token(params[:game_id])

    if game.green && game.green != "#{request.env['REMOTE_ADDR']}"
      redirect_to error_path
    else
      game.update_attributes(green: "#{request.env['REMOTE_ADDR']}")
      super
    end
  end
end