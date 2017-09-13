class UserSkillPolicy
 attr_reader :current_user, :user_skill

 def initialize(current_user, user_skill)
   @current_user = current_user
   @user_skill = user_skill
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
