class VacationsController < ApplicationController
  before_action :authenticate_user!


  def index
    @vacations = current_user.vacations
  end

  def new
    @vacation = current_user.vacations.build
  end

  def create
    @vacation = current_user.vacations.build(vacation_params)
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
      flash[:success] = "Vacation deleted"
      redirect_to user_vacations_path
    else
      flash[:error] = "Something went wrong"
      redirect_to user_vacations_path
    end
  end


  private
    def vacation_params
      params.require(:vacation).permit(:start_date, :end_date, :status)
    end

end
