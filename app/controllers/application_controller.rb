class ApplicationController < ActionController::Base
  protect_from_forgery

    def build_session(game)
    if game && session[:chess].blank? && game.cookie_items.size <= 2
      puts "1"
      s = CookieItem.create
      game.cookie_items << s
      session[:chess] = s.cookie_token
      return true
    else
      return false
    end
  end
  
  

def authorize
  if current_player.nil?
    redirect_to root_url
    flash[:error] = "You must log in first!"
  end
end


  
   private
  def current_player
    @current_player ||= Player.find(session[:player_id]) if session[:player_id]
  end
  helper_method :current_player

end
