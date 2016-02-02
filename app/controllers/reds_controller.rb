class RedsController < GamesController
  def show
    game = Game.find_by_game_token(params[:game_id])

    if game.red && game.red != "#{request.env['REMOTE_ADDR']}"
      redirect_to error_path
    else
      game.update_attributes(red: "#{request.env['REMOTE_ADDR']}")
      super
    end
  end
end