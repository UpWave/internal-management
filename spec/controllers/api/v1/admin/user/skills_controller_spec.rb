require 'rails_helper'

RSpec.describe Api::V1::Admin::User::SkillsController, type: :controller do
  before do
    allow(controller).to receive(:authenticate_user!).and_return(true)
    allow(controller).to receive(:current_user).and_return(user)
  end

  let(:user) { FactoryGirl.create(:user, role: 'admin') }

  describe "GET #index" do
    it "returns correct data" do
      skill = FactoryGirl.create(:skill)
      user_skill = UserSkill.create(user_id: user.id, skill_id: skill.id, rate: 10)
      get :index, format: :json, params: { user_id: user.id }
      parsed_response = JSON.parse(response.body)
      expect(parsed_response[0]['skill_id']).to eq(user.user_skills[0].skill_id)
    end
  end

  describe "GET #missing" do
    it "returns correct data" do
      skill = FactoryGirl.create(:skill)
      another_skill = FactoryGirl.create(:skill)
      user_skill = UserSkill.create(user_id: user.id, skill_id: skill.id, rate: 10)
      get :missing, format: :json, params: { user_id: user.id }
      parsed_response = JSON.parse(response.body)
      expect(parsed_response[0]['id']).to eq(another_skill.id)
    end
  end

  describe "GET #create" do
    it "creates skill rate for a user" do
      skill = FactoryGirl.create(:skill)
      expect{
            post :create, format: :json, params: { user_id: user.id, user_skill: { user_id: user.id, skill_id: skill.id, rate: 10 } }
          }.to change(UserSkill, :count).by(1)
    end
    it "won't create duplicate skill rate" do
      skill = FactoryGirl.create(:skill)
      UserSkill.create(user_id: user.id, skill_id: skill.id, rate: 10)
      expect{
            post :create, format: :json, params: { user_id: user.id, user_skill: { user_id: user.id, skill_id: skill.id, rate: 5 } }
          }.to change(UserSkill, :count).by(0)
    end
  end

  describe "DELETE #destroy" do
    it "destroys skill rate" do
      skill = FactoryGirl.create(:skill)
      UserSkill.create(user_id: user.id, skill_id: skill.id, rate: 10)
      expect{
            get :destroy, format: :json, params: { user_id: user.id, id: skill.id }
          }.to change(UserSkill, :count).by(-1)
    end
  end
end
