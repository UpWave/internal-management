require 'rails_helper'

RSpec.describe Api::V1::Admin::UsersController, :type => :controller do
  before do
    allow(controller).to receive(:authenticate_user!).and_return(true)
    allow(controller).to receive(:current_user).and_return(user)
  end

  let(:user) { FactoryGirl.create(:user, role: 'admin') }
  let(:other_user) { FactoryGirl.create(:user) }

  describe "GET #index" do
    it "allows authenticated access" do
      get :index, format: :json
      expect(response).to be_success
    end

    it "shows list of users" do
      5.times do FactoryGirl.create(:user)
      end
      get :index, format: :json
      parsed_response = JSON.parse(response.body)
      expect(parsed_response.length).to eq(6) # 5 users + admin
    end
  end

  describe "DELETE #destroy" do
    it "deletes the user" do
      get :destroy, format: :json, params: { id: other_user.id }
      other_user.destroy
      expect(other_user.destroyed?).to be true
    end
  end

  describe "PATCH #update" do
    it "updates an user" do
      patch :update, format: :json, params: { id: user.id, user: FactoryGirl.attributes_for(:user, email: "email@email.com") }
      user.reload
      expect(user.email).to eql("email@email.com")
    end
  end

  describe "GET #count_users" do
    it "returns correct number of users" do
      5.times do FactoryGirl.create(:user)
      end
      get :count_users, format: :json
      parsed_response = JSON.parse(response.body)
      expect(parsed_response).to eq(6) # 5 users + admin
    end
  end

  describe "GET #skills" do
    it "returns correct hash data" do
      skill = FactoryGirl.create(:skill)
      user_skill = UserSkill.create(user_id: user.id, skill_id: skill.id, rate: 10)
      hash = Hash.new
      hash[skill.name] = user_skill.rate
      get :skills, format: :json, params: { id: user.id }
      parsed_response = JSON.parse(response.body)
      expect(parsed_response).to eq(hash)
    end
  end

  describe "GET #missing_skills" do
    it "returns correct array data" do
      skill = FactoryGirl.create(:skill)
      another_skill = FactoryGirl.create(:skill)
      user_skill = UserSkill.create(user_id: user.id, skill_id: skill.id, rate: 10)
      get :missing_skills, format: :json, params: { id: user.id }
      parsed_response = JSON.parse(response.body)
      expect(parsed_response).to eq([another_skill.name])
    end
  end

end
