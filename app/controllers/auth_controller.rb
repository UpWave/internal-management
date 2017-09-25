class AuthController < ApplicationController
  def is_signed_in?
    if user_signed_in?
      render json: { "signed_in": true, "user": current_user }.to_json
    else
      render json: { "signed_in": false }.to_json
    end
  end

  def check_identities
    render json: { "has_google": current_user.has_google?, "has_trello": current_user.has_trello? }.to_json
  end
end
