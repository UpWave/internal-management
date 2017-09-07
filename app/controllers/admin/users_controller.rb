module Admin
  class Admin::UsersController < ApplicationController
    before_action :authenticate_user!
    after_action :verify_authorized

    def index
    end
  end
end
