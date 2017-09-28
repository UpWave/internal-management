require 'trello'
class Api::V1::Admin::TimelogsController < Api::V1::BaseController
  before_action :authenticate_user!
  before_action :load_user
  before_action :load_timelog, only: [:update, :destroy]
  before_action :load_trello_service, only: [:trello_cards]

  def index
    respond_to do |format|
      format.json do
        @timelogs = filtered_timelogs.paginate(:page => (params[:page].to_i+1).to_s, :per_page => params[:limit])
        authorize @timelogs
        respond_with @timelogs
      end
      format.pdf do
        pdf = TimelogsPdf.new(filtered_timelogs, @user)
        send_data pdf.render, filename: "Timelogs of #{@user.email}", type: "application/pdf", disposition: "attachment"
      end
      format.csv do
        send_data filtered_timelogs.to_csv, filename: "CSV Timelogs of #{@user.email}"
      end
    end
  end

  def count_timelogs
    respond_with filtered_timelogs.count
  end

  def trello_cards
    respond_with @trello_service.cards
  end

  def create
    @timelog = @user.timelogs.build(timelogs_params)
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
    else
      render json: { errors: @timelog.errors.full_messages }, status: 422
    end
  end

  def new
    @timelog = @user.timelogs.build
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
      params.require(:timelog).permit(:start_time, :duration, :user_id, :trello_card)
    end

    def load_trello_service
      @trello_service = TrelloService.new(@user)
    end

    def load_timelog
      @timelog = Timelog.find(params[:id])
      authorize @timelog
    end

    def load_user
      @user = User.find(params[:user_id])
    end

    def filtered_timelogs
      if params[:filter] != ""
        @user.timelogs.send params[:filter]
      elsif ((params[:start_time] != "0") && (params[:end_time] !="0"))
        @user.timelogs.date_range(params[:start_time], params[:end_time])
      else
        @user.timelogs
      end
    end
  end
