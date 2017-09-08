class Api::V1::Admin::UsersController < Api::V1::BaseController
  before_action :authenticate_user!
  before_action :authorize_user
  before_action :load_user, except: [:index, :roles, :statuses]
  after_action :verify_authorized

  def index
    @users = User.all
    respond_with @users
  end

  def destroy
    respond_with @user.destroy
  end

  def update
    if @user.update_attributes(user_params)
      respond_with @user, json: @user
    end
  end

  private
    def user_params
      params.require(:user).permit(:email, :role, :status)
    end

    def authorize_user
      authorize User
    end

    def load_user
      @user = User.find(params[:id])
      authorize @user
    end

end
