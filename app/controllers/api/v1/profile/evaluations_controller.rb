class Api::V1::Profile::EvaluationsController < Api::V1::BaseController
  before_action :authenticate_user!

  def index
    @evaluations = current_user.evaluations
    respond_with @evaluations, json: @evaluations
  end

end
