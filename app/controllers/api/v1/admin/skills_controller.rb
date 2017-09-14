class Api::V1::Admin::SkillsController < Api::V1::BaseController
  before_action :authenticate_user!

  def index
    @skills = Skill.all
    authorize @skills
    respond_with @skills.map(&:name)
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
    respond_with :api, :v1, :admin, Skill.find_by(name: params[:skill][:name]).destroy
  end


  private
    def skill_params
      params.require(:skill).permit(:name)
    end
end
