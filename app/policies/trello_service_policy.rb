class TrelloServicePolicy
  attr_reader :current_user, :model

  def initialize(current_user, model)
    @current_user = current_user
    @trello_service = model
  end

  def index?
    @trello_service.member_id == @current_user.identities.where(:provider => "trello").pluck("uid").first
  end

end
