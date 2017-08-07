class TimelogsController < ApplicationController

  def index
    @user = User.find(params[:user_id])
    @timelog = Timelog.where(user_id: current_user.id)
  end

  def create
    @user = User.find(params[:user_id])
    @timelog = @user.timelogs.create(timelog_params)
    if @timelog.save
      redirect_to user_timelogs_path(@user)
    end

  end

  def show
  end

  def update
  end

  def new
    @timelog = Timelog.new
  end

  def destroy
    @user = User.find(params[:user_id])
    @timelog = Timelog.find(params[:id])
    if @timelog.destroy
      flash[:success] = "Timelog deleted"
      redirect_to user_timelogs_path(@user)
    else
      flash[:error] = "Something went wrong"
      redirect_to user_timelogs_path(@user)
    end

  end


  private
    def timelog_params
      params.require(:timelog).permit(:start_time, :duration, :user_id)
    end


end