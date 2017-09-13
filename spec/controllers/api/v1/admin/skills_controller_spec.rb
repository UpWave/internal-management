require 'rails_helper'

RSpec.describe Api::V1::Admin::SkillsController, type: :controller do
  before do
    allow(controller).to receive(:authenticate_user!).and_return(true)
    allow(controller).to receive(:current_user).and_return(user)
  end

  let(:user) { FactoryGirl.create(:user, role: 'admin') }

  describe "GET #index" do
    it "allows authenticated access" do
      get :index, format: :json
      expect(response).to be_success
    end

    it "returns array with correct skills" do
      Skill.create(name: "Random Skill")
      Skill.create(name: "Another skill")
      skills = ["Random Skill", "Another skill"]
      get :index, format: :json
      expect(JSON.parse(response.body)).to eq(skills)
    end
  end
end
