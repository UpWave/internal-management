require 'trello'
require 'will_paginate/array' 
class TimelogsController < ApplicationController
  before_action :authenticate_user!
  before_action :load_timelog, only: [:update, :destroy]
  before_action :load_trello_service


  def index
    if params[:filter]
      @timelogs = current_user.timelogs.paginate(:page => params[:page], :per_page => 5).send params[:filter] 
    elsif (params[:start_date] && params[:end_date])
      @timelogs = current_user.timelogs.paginate(:page => params[:page], :per_page => 5).date_range(params[:start_date], params[:end_date])
    else
      @timelogs = current_user.timelogs.paginate(:page => params[:page], :per_page => 5)  
    end
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
      flash[:success] = "Timelog updated"
      redirect_to user_timelogs_path
    else
      flash[:error] = "Something went wrong"
      redirect_to user_timelogs_path
    end
  end

  def new
    @timelog = current_user.timelogs.build
  end

  def destroy
    if @timelog.destroy
      flash[:success] = "Timelog deleted"
      redirect_to user_timelogs_path
    else
      flash[:error] = "Something went wrong"
      redirect_to user_timelogs_path
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
      @timelog = current_user.timelogs.find(params[:id])
      authorize @timelog
    end
    
end