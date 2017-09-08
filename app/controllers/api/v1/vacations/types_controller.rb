class Api::V1::Vacations::TypesController < Api::V1::BaseController
  before_action :authenticate_user!

  def index
    respond_with Vacation.types.keys
  end
end
