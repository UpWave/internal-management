class SkillPolicy
 attr_reader :current_user, :skill

 def initialize(current_user, skill)
   @current_user = current_user
   @skill = skill
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

 def skill_types?
   @current_user.admin?
 end

end
