module Admin
  require 'trello' 
  class Admin::TimelogsController < ApplicationController
    before_action :authenticate_user!
    before_action :load_user
    before_action :load_timelog, only: [:update, :destroy]
    before_action :load_trello_service, only: [:index, :new]

    def index
      respond_to do |format|
        format.html do
          @timelogs = filtered_timelogs.paginate(page: params[:page], per_page: 5)
        end
        format.pdf do
          pdf = TimelogsPdf.new(filtered_timelogs, @user)
          send_data pdf.render, filename: "Timelogs of #{@user.email}", type: "application/pdf", disposition: "inline"
        end
        format.csv do
          send_data filtered_timelogs.to_csv, filename: "CSV Timelogs of #{@user.email}"
        end
      end
    end

    def create
      @timelog = @user.timelogs.build(timelogs_params)
      authorize @timelog
      if @timelog.save
        flash[:success] = "Timelog created"
        redirect_to admin_user_timelogs_path(@user)
      else
        render :new
      end
    end

    def update
      if @timelog.update(timelogs_params)
        flash[:success] = "Timelog updated"
        redirect_to admin_user_timelogs_path(@user)
      else
        flash[:error] = "Something went wrong"
        redirect_to admin_user_timelogs_path(@user)
      end
    end

    def new
      @timelog = @user.timelogs.build
      authorize @timelog
    end

    def destroy
      if @timelog.destroy
        flash[:success] = "Timelog deleted"
        redirect_to admin_user_timelogs_path(@user)
      else
        flash[:error] = "Something went wrong"
        redirect_to admin_user_timelogs_path(@user)
      end
    end

    private
      def timelogs_params
        params.require(:timelog).permit(:start_time, :duration, :user_id, :trello_card)
      end

      def load_trello_service
        @trello_service = TrelloService.new(@user)
      end

      def load_timelog
        @timelog = Timelog.find(params[:id])
        authorize @timelog
      end

      def load_user
        @user = User.find(params[:user_id])
      end

      def filtered_timelogs
        authorize @user.timelogs
        if params[:filter]
          @user.timelogs.send params[:filter]
        elsif (params[:start_date] && params[:end_date])
          @user.timelogs.date_range(params[:start_date], params[:end_date])
        else
          @user.timelogs
        end
      end

  end    
end