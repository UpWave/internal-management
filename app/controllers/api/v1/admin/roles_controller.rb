class Api::V1::Admin::RolesController < Api::V1::BaseController
  before_action :authenticate_user!

  def index
    policy(current_user).roles
    respond_with User.roles.keys
  end
end
