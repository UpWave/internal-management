require 'trello'
class Api::V1::TrelloBoardsController < Api::V1::BaseController
  before_action :authenticate_user!
  before_action :load_trello_service

  def index
    if @trello_service
      board_info = Hash.new
      @trello_service.boards_with_cards.each do |board|
        board_info[board[0]] = board[1]
      end
      render json: board_info
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
