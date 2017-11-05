class EvaluationPolicy
  attr_reader :current_user, :model

  def initialize(user, model)
    @user = user
    @evaluation = model
  end

  def index?
    @user.admin?
  end

  def show?
    @user.admin?
  end

  def create?
    @user.admin?
  end

  def update?
    @user.admin?
  end

  def destroy?
    @user.admin?
  end

end
