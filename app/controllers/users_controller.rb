require 'prawn'
class UsersController < ApplicationController
  before_action :authenticate_user!
  before_action :load_user, except: [:index]
  after_action :verify_authorized

  def index
    @users = User.all
    authorize User
  end

  def destroy
    if @user.destroy
      flash[:success] = "User deleted"
      redirect_to users_path
    else
      flash[:error] = "Something went wrong"
      redirect_to users_path
    end
  end

  def update
    if @user.update_attributes(user_params)
      flash[:success] = "User updated"
      redirect_to users_path
    else
      flash[:error] = "Something went wrong"
      redirect_to users_path
    end
  end

  private
    def user_params
      params.require(:user).permit(:email, :role)
    end

    def load_user
      @user = User.find(params[:id])
      authorize @user 
    end

end