class Api::V1::ProfilesController < Api::V1::BaseController
  before_action :authenticate_user!

  def show
    authorize(:profile, :show?)
    render json: current_user
  end

  def update
    authorize(:profile, :update?)
    if current_user.update_attributes(profile_params)
      respond_with current_user, json: current_user
    else
      render json: { errors: current_user.errors.full_messages }, status: 422
    end
  end

  private
    def profile_params
      params.permit(:avatar)
    end

end
