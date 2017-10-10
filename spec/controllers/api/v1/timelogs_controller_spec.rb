require 'rails_helper'

RSpec.describe Api::V1::TimelogsController, type: :controller do
  before do
    allow(controller).to receive(:authenticate_user!).and_return(true)
    allow(controller).to receive(:current_user).and_return(user)
  end

  let(:user) { FactoryGirl.create(:user) }
  let(:other_user) { FactoryGirl.create(:user) }

  describe "GET #index" do
    it "returns successfull response " do
      get :index, format: :json, params: { user_id: user.id, filter: '' }
      expect(response).to be_success
    end

    it "returns your data" do
      5.times do
        FactoryGirl.create(:timelog, user_id: user.id)
      end
      get :index, format: :json, params: { user_id: user.id, filter: 'duration' }
      parsed_response = JSON.parse(response.body)
      expect(parsed_response.length).to eq(5)
    end

    it "won't return other user data" do
      5.times do
        FactoryGirl.create(:timelog, user_id: other_user.id)
      end
      get :index, format: :json, params: { user_id: other_user.id, filter: 'duration' }
      parsed_response = JSON.parse(response.body)
      expect(parsed_response.length).to eq(0)
    end
  end

  describe "GET #create" do
    it "creates new timelog" do
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

    it "refuses to create timelog for other_user" do
      timelog = FactoryGirl.create(:timelog, user_id: user.id)
      post :create, format: :json, params: { user_id: other_user.id, timelog: timelog.attributes }
      expect(Timelog.last.user_id).to_not eql(other_user.id)
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

    it "won't update other timelog" do
      timelog = FactoryGirl.create(:timelog, user_id: user.id)
      other_timelog = FactoryGirl.create(:timelog, user_id: other_user.id)
      expect{
        patch :update, format: :json, params: { user_id: user.id, id: other_timelog.id, timelog: timelog.attributes }
      }.to raise_error(ActiveRecord::RecordNotFound)
    end

    it "won't update your timelog with bad data" do
      timelog = FactoryGirl.create(:timelog, user_id: user.id)
      bad_timelog = FactoryGirl.build(:timelog, user_id: user.id, start_time: "text")
      patch :update, format: :json, params: { user_id: user.id, id: timelog.id, timelog: bad_timelog.attributes }
      timelog.reload
      expect(timelog.start_time).to_not eql(bad_timelog.start_time)
    end
  end

  describe "DELETE #destroy" do
    it "destroys your timelog" do
      timelog = FactoryGirl.create(:timelog, user_id: user.id)
      expect{
            get :destroy, format: :json, params: { user_id: user.id, id: timelog.id }
            }.to change(Timelog, :count).by(-1)
    end

    it "won't destroy other timelog" do
      timelog = FactoryGirl.create(:timelog, user_id: other_user.id)
      expect{
            get :destroy, format: :json, params: { user_id: user.id, id: timelog.id }
          }.to raise_error(ActiveRecord::RecordNotFound)
    end
  end

  describe "GET #trello_cards" do
    it "will return error when user doesn't have trello" do
      get :trello_cards, format: :json, params: { user_id: user.id }
      parsed_response = JSON.parse(response.body)
      expect(parsed_response["errors"]).to eq('Trello connection error')
    end

    it "will return correct cards" do
      # dummy account for test purposes
      user.identities.create(
        provider: 'trello',
        access_token: '5c7abab8dd49ab4d9f244669820ae5120cee59d78d08f54ebf914373a3e7547a',
        secret_token: '8238e025956453eb02120c7b962e3893',
        uid: '59dc95fb9b71e96a24045308'
      )
      cards = ['Card for a test', 'Another test card']
      get :trello_cards, format: :json, params: { user_id: user.id }
      parsed_response = JSON.parse(response.body)
      expect(parsed_response).to eq(cards)
    end
  end
end
