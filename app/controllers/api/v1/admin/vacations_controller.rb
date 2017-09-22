class Api::V1::Admin::VacationsController < Api::V1::BaseController
  before_action :authenticate_user!

  def index
    @vacations = Vacation.pending
    authorize @vacations
    render json: @vacations
  end

  def statuses
    authorize(:vacation, :statuses?)
    render json: { "approved_status": Vacation.approved_status, "rejected_status": Vacation.rejected_status }
  end

  def update
    @vacation = Vacation.find(params[:id])
    authorize @vacation
    if @vacation.update_attributes(vacation_params)
      respond_with @vacation, json: @vacation
    else
      render json: { errors: @vacation.errors.full_messages }, status: 422
    end
  end

  private
    def vacation_params
      params.require(:vacation).permit(:status)
    end

end
