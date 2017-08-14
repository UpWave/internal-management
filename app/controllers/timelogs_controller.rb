require 'trello'
class TimelogsController < ApplicationController
  before_action :authenticate_user!
  before_action :load_timelog, only: [:update, :destroy]
  before_action :load_trello_service


  def index
    if params[:filter]
      @timelogs = current_user.timelogs.send params[:filter] 
    else
      @timelogs = current_user.timelogs
      if (params[:start_date] && params[:end_date]) 
        @timelogs = current_user.timelogs.date_range(params[:start_date], params[:end_date])
      end
    end
  end

  def create
    @timelog = current_user.timelogs.build(timelogs_params)
    if @timelog.save
      @timelog.update_attribute(:end_time, @timelog.start_time + @timelog.duration.to_i.minutes)
      flash[:success] = "Timelog created"
      redirect_to user_timelogs_path
    else
      render :new
    end
  end

  def update
    if @timelog.update(timelogs_params)
      @timelog.update_attribute(:end_time, @timelog.start_time + @timelog.duration.to_i.minutes)
      flash[:success] = "Duration updated"
      redirect_to user_timelogs_path(current_user)
    else
      flash[:error] = "Something went wrong"
      redirect_to user_timelogs_path(current_user)
    end
  end

  def new
    @timelog = current_user.timelogs.build
  end

  def destroy
    if @timelog.destroy
      flash[:success] = "Timelog deleted"
      redirect_to user_timelogs_path(current_user)
    else
      flash[:error] = "Something went wrong"
      redirect_to user_timelogs_path(current_user)
    end
  end


  private
    def timelogs_params
      params.require(:timelog).permit(:start_time, :duration, :user_id, :trello_card)
    end

    def load_trello_service
      @trello_service = TrelloService.new(current_user)
    end

    def load_timelog
      @timelog = Timelog.find(params[:format])
      authorize @timelog
    end
    
end