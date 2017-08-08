class TimelogPolicy
  attr_reader :current_user, :timelog

  def initialize(current_user, timelog)
    @current_user = current_user
    @timelog = timelog
  end

  def index?
    current_user
  end

  def create?
    current_user
  end

  def update?
    current_user && timelog.try(:user_id) == current_user.id 
  end

  def destroy?
    current_user && timelog.try(:user_id) == current_user.id
  end

  def new?
    current_user
  end



end