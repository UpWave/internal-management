class Api::V1::VacationsController < Api::V1::BaseController
  before_action :authenticate_user!
  before_action :load_vacation, only: [:update, :destroy]

  def index
    @vacations = current_user.vacations
    respond_with @vacations
  end

  def vacation_types
    respond_with Vacation.types.keys
  end

  def create
    @vacation = current_user.vacations.build(vacation_params)
    authorize @vacation
    if @vacation.save
      respond_with :api, :v1, @vacation
    end
  end

  def update
    if @vacation.update_attributes(vacation_params)
      respond_with @vacation, json: @vacation
    end
  end

  def new
    @vacation = current_user.vacations.build
    authorize @vacation
  end

  def destroy
    respond_with @vacation.destroy
  end


  private
    def vacation_params
      params.require(:vacation).permit(:start_date, :end_date, :type)
    end

    def load_vacation
      @vacation = current_user.vacations.find(params[:id])
      authorize @vacation
    end

end
