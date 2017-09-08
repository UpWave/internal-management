class SalaryPolicy
 attr_reader :current_user, :salary

 def initialize(current_user, salary)
   @current_user = current_user
   @salary = salary
 end

 def index?
   @current_user.admin?
 end

 def create?
   @current_user.admin?
 end

 def update?
   @current_user.admin?
 end

 def destroy?
   @current_user.admin?
 end

 def new?
   @current_user.admin?
 end

end
