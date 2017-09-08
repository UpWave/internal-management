class StatusPolicy
  attr_reader :current_user, :status

  def initialize(current_user, status)
    @current_user = current_user
    @status = status
  end

  def index?
    @current_user.admin?
  end
end
