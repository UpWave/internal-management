class Api::V1::Admin::User::SkillsController < Api::V1::BaseController
  before_action :authenticate_user!

  def create
    @user_skill = UserSkill.new(user_skill_params)
    authorize @user_skill
    if @user_skill.save
      # Dunno what to do here
      #
      # It creates new record but then responds with
      # ActionController::UrlGenerationError
      # (No route matches {:action=>"show", :controller=>"api/v1/admin/user/skills",
      # :user_id=>#<UserSkill id: 149, user_id: 36, skill_id: 52, rate: 6...
      # missing required keys: [:id])
      # respond_with :api, :v1, :admin, :user, @user_skill
    else
      render json: { errors: @user_skill.errors.full_messages }, status: 422
    end
  end

  def destroy
    @user_skill = UserSkill.find_by(user_id: params[:user_id], skill_id: params[:id])
    authorize @user_skill
    if @user_skill
      respond_with @user_skill.destroy
    else
      render json: { errors: "Something went wrong" }, status: 422
    end
  end

  private
    def user_skill_params
      params.require(:user_skill).permit(:user_id, :skill_id, :rate)
    end
end
