class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def google_oauth2
    auth = request.env["omniauth.auth"]
    if current_user
      unless current_user.has_google?
        Identity.create(:uid => auth.uid, :provider => auth.provider, :user_id => current_user.id)
        redirect_to root_path, notice: "Successfully linked Google account!"
      else
        redirect_to root_path, notice: "Google account already linked!"
      end
    else
      @user = User.from_omniauth(auth)
      if @user.persisted?
        flash[:notice] = I18n.t 'devise.omniauth_callbacks.success', kind: 'Google'
        sign_in_and_redirect @user, event: :authentication
        unless current_user.has_google?
          Identity.create(:uid => auth.uid, :provider => auth.provider, :user_id => current_user.id)
        end
      else
        session['devise.google_data'] = auth.except(:extra) 
        redirect_to new_user_registration_url, alert: @user.errors.full_messages.join("\n")
      end
    end
  end

  def trello
    auth = request.env["omniauth.auth"]
    if current_user
      unless current_user.has_trello?
        Identity.create(:uid => auth.uid, :provider => auth.provider, :user_id => current_user.id, :access_token => auth.extra.access_token.token, :secret_token => auth.extra.access_token.secret)
        redirect_to root_path, notice: "Successfully linked Trello account!"
      else
        redirect_to root_path, notice: "Trello account already linked!"
      end
    else
      @user = User.from_omniauth(auth)
      if @user.persisted?
        flash[:notice] = I18n.t 'devise.omniauth_callbacks.success', kind: 'Trello'
        sign_in_and_redirect @user, event: :authentication
        if current_user.has_trello?
          Identity.find_by(:uid => auth.uid, :provider => auth.provider, :user_id => current_user.id).update_attributes(:access_token => auth.extra.access_token.token, :secret_token => auth.extra.access_token.secret)    
        else 
          Identity.create(:uid => auth.uid, :provider => auth.provider, :user_id => current_user.id, :access_token => auth.extra.access_token.token, :secret_token => auth.extra.access_token.secret)
        end
      else
        session['devise.trello_data'] = auth 
        redirect_to new_user_registration_url, alert: @user.errors.full_messages.join("\n")
      end
    end
  end

end