require 'rails_helper'

RSpec.describe Api::V1::Admin::VacationsController, type: :controller do
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

    it "returns correct data" do
      vacation = FactoryGirl.create(:vacation, user_id: other_user.id)
      get :index, format: :json
      api_response = JSON.parse(response.body)
      expect(api_response[0]["id"]).to eql(vacation.id)
      expect(api_response[0]["user"]["email"]).to eql(other_user.email)
    end
  end

  describe "GET #statuses" do
    it "allows authenticated access" do
      get :statuses, format: :json
      expect(response).to be_success
    end

    it "returns correct data" do
      vacation = FactoryGirl.create(:vacation, user_id: other_user.id)
      get :statuses, format: :json
      api_response = JSON.parse(response.body)
      expect(api_response["approved_status"]).to eql(Vacation.approved_status)
      expect(api_response["rejected_status"]).to eql(Vacation.rejected_status)
    end
  end

  describe "PATCH #update" do
    it "updates any vacation" do
      vacation = FactoryGirl.create(:vacation, user_id: user.id)
      other_vacation = FactoryGirl.create(:vacation, user_id: other_user.id)
      patch :update, format: :json, params: { id: vacation.id, vacation: { status: Vacation.rejected_status } }
      vacation.reload
      patch :update, format: :json, params: { id: other_vacation.id, vacation: { status: Vacation.approved_status } }
      other_vacation.reload
      expect(vacation.status).to eql('rejected')
      expect(other_vacation.status).to eql('approved')
    end
  end

end
