require 'rails_helper'

RSpec.describe Api::V1::ProfilesController, type: :controller do
  before do
    allow(controller).to receive(:authenticate_user!).and_return(true)
    allow(controller).to receive(:current_user).and_return(user)
  end

  let(:user) { FactoryGirl.create(:user) }

  describe "GET #show" do
    it "returns successfull response" do
      get :show, format: :json
      expect(response).to be_success
    end

    it "returns correct data" do
      get :show, format: :json
      parsed_response = JSON.parse(response.body)
      expect(parsed_response["id"]).to eql(user.id)
      expect(parsed_response["salary"]).to eql(user.salary)
      expect(parsed_response["photo"]).to eql(user.photo)
    end
  end

  describe "PATCH #update" do
    it "assigns avatar" do
      patch :update, format: :json, params: { avatar: fixture_file_upload('images/default_img.png', 'image/png') }
      expect(user.avatar_file_name).to eql("default_img.png")
    end
  end

end
