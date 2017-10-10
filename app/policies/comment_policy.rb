class CommentPolicy
  attr_reader :current_user, :comment

  def initialize(current_user, comment)
    @current_user = current_user
    @comment = comment
  end

  def index?
    @current_user.admin?
  end

  def create?
    @current_user.admin?
  end

  def update?
    true if @current_user.admin? && @current_user.id == @comment.author_id
  end

  def destroy?
    true if @current_user.admin? && @current_user.id == @comment.author_id
  end

end
