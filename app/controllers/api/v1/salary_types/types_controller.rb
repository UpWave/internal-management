class Api::V1::SalaryTypes::TypesController < Api::V1::BaseController
  before_action :authenticate_user!

  def index
    respond_with Salary.types.keys
  end
end
