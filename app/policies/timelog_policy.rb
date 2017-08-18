 class TimelogPolicy
  attr_reader :current_user, :timelog

  def initialize(current_user, timelog)
    @current_user = current_user
    @timelog = timelog
  end

  def index?
    @current_user.admin? || @timelog.empty? || (@timelog.first.user_id == @current_user.id)
  end

  def create?
    @current_user.admin? || (@timelog.user_id == @current_user.id)
  end

  def update?
    @current_user.admin? || (@timelog.user_id == @current_user.id)
  end

  def destroy?
    @current_user.admin? || (@timelog.user_id == @current_user.id)
  end

  def new?
    @current_user.admin? || (@timelog.user_id == @current_user.id)
  end
  
end