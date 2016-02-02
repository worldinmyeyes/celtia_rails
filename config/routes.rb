Celtia::Application.routes.draw do


  resources :players
  resources :sessions
  resources :messages do
  
  member do
  
  get "message_list" 
  end
  
  
  end

  resources :games do
   
  #get 'update_game_red', :on => :member, :as => update_game_red

    member do
      get "last_moved"
      get "turn_counter"
      put 'update_game_red'
      post "command"
      post "enginemove2"
      post "enginemovepromote"
      post "enginemoveresurrect"
      post "enginemoveshapeshift"
      post "enginemovepossession"
      post "enginemoveflight"
      post "enginemovefreeze"
      post "enginemovezap"
      post "enginemoveshield"
      post "enginemovemist"
      put "play_as_white"
      put "play_as_red"
      put "play_as_green"
      put "play_as_black"
    end

    #resource :whites, only: [:show]
    #resource :blacks, only: [:show]
    #resource :greens, only: [:show]
    #resource :reds, only: [:show]
  end

  get "/usage", :to => "games#usage", :as => :usage

  resource :error, only: [:show]

  root to: "games#landing"
end
