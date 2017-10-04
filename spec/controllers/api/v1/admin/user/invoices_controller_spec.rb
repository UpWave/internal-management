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
      FactoryGirl.create(:salary, user_id: user.id, type: "per hour", amount: 10)
      FactoryGirl.create(:vacation, user_id: user.id, start_date: Date.today, status: "approved", type: "unpaid day offs")
      get :index, format: :json, params: { user_id: user.id }
      parsed_response = JSON.parse(response.body)
      expect(parsed_response["invoice"][0]["id"]).to eql(timelog.id)
      expect(parsed_response["user"]["id"]).to eql(user.id)
      expect(parsed_response["salary_type"]).to eql("per hour")
      expect(parsed_response["salary_amount"]).to eql(10)
      expect(parsed_response["day_offs_this_month"]).to eql(user.count_approved_day_offs_by_month(Date.today))
    end

    it "returns correct data with custom date passed" do
      timelog = FactoryGirl.create(:timelog, user_id: user.id, start_time: Date.today)
      new_timelog = FactoryGirl.create(:timelog, user_id: user.id, start_time: Date.today + 1.month)
      get :index, format: :json, params: { date: Date.today + 1.month, user_id: user.id }
      parsed_response = JSON.parse(response.body)
      expect(parsed_response["invoice"].length).to eql(1);
      expect(parsed_response["invoice"][0]["id"]).to eql(new_timelog.id)
    end
  end
end
