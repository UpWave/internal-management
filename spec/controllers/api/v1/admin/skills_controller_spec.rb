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
      skill = FactoryGirl.create(:skill)
      skills = Hash.new
      skills[skill.name] = skill.id
      get :index, format: :json
      expect(JSON.parse(response.body)).to eq(skills)
    end
  end

  describe "GET #create" do
    it "creates a new skill" do
      skill = FactoryGirl.build(:skill)
      expect{
            post :create, format: :json, params: { skill: skill.attributes }
          }.to change(Skill, :count).by(1)
    end

    it "won't create a duplicate skill" do
      skill = FactoryGirl.create(:skill)
      expect{
            post :create, format: :json, params: { skill: skill.attributes }
          }.to_not change(Skill, :count)
    end
  end

  describe "DELETE #destroy" do
    it "destroys skill" do
      skill = FactoryGirl.create(:skill)
      expect{
            get :destroy, format: :json, params: { id: user.id, skill: { skill_id: skill.id } }
          }.to change(Skill, :count).by(-1)
    end
  end
end
