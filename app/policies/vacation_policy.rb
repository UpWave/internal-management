 class VacationPolicy
  attr_reader :current_user, :vacation

  def initialize(current_user, vacation)
    @current_user = current_user
    @vacation = vacation
  end

  def index?
    @current_user.admin?
  end

  def users?
    @current_user.admin?
  end

  def statuses?
    @current_user.admin?
  end

  def create?
    @current_user.admin? || (@vacation.user_id == @current_user.id)
  end

  def update?
    @current_user.admin?
  end

  def destroy?
    @current_user.admin? || (@vacation.user_id == @current_user.id)
  end

  def new?
    @current_user.admin? || (@vacation.user_id == @current_user.id)
  end

end
