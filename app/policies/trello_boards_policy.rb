class TrelloBoardsPolicy
  attr_reader :current_user, :model

  def initialize(current_user, model)
    @current_user = current_user
    @trello_boards = model
  end

  def index?
    @current_user
  end

end
