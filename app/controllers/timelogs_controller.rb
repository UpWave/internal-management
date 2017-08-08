class TimelogsController < ApplicationController
  before_action :authenticate_user!
  before_action :load_timelog, only: [:update, :destroy]

  def index
    @timelogs = current_user.timelogs
  end

  def create
    @timelog = current_user.timelogs.build(timelogs_params)
    if @timelog.save
      flash[:success] = "Timelog created"
      redirect_to user_timelogs_path
    else
      render :new
    end
  end

  def update
    if @timelog.update(timelogs_params)
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
      params.require(:timelog).permit(:start_time, :duration, :user_id)
    end

    def load_timelog
      @timelog = Timelog.find(params[:format])
      authorize @timelog
    end
    
end