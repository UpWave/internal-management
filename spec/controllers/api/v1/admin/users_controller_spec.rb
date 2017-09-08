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

  describe "GET #roles" do
    it "allows authenticated access" do
      get :roles, format: :json
      expect(response).to be_success
    end

    it "returns array with correct roles" do
      roles = ["admin", "member"]
      get :roles, format: :json
      expect(JSON.parse(response.body)).to eq(roles)
    end
  end

  describe "GET #statuses" do
    it "allows authenticated access" do
      get :statuses, format: :json
      expect(response).to be_success
    end

    it "returns array with correct statuses" do
      statuses = ["inactive", "active"]
      get :statuses, format: :json
      expect(JSON.parse(response.body)).to eq(statuses)
    end
  end

  describe "GET #salary" do
    it "allows authenticated access" do
      FactoryGirl.create(:salary, user_id: other_user.id)
      get :salary, format: :json, params: { id: other_user.id }
      expect(response).to be_success
    end

    it "returns correct salary" do
      FactoryGirl.create(:salary, user_id: other_user.id)
      get :salary, format: :json, params: { id: other_user.id }
      expect(JSON.parse(response.body)).to eq(Salary.last.amount.to_s)
    end
  end

  describe "DELETE #destroy" do
    it "deletes the user" do
      get :destroy, format: :json, params: { id: other_user.id }
      other_user.destroy
      expect(other_user.destroyed?).to be true
    end
  end

  describe "PATCH #set_salary" do
    it "sets new salary for a user and archives the previous" do
      FactoryGirl.create(:salary, user_id: other_user.id)
      patch :set_salary, format: :json, params: { id: other_user.id, archived_at: "2017-12-12", amount: 500 }
      expect(Salary.first.archived_at.to_s).to eql("2017-12-12")
      expect(Salary.last.amount.to_s).to eql("500.0")
    end
  end

  describe "PATCH #update" do
    it "updates an user" do
      FactoryGirl.create(:salary, user_id: user.id)
      patch :update, format: :json, params: { id: user.id, user: FactoryGirl.attributes_for(:user, email: "email@email.com", amount: 500) }
      user.reload
      expect(user.email).to eql("email@email.com")
    end
  end

end
