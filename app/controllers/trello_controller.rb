require 'trello'
class TrelloController < ApplicationController
  before_action :authenticate_user!

  
  def index
    keys = Identity.where(:user_id => current_user.id, :uid => current_user.trello)
    Trello.configure do |config|
      config.consumer_key = ENV['TRELLO_DEVELOPER_PUBLIC_KEY'] 
      config.consumer_secret = ENV['TRELLO_SECRET']
      config.oauth_token = keys.pluck(:trello_auth_token).first
      config.oauth_token_secret = keys.pluck(:trello_auth_secret).first
    end
    #member token it's uid given by omniauth
    #ouath_token and secret it's extra access tokens given by omniauth

    @me = Trello::Member.find(current_user.trello)
  end

end
