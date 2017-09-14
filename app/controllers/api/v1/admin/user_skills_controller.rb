class Api::V1::Admin::UserSkillsController < Api::V1::BaseController
  before_action :authenticate_user!

  def index
  end

  def create
    @user_skill = UserSkill.new(user_skill_params)
    authorize @user_skill
    if @user_skill.save
      respond_with :api, :v1, :admin, UserSkill.last
    else
      render json: { errors: "Something went wrong" }, status: 422
    end
  end

  def new
  end

  def update
  end

  def destroy
    params[:user_skill][:skill_id] = Skill.find_by(name: params[:user_skill][:name]).id
    @user_skill = UserSkill.find_by(skill_id: params[:user_skill][:skill_id], user_id: params[:user_skill][:user_id])
    authorize @user_skill
    if @user_skill
      respond_with @user_skill.destroy
    else
      render json: { errors: "Something went wrong" }, status: 422
    end
  end

  private
    def user_skill_params
      params[:user_skill][:skill_id] = Skill.find_by(name: params[:user_skill][:name]).id
      params.require(:user_skill).permit(:user_id, :skill_id, :rate)
    end
end
