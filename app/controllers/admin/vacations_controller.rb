module Admin
  class Admin::VacationsController < ApplicationController
    before_action :authenticate_user!
    before_action :load_vacation, only: [:update, :destroy]

    def index
      @vacations = Vacation.pending
      authorize @vacations
    end

    def update
      if @vacation.update(vacation_params)
        flash[:success] = "Vacation updated"
        redirect_to admin_vacations_path
      else
        flash[:error] = "Something went wrong"
        redirect_to admin_vacations_path
      end
    end

    def destroy
      if @vacation.destroy
        flash[:success] = "Vacation deleted"
        redirect_to admin_vacations_path
      else
        flash[:error] = "Something went wrong"
        redirect_to admin_vacations_path
      end
    end


    private
      def vacation_params
        params.require(:vacation).permit(:status)
      end

      def load_vacation
        @vacation = Vacation.find(params[:id])
        authorize @vacation
      end

  end
end
