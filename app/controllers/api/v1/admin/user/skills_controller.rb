class Api::V1::Admin::User::SkillsController < Api::V1::BaseController
  before_action :authenticate_user!

  def index
    @user = User.find(params[:user_id])
    @user_skills = @user.user_skills
    authorize @user_skills
    respond_with @user_skills
  end

  def missing
    @user = User.find(params[:user_id])
    @skills = @user.skills
    @missing = Skill.all - @skills
    respond_with @missing
  end

  def create
    @user = User.find(params[:user_id])
    @user_skill = @user.user_skills.new(user_skill_params)
    authorize @user_skill
    if @user_skill.save
      respond_with :api, :v1, :admin, @user, @user_skill
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
