class ProfilesController < ApplicationController
  before_action :authenticate_user!
  before_action :load_user

  def index
    @user
  end

  def update
    if @user.update(profile_params)
      flash[:success] = "Avatar updated"
      redirect_to user_profiles_path
    else  
      flash[:alert] = "Something went wrong"
      redirect_to user_profiles_path
    end    
  end

  private

    def profile_params
      params.require(:user).permit(:avatar)
    end

    def load_user
      @user = current_user 
    end
end
