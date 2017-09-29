class InvoicePolicy
  attr_reader :current_user, :model

  def initialize(current_user, model)
    @current_user = current_user
    @invoice = model
  end

  def index?
    @current_user.admin?
  end

end
