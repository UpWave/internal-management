require 'rails_helper'

RSpec.describe Api::V1::Admin::User::InvoicesController, type: :controller do
  before do
    allow(controller).to receive(:authenticate_user!).and_return(true)
    allow(controller).to receive(:current_user).and_return(user)
  end

  let(:user) { FactoryGirl.create(:user, role: 'admin') }

  describe "GET #index" do
    it "allows authenticated access" do
      get :index, format: :json, params: { user_id: user.id }
      expect(response).to be_success
    end

    it "returns correct data" do
      timelog = FactoryGirl.create(:timelog, user_id: user.id, start_time: Date.today)
      get :index, format: :json, params: { user_id: user.id }
      parsed_response = JSON.parse(response.body)
      expect(parsed_response[0][0]["id"]).to eql(timelog.id)
      expect(parsed_response[1]).to eql(user.email)
    end

    it "returns correct data with custom date passed" do
      timelog = FactoryGirl.create(:timelog, user_id: user.id, start_time: Date.today)
      new_timelog = FactoryGirl.create(:timelog, user_id: user.id, start_time: Date.today + 1.month)
      get :index, format: :json, params: { date: Date.today + 1.month, user_id: user.id }
      parsed_response = JSON.parse(response.body)
      expect(parsed_response[0].length).to eql(1);
      expect(parsed_response[0][0]["id"]).to eql(new_timelog.id)
    end
  end
end
