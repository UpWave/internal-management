require 'rails_helper'

RSpec.describe Api::V1::Admin::UserSkillsController, type: :controller do
  before do
    allow(controller).to receive(:authenticate_user!).and_return(true)
    allow(controller).to receive(:current_user).and_return(user)
  end

  let(:user) { FactoryGirl.create(:user, role: 'admin') }

  describe "GET #create" do
    it "creates skill rate for a user" do
      Skill.create(name: "DevOps")
      expect{
            post :create, format: :json, params: { user_skill: { user_id: user.id, name: "DevOps", rate: 10 } }
          }.to change(UserSkill, :count).by(1)
    end
    it "won't create duplicate skill rate" do
      Skill.create(name: "DevOps")
      UserSkill.create(user_id: user.id, skill_id: Skill.first.id, rate: 10)
      expect{
            post :create, format: :json, params: { user_skill: { user_id: user.id, name: "DevOps", rate: 5 } }
          }.to change(UserSkill, :count).by(0)
    end
  end

  describe "DELETE #destroy" do
    it "destroys skill rate" do
      Skill.create(name: "DevOps")
      UserSkill.create(user_id: user.id, skill_id: Skill.first.id, rate: 10)
      expect{
            get :destroy, format: :json, params: { id: user.id, user_skill: { user_id: user.id, name: "DevOps" } }
          }.to change(UserSkill, :count).by(-1)
    end
  end
end
