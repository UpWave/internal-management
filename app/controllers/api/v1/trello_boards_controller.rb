class Api::V1::TrelloBoardsController < Api::V1::BaseController
  before_action :authenticate_user!
  before_action :load_trello_service

  def index
    if @trello_service
      authorize @trello_service
      render json: @trello_service.boards_with_cards
    else
      render json: { errors: 'Trello connection error' }, status: 422
    end
  end

  private
    def load_trello_service
      if current_user.has_trello?
        @trello_service = TrelloService.new(current_user)
      else
        @trello_service = nil
      end
    end
end
