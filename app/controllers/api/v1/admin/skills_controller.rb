class Api::V1::Admin::SkillsController < Api::V1::BaseController
  before_action :authenticate_user!

  def index
    @skills = Skill.all
    authorize @skills
    skills = []
    @skills.each { |skill| skills.push(skill.name) }
    respond_with skills
  end

  def create
  end

  def new
  end

  def update
  end

  def destroy
  end


  private
    def skill_params
      params.require(:skill).permit(:name)
    end
end
