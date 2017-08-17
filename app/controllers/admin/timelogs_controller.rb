module Admin
  require 'trello' 
  class Admin::TimelogsController < ApplicationController
    before_action :authenticate_user!
    before_action :load_timelog, only: [:update, :destroy]
    before_action :load_trello_service, only: [:index, :new]

    def index
      if params[:filter]
        @timelogs = User.find(params[:user_id]).timelogs.paginate(page: params[:page], per_page: 5).send params[:filter] 
      elsif (params[:start_date] && params[:end_date])
        @timelogs = User.find(params[:user_id]).timelogs.paginate(page: params[:page], per_page: 5).date_range(params[:start_date], params[:end_date])
      else
        @timelogs = User.find(params[:user_id]).timelogs.paginate(page: params[:page], per_page: 5)  
      end
      authorize @timelogs
      respond_to do |format|
        format.html
        format.pdf do
          pdf = TimelogsPdf.new(@timelogs.paginate(page: params[:page], per_page: @timelogs.count))
          send_data pdf.render, filename: "Timelogs of user_id #{params[:user_id]}", type: "application/pdf", disposition: "inline"
        end
      end
    end

    def create
      @timelog = User.find(params[:user_id]).timelogs.build(timelogs_params)
      authorize @timelog
      if @timelog.save
        flash[:success] = "Timelog created"
        redirect_to admin_user_timelogs_path(User.find(params[:user_id]))
      else
        render :new
      end
    end

    def update
      if @timelog.update(timelogs_params)
        flash[:success] = "Timelog updated"
        redirect_to admin_user_timelogs_path(User.find(params[:user_id]))
      else
        flash[:error] = "Something went wrong"
        redirect_to admin_user_timelogs_path(User.find(params[:user_id]))
      end
    end

    def new
      @timelog = User.find(params[:user_id]).timelogs.build
      authorize @timelog
    end

    def destroy
      if @timelog.destroy
        flash[:success] = "Timelog deleted"
        redirect_to admin_user_timelogs_path(User.find(params[:user_id]))
      else
        flash[:error] = "Something went wrong"
        redirect_to admin_user_timelogs_path(User.find(params[:user_id]))
      end
    end

    private
      def timelogs_params
        params.require(:timelog).permit(:start_time, :duration, :user_id, :trello_card)
      end

      def load_trello_service
        @trello_service = TrelloService.new(User.find(params[:user_id]))
      end

      def load_timelog
        @timelog = Timelog.find(params[:id])
        authorize @timelog
      end

  end    
end