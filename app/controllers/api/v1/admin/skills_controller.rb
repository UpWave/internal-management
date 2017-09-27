class Api::V1::Admin::SkillsController < Api::V1::BaseController
  before_action :authenticate_user!

  def index
    @skills = Skill.all
    authorize @skills
    respond_with @skills
  end

  def update
    @skill = Skill.find(params[:id])
    authorize @skill
    if @skill.update_attributes(skill_params)
      respond_with @skill, json: @skill
    else
      render json: { errors: @skill.errors.full_messages }, status: 422
    end
  end

  def create
    @skill = Skill.new(skill_params)
    authorize @skill
    if @skill.save
      respond_with :api, :v1, :admin, @skill
    else
      render json: { errors: "Error! Probably current skill already exists" }, status: 422
    end
  end

  def destroy
    authorize Skill
    if Skill.find(params[:id]).destroy
      render json: { }, status: 200
    else
      render json: { errors: "Error when deleting!" }, status: 422
    end
  end


  private
    def skill_params
      params.require(:skill).permit(:id, :name)
    end
end
