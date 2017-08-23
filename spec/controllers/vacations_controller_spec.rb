require 'rails_helper'

RSpec.describe VacationsController, type: :controller do
  before do
    allow(controller).to receive(:authenticate_user!).and_return(true)
    allow(controller).to receive(:current_user).and_return(user)
  end

  let(:user) { FactoryGirl.create(:user) }
  let(:other_user) { FactoryGirl.create(:user) }
  
  describe "GET #index" do    
    it "renders the index template" do
      get :index, params: { user_id: user.id }
      expect(response).to render_template("index")
    end

    it "shows list of your vacations" do
      5.times do FactoryGirl.create(:vacation, user_id: user.id)
      end
      get :index, params: { user_id: user.id }
      expect(assigns[:vacations].size).to eq 5
    end
  end
  
  describe "GET #create" do
    it "creates your vacation" do
      vacation = FactoryGirl.build(:vacation, user_id: user.id)
      expect{
            post :create, params: { vacation: vacation.attributes }
            }.to change(Vacation, :count).by(1)
    end

    it "refuses to create vacation with bad data" do
      vacation = FactoryGirl.build(:vacation, user_id: other_user.id, end_date: Date.today - 1.year)
      expect{
            post :create, params: { vacation: vacation.attributes }
            }.to_not change(Vacation, :count)
    end
  end

  describe "DELETE #destroy" do
    it "destroys your vacation" do
      vacation = FactoryGirl.create(:vacation, user_id: user.id)
      expect{
            get :destroy, params: { id: vacation.id }
            }.to change(Vacation, :count).by(-1)
    end

    it "prevents destroying other vacation" do
      vacation = FactoryGirl.create(:vacation, user_id: other_user.id)
      expect{
            get :destroy, params: { id: vacation.id }
            }.to raise_error(ActiveRecord::RecordNotFound)
    end  
  end

  describe "PATCH #update" do
    it "won't update your vacation" do
      vacation = FactoryGirl.create(:vacation, user_id: user.id)
      other_vacation = FactoryGirl.create(:vacation, user_id: user.id)
      patch :update, params: { id: vacation.id, vacation: other_vacation.attributes }
      vacation.reload
      expect(vacation.start_date).not_to eql(other_vacation.start_date)
    end

    it "won't update not your vacation" do
      vacation = FactoryGirl.create(:vacation, user_id: user.id)
      other_vacation = FactoryGirl.create(:vacation, user_id: other_user.id)
      expect{
            patch :update, params: { id: other_vacation.id, vacation: vacation.attributes }
            }.to raise_error(ActiveRecord::RecordNotFound)      
    end
  end

end