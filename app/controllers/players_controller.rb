class PlayersController < ApplicationController
  def show
    @game_id = params[:game_id]
  end
  
  def new
    @player = Player.new
  end
  
  def create
    @player = Player.new(params[:player])
    if @player.save
     session[:player_id] = @player.id
      redirect_to root_url, notice: "Thank you for registering."
    else
      render "new"
    end
  end
end
