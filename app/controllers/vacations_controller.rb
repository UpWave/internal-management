class VacationsController < ApplicationController
  before_action :authenticate_user!
  before_action :load_vacation, only: [:update, :destroy]

  def index
    @vacations = current_user.vacations
  end

  def new
    @vacation = current_user.vacations.build
    authorize @vacation
  end

  def create
    @vacation = current_user.vacations.build(vacation_params)
    authorize @vacation
    if @vacation.save
      flash[:success] = "Vacation requested!"
      redirect_to user_vacations_path
    else
      render :new
    end
  
  end

  def update
    if @vacation.update(vacation_params)
      flash[:success] = "Vacation updated"
      redirect_to user_vacations_path
    else
      flash[:error] = "Something went wrong"
      redirect_to user_vacations_path
    end
  end

  def destroy
    if @vacation.destroy
      flash[:success] = "Vacation request canceled"
      redirect_to user_vacations_path
    else
      flash[:error] = "Something went wrong"
      redirect_to user_vacations_path
    end
  end


  private
    def vacation_params 
      params.require(:vacation).permit(:start_date, :end_date)
    end

    def load_vacation
      @vacation = current_user.vacations.find(params[:id])
      authorize @vacation
    end

end
