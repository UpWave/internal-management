require 'rails_helper'

RSpec.describe Api::V1::VacationsController, type: :controller do
  before do
    allow(controller).to receive(:authenticate_user!).and_return(true)
    allow(controller).to receive(:current_user).and_return(user)
  end

  let(:user) { FactoryGirl.create(:user) }
  let(:other_user) { FactoryGirl.create(:user) }

  describe "GET #index" do
    it "returns successfull response" do
      get :index, format: :json, params: { user_id: user.id }
      expect(response).to be_success
    end

    it "returns list of your vacations" do
      5.times do FactoryGirl.create(:vacation, user_id: user.id)
      end
      get :index, format: :json, params: { user_id: user.id }
      parsed_response = JSON.parse(response.body)
      expect(parsed_response.length).to eq(5)
    end
  end

  describe "POST #create" do
    it "creates your vacation" do
      vacation = FactoryGirl.build(:vacation, user_id: user.id)
      expect{
            post :create, format: :json, params: { vacation: vacation.attributes }
            }.to change(Vacation, :count).by(1)
    end

    it "refuses to create vacation with bad data" do
      vacation = FactoryGirl.build(:vacation, user_id: other_user.id, end_date: Date.today - 1.year)
      expect{
            post :create, format: :json, params: { vacation: vacation.attributes }
            }.to_not change(Vacation, :count)
    end

  end

  describe "DELETE #destroy" do
    it "destroys your vacation" do
      vacation = FactoryGirl.create(:vacation, user_id: user.id)
      expect{
            get :destroy, format: :json, params: { id: vacation.id }
            }.to change(Vacation, :count).by(-1)
    end

    it "prevents destroying other vacation" do
      vacation = FactoryGirl.create(:vacation, user_id: other_user.id)
      expect{
            get :destroy,format: :json,  params: { id: vacation.id }
            }.to raise_error(ActiveRecord::RecordNotFound)
    end
  end

  describe "PATCH #update" do
    it "won't update your vacation" do
      vacation = FactoryGirl.create(:vacation, user_id: user.id)
      other_vacation = FactoryGirl.create(:vacation, user_id: user.id)
      patch :update, format: :json, params: { id: vacation.id, vacation: other_vacation.attributes }
      vacation.reload
      expect(vacation.start_date).not_to eql(other_vacation.start_date)
    end

    it "won't update not your vacation" do
      vacation = FactoryGirl.create(:vacation, user_id: user.id)
      other_vacation = FactoryGirl.create(:vacation, user_id: other_user.id)
      expect{
            patch :update, format: :json, params: { id: other_vacation.id, vacation: vacation.attributes }
            }.to raise_error(ActiveRecord::RecordNotFound)
    end
  end

end
