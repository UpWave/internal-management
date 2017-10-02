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

  describe "GET #create" do
    it "creates a user" do
      expect{
            post :create, format: :json, params: { user: { email: 'basicmail@gmail.com', role: 'member', status: 'active', password: "qwerty12" } }
            }.to change(User, :count).by(1)
    end

    it "won't create a user with invalid data" do
      new_user = FactoryGirl.create(:user)
      post :create, format: :json, params: { user: { email: new_user.email, role: 'member', status: 'active', password: "qwerty12" } }
      expect(JSON.parse(response.body)["errors"][0]).to eq("Email has already been taken")
      post :create, format: :json, params: { user: { email: "wowmail@such.com", role: 'member', status: 'active', password: "pass" } }
      expect(JSON.parse(response.body)["errors"][0]).to eq("Password is too short (minimum is 6 characters)")
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

end
