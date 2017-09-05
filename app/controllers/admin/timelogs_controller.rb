module Admin
  class Admin::TimelogsController < ApplicationController
    before_action :authenticate_user!

    def index
    end

  end
end
