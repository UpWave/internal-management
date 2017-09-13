class UserPolicy
  attr_reader :current_user, :model

  def initialize(current_user, model)
    @current_user = current_user
    @user = model
  end

  def index?
    @current_user.admin?
  end

  def show?
    @current_user.admin?
  end

  def edit?
    @current_user.admin?
  end

  def update?
    @current_user.admin?
  end

  def destroy?
    @current_user.admin?
  end

  def roles
    @current_user.admin?
  end

  def statuses
    @current_user.admin?
  end

  def count_users
    @current_user.admin?
  end

  def skills?
    @current_user.admin?
  end

  def missing_skills?
    @current_user.admin?
  end

end
