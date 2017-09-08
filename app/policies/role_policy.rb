class RolePolicy
  attr_reader :current_user, :role

  def initialize(current_user, role)
    @current_user = current_user
    @role = role
  end

  def index?
    @current_user.admin?
  end
end
