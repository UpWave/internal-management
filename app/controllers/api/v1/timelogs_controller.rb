require 'trello'
class Api::V1::TimelogsController < Api::V1::BaseController
  before_action :authenticate_user!
  before_action :load_timelog, only: [:update, :destroy]
  before_action :load_trello_service, only: [:trello_cards]

  def index
    if ((params[:start_time] != "0") && (params[:end_time] != "0"))
      if params[:limit] == "0"
        @timelogs = current_user.timelogs.date_range(params[:start_time], params[:end_time]).count
      else 
        @timelogs = current_user.timelogs.date_range(params[:start_time], params[:end_time]).paginate(:page => (params[:page].to_i+1).to_s, :per_page => params[:limit])
        authorize @timelogs
      end    
    else
      if params[:limit] == "0"
        @timelogs = current_user.timelogs.count
      else 
        @timelogs = current_user.timelogs.paginate(:page => (params[:page].to_i+1).to_s, :per_page => params[:limit])
        authorize @timelogs
      end
    end
    respond_with @timelogs  
  end

  def trello_cards
    respond_with @trello_service.cards
  end

  def create
    @timelog = current_user.timelogs.build(timelogs_params)
    authorize @timelog
    if @timelog.save
      respond_with :api, :v1, @timelog
    end 
  end

  def update
    if @timelog.update_attributes(timelogs_params)
      respond_with @timelog, json: @timelog
    end
  end

  def new
    @timelog = current_user.timelogs.build
    authorize @timelog
  end

  def destroy
    respond_with @timelog.destroy
  end


  private
    def timelogs_params
      params.require(:timelog).permit(:start_time, :duration, :trello_card)
    end

    def load_trello_service
      @trello_service = TrelloService.new(current_user)
    end

    def load_timelog
      @timelog = current_user.timelogs.find(params[:id])
      authorize @timelog
    end
    
end