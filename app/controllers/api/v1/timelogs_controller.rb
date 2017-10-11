require 'trello'
class Api::V1::TimelogsController < Api::V1::BaseController
  before_action :authenticate_user!
  before_action :load_timelog, only: [:update, :destroy]
  before_action :load_trello_service, only: [:trello_cards, :boards_with_cards]

  def index
    @timelogs = filtered_timelogs.paginate(:page => (params[:page].to_i+1).to_s, :per_page => params[:limit])
    authorize @timelogs
    respond_with @timelogs
  end

  def count_timelogs
    respond_with filtered_timelogs.count
  end

  def trello_cards
    if @trello_service
      respond_with @trello_service.cards
    else
      render json: { errors: 'Trello connection error' }, status: 422
    end
  end

  def boards_with_cards
    all_data = @trello_service.boards_with_cards
    test_arr = []
    all_data.each do |board|
      board_info = Hash.new
      board_info[board[0]] = board[1]
      test_arr << board_info
    end
    render json: test_arr
  end

  def create
    @timelog = current_user.timelogs.build(timelogs_params)
    authorize @timelog
    if @timelog.save
      respond_with :api, :v1, @timelog
    else
      render json: { errors: @timelog.errors.full_messages }, status: 422
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
    if @timelog.destroy
      render json: { }, status: 200
    else
      render json: { errors: "Error when deleting!" }, status: 422
    end
  end


  private
    def timelogs_params
      params.require(:timelog).permit(:start_time, :duration, :trello_card)
    end

    def load_trello_service
      if current_user.has_trello?
        @trello_service = TrelloService.new(current_user)
      else
        @trello_service = nil
      end
    end

    def filtered_timelogs
      if params[:filter] != ""
        current_user.timelogs.send params[:filter]
      elsif ((params[:start_time] != "0") && (params[:end_time] !="0"))
        current_user.timelogs.date_range(params[:start_time], params[:end_time])
      else
        current_user.timelogs
      end
    end

    def load_timelog
      @timelog = current_user.timelogs.find(params[:id])
      authorize @timelog
    end

end
