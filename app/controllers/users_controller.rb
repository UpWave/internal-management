class UsersController < ApplicationController
  before_action :authenticate_user!
  after_action :verify_authorized

  def index
    @users = User.all
    @user = current_user
    authorize @user
  end

  def show
    @user = User.find(params[:id])
    authorize @user
  end

  def destroy
    @user = User.find(params[:id])
    authorize @user
    if @user.destroy
      flash[:success] = "User deleted"
      redirect_to users_path
    else
      flash[:error] = "Something went wrong"
      redirect_to users_path
    end
  end

  def edit
    @user = User.find(params[:id])
    authorize @user
  end

  def update
    @user = User.find(params[:id])
    authorize @user
    if @user.update_attributes(user_params)
      flash[:success] = "User updated"
      redirect_to users_path
    else
      flash[:error] = "Something went wrong"
      redirect_to users_path
    end
  end


  def user_params
      params.require(:user).permit(:email, :role)
    end

end