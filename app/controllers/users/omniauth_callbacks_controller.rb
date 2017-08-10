class Users::OmniauthCallbacksController < Devise::OmniauthCallbacksController
  def google_oauth2
    auth = request.env["omniauth.auth"]
    if current_user
      unless current_user.has_google?
        current_user.connect_google(auth)
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
          current_user.connect_google(auth)
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
        current_user.connect_trello(auth)
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
          current_user.update_trello(auth)    
        else 
          current_user.connect_trello(auth)
        end
      else
        session['devise.trello_data'] = auth 
        redirect_to new_user_registration_url, alert: @user.errors.full_messages.join("\n")
      end
    end
  end

end