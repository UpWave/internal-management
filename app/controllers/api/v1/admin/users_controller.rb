class Api::V1::Admin::UsersController < Api::V1::BaseController
  before_action :authenticate_user!
  before_action :load_user, except: [:index, :count_users]
  after_action :verify_authorized

  def index
    @users = User.all.paginate(page: (params[:page].to_i+1).to_s, per_page: params[:per_page])
    authorize @users
    respond_with @users
  end

  def count_users
    authorize current_user, :count_users
    respond_with User.all.count
  end

  def skills
    authorize current_user, :skills?
    respond_with @user.skills_rate
  end

  def missing_skills
    authorize current_user, :missing_skills?
    respond_with @user.missing_skills
  end

  def destroy
    respond_with @user.destroy
  end

  def update
    if @user.update_attributes(user_params)
      respond_with @user, json: @user
    else
      render json: { errors: @user.errors.full_messages }, status: 422
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
