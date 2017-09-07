class Api::V1::Admin::UsersController < Api::V1::BaseController
  before_action :authenticate_user!
  before_action :load_user, except: [:index, :roles, :statuses]
  after_action :verify_authorized, except: [:roles, :statuses]

  def index
    @users = User.all
    authorize User
    respond_with @users
  end

  def roles
    respond_with User.roles.keys
  end

  def statuses
    respond_with User.statuses.keys
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

    def load_user
      @user = User.find(params[:id])
      authorize @user
    end

end
