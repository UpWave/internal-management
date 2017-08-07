class TimelogsController < ApplicationController
  before_action :load_user

  def index
    @timelog = Timelog.where(user_id: current_user.id)
  end

  def create
    @timelog = @user.timelogs.create(timelog_params)
    if @timelog.save
      redirect_to user_timelogs_path(@user)
    end

  end

  def update
    @timelog = Timelog.find(params[:id])
    if params[:timelog][:duration] == ""
      params[:timelog][:duration] = 0
    end
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
      if params[:timelog][:duration] == ""
        params[:timelog][:duration] = 0
      end
      params.require(:timelog).permit(:start_time, :duration, :user_id)
    end

    def load_user
      @user = User.find(params[:user_id])
    end


end