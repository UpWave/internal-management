class Api::V1::Admin::User::SkillsController < Api::V1::BaseController
  before_action :authenticate_user!

  def create
    @user_skill = UserSkill.new(user_skill_params)
    authorize @user_skill
    if @user_skill.save
      respond_with :api, :v1, :admin, @user_skill
    else
      render json: { errors: "Something went wrong" }, status: 422
    end
  end

  def destroy
    @user_skill = UserSkill.find_by(user_skill_params)
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
