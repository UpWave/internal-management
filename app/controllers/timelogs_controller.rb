class TimelogsController < ApplicationController

  def index
    @timelogs = current_user.timelogs
  end

  def create
    @timelog = current_user.timelogs.build(timelogs_params)
    if @timelog.save
      redirect_to user_timelogs_path
    else
      render :new
    end
  end

  def update
    @timelog = Timelog.find(params[:format])
    @timelog.duration = params[:timelog][:duration]
    if @timelog.save
      flash[:success] = "Duration updated"
      redirect_to user_timelogs_path(@user)
    else
      flash[:error] = "Something went wrong"
      redirect_to user_timelogs_path(@user)
    end
  end

  def new
    @timelog = Timelog.new
  end

  def destroy
    @timelog = Timelog.find(params[:format])
    if @timelog.destroy
      flash[:success] = "Timelog deleted"
      redirect_to user_timelogs_path(@user)
    else
      flash[:error] = "Something went wrong"
      redirect_to user_timelogs_path(@user)
    end

  end


  private
    def timelogs_params
      params.require(:timelog).permit(:start_time, :duration, :user_id)
    end

end