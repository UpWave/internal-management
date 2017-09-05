require 'rails_helper'

RSpec.describe Api::V1::Admin::TimelogsController, type: :controller do
  before do
    allow(controller).to receive(:authenticate_user!).and_return(true)
    allow(controller).to receive(:current_user).and_return(user)
    allow(controller).to receive(:load_trello_service).and_return(true)
  end

  let(:user) { FactoryGirl.create(:user, role: 'admin') }
  let(:other_user) { FactoryGirl.create(:user) }

  describe "GET #index" do
    it "renders the index template" do
      get :index, format: :json, params: { user_id: user.id, filter: '' }
      expect(response).to be_success
    end

    it "shows list of your timelogs" do
      5.times do FactoryGirl.create(:timelog, user_id: user.id)
      end
      get :index, format: :json, params: { user_id: user.id, filter: 'duration'}
      parsed_response = JSON.parse(response.body)
      expect(parsed_response.length).to eq(5)
    end

    it "shows list of other timelogs" do
      3.times do FactoryGirl.create(:timelog, user_id: other_user.id)
      end
      get :index, format: :json, params: { user_id: other_user.id, filter: 'duration'}
      parsed_response = JSON.parse(response.body)
      expect(parsed_response.length).to eq(3)
    end
  end

  describe "GET #create" do
    it "creates timelog with valid data" do
      timelog = FactoryGirl.create(:timelog, user_id: user.id)
      expect{
            post :create, format: :json, params: { user_id: user.id, timelog: timelog.attributes }
            }.to change(Timelog, :count).by(1)
    end

    it "refuses to create timelog with bad data" do
      timelog = FactoryGirl.build(:timelog, user_id: user.id, start_time: "text")
      expect{
            post :create, format: :json, params: { user_id: user.id, timelog: timelog.attributes }
            }.to_not change(Timelog, :count)
    end

    it "refuses to create timelog without trello card" do
      timelog = FactoryGirl.build(:timelog, user_id: user.id, trello_card: nil)
      expect{
            post :create, format: :json, params: { user_id: user.id, timelog: timelog.attributes }
            }.to_not change(Timelog, :count)
    end
  end

  describe "DELETE #destroy" do
    it "destroys your timelog" do
      timelog = FactoryGirl.create(:timelog, user_id: user.id)
      expect{
            get :destroy, format: :json, params: { user_id: user.id, id: timelog.id }
            }.to change(Timelog, :count).by(-1)
    end

    it "allow admin destroying other timelog" do
      timelog = FactoryGirl.create(:timelog, user_id: other_user.id)
      expect{
            get :destroy, format: :json, params: { user_id: user.id, id: timelog.id }
            }.to change(Timelog, :count).by(-1)
    end
  end

  describe "PATCH #update" do
    it "updates your timelog with valid data" do
      timelog = FactoryGirl.create(:timelog, user_id: user.id)
      other_timelog = FactoryGirl.create(:timelog, user_id: user.id)
      patch :update, format: :json, params: { user_id: user.id, id: timelog.id, timelog: other_timelog.attributes }
      timelog.reload
      expect(timelog.start_time).to eql(other_timelog.start_time)
    end

    it "updates other timelog with valid data" do
      timelog = FactoryGirl.create(:timelog, user_id: user.id)
      other_timelog = FactoryGirl.create(:timelog, user_id: other_user.id)
      patch :update, format: :json, params: { user_id: user.id, id: other_timelog.id, timelog: timelog.attributes }
      other_timelog.reload
      expect(other_timelog.start_time).to eql(timelog.start_time)
    end

    it "won't update your timelog with bad data" do
      timelog = FactoryGirl.create(:timelog, user_id: user.id)
      bad_timelog = FactoryGirl.build(:timelog, user_id: user.id, start_time: "text")
      patch :update, format: :json, params: { user_id: user.id, id: timelog.id, timelog: bad_timelog.attributes }
      timelog.reload
      expect(timelog.start_time).to_not eql(bad_timelog.start_time)
    end
  end

end
