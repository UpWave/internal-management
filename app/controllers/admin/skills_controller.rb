module Admin
  class Admin::SkillsController < ApplicationController
    before_action :authenticate_user!

    def index
    end

  end
end
