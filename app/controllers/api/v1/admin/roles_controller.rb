class Api::V1::Admin::RolesController < Api::V1::BaseController
  before_action :authenticate_user!

  def index
    respond_with User.roles.keys
  end
end
