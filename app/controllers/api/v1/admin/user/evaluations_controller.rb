class Api::V1::Admin::User::EvaluationsController < Api::V1::BaseController
  before_action :authenticate_user!
  before_action :load_user, only: [:index, :create]
  before_action :load_evaluation, only: [:update, :destroy]

  def index
    @evaluations = @user.evaluations
    authorize @evaluations
    respond_with @evaluations
  end

  def show
    @evaluation = Evaluation.includes(:goals).find(params[:id])
    authorize @evaluation
    respond_with @evaluation, json: { evaluation: @evaluation,
                                      goals: @evaluation.goals }
  end

  def create
    @evaluation = Evaluation.new(evaluation_params)
    authorize @evaluation
    if @evaluation.save
      respond_with @evaluation, json: @evaluation
    else
      render json: { errors: @evaluation.errors.full_messages }, status: 422
    end
  end

  def update
    if @evaluation.update_attributes(evaluation_params)
      respond_with @evaluation, json: @evaluation
    else
      render json: { errors: @evaluation.errors.full_messages }, status: 422
    end
  end

  def destroy
    if @evaluation.destroy
      render json: { }, status: 200
    else
      render json: { errors: "Something went wrong" }, status: 422
    end
  end


  private

  def evaluation_params
    params.require(:evaluation).permit(:due_date, :user_id, goals_attributes: [:id, :name, :mark, :_destroy])
  end

  def load_evaluation
    @evaluation = Evaluation.find(params[:id])
    authorize @evaluation
  end

  def load_user
    @user = User.find(params[:user_id])
  end
end
