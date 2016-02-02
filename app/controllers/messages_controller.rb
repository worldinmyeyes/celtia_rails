class MessagesController < ApplicationController

def create
  #debugger
  @message = Message.create!(params[:message])
  #PrivatePub.publish_to("/messages/new", "alert('#{@message.body}');")
    end

def index
   @messages = Message.all
  end
  

end

