class Api::V1::ProfilesController < Api::V1::BaseController
  before_action :authenticate_user!

  def show
    render json: { "user": current_user, "salary": current_user.salary, "avatar": current_user.photo }.to_json()
  end

  def update
    if current_user.update_attributes(profile_params)
      respond_with current_user, json: current_user
    else
      render json: { errors: current_user.errors.full_messages }, status: 422
    end
  end

  private
    def profile_params
      params.require(:user).permit(:avatar)
    end

end
