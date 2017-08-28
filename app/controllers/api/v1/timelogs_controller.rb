require 'trello'
require 'will_paginate/array' 
class Api::V1::TimelogsController < Api::V1::BaseController
  skip_before_action :verify_authenticity_token
  before_action :authenticate_user!
  before_action :load_timelog, only: [:update, :destroy]
  before_action :load_trello_service


  def index
    @timelogs = current_user.timelogs
    respond_with @timelogs  
    authorize @timelogs
  end

  def create
    @timelog = current_user.timelogs.build(timelogs_params)
    respond_with :api, :v1, @timelog 
    authorize @timelog
    if @timelog.save
      flash[:success] = "Timelog created"
      redirect_to user_timelogs_path
    end
  end

  def update
    if @timelog.update_attributes(timelogs_params)
      flash[:success] = "Timelog updated"
      respond_with @timelog, json: @timelog
    else
      flash[:error] = "Something went wrong"
      redirect_to user_timelogs_path
    end
  end

  def new
    @timelog = current_user.timelogs.build
    authorize @timelog
  end

  def destroy
    respond_with @timelog.destroy
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