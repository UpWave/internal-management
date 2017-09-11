class Api::V1::Admin::StatusesController < Api::V1::BaseController
  before_action :authenticate_user!

  def index
    authorize current_user, :statuses
    respond_with User.statuses.keys
  end
end
