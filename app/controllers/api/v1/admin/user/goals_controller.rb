class Api::V1::Admin::User::GoalsController < Api::V1::BaseController
  before_action :load_goal

  def update
    if @goal.update_attributes(goal_params)
      respond_with @goal, json: @goal
    else
      render json: { errors: @goal.errors.full_messages }, status: 422
    end
  end

  def destroy
    if @goal.destroy
      render json: { }, status: 200
    else
      render json: { errors: "Something went wrong" }, status: 422
    end
  end
  
  private

  def goal_params
    params.require(:goal).permit(:name, :mark)
  end

  def load_goal
    @goal = Goal.find(params[:id])
  end

end
