class Api::V1::EvaluationsController < Api::V1::BaseController
  before_action :authenticate_user!

  # ADD AUTHORIZE BEFORE EACH ACTION

  def index
    @user = User.find(params[:user_id])
    @evaluations = @user.evaluations
    respond_with @evaluations
  end

end
