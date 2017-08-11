require 'rails_helper'

RSpec.describe TimelogsController, type: :controller do
  before do
    allow(controller).to receive(:authenticate_user!).and_return(true)
    allow(controller).to receive(:current_user).and_return(user)
    allow(controller).to receive(:load_trello_service).and_return(true)
  end

  let(:user) { FactoryGirl.create(:user) }
  let(:admin) { FactoryGirl.create(:user, role: 'admin') }
  let(:other_user) { FactoryGirl.create(:user) }
  
  describe "GET #index" do    
    it "renders the index template" do
      get :index, params: { user_id: user.id }
      expect(response).to render_template("index")
    end

    it "shows list of your timelogs" do
      5.times do FactoryGirl.create(:timelog, user_id: user.id)
      end
      get :index, params: { user_id: user.id }
      expect(assigns[:timelogs].size).to eq 5
    end
  end
  
  describe "GET #create" do
    it "creates timelog with valid data" do
      timelog = FactoryGirl.build(:timelog, user_id: user.id)
      expect{
        post :create, params: { timelog: timelog.attributes }
        }.to change(Timelog, :count).by(1)
    end

    it "refuses to create timelog with bad data" do
      timelog = FactoryGirl.build(:timelog, user_id: user.id, start_time: "text")
      expect{
        post :create, params: { timelog: timelog.attributes }
        }.to_not change(Timelog, :count)
    end

    it "refuses to create timelog without trello card" do
      timelog = FactoryGirl.build(:timelog, user_id: user.id, trello_card: nil)
      expect{
        post :create, params: { timelog: timelog.attributes }
        }.to_not change(Timelog, :count)
    end
  end

  describe "DELETE #destroy" do
    it "destroys your timelog" do
      timelog = FactoryGirl.create(:timelog, user_id: user.id)
      expect{
        get :destroy, params: { id: user.id, format: timelog.id }
        }.to change(Timelog, :count).by(-1)
    end

    it "prevents destroying other timelog" do
      timelog = FactoryGirl.create(:timelog, user_id: other_user.id)
      expect{
        get :destroy, params: { id: user.id, format: timelog.id }
        }.to_not change(Timelog, :count)
    end
    
    it "allows admin to destroy any timelog" do
      timelog = FactoryGirl.create(:timelog, user_id: user.id)
      expect{
        get :destroy, params: { id: admin.id, format: timelog.id }
        }.to change(Timelog, :count).by(-1)
    end   
  end

  describe "PATCH #update" do
    it "updates your timelog with valid data" do
      timelog = FactoryGirl.create(:timelog, user_id: user.id)
      other_timelog = FactoryGirl.create(:timelog, user_id: user.id)
      patch :update, params: { id: user.id, format: timelog.id, timelog: other_timelog.attributes }
      timelog.reload
      expect(timelog.start_time).to eql(other_timelog.start_time)
    end

    it "admin can update any timelog with valid data" do
      timelog = FactoryGirl.create(:timelog, user_id: user.id)
      other_timelog = FactoryGirl.create(:timelog, user_id: user.id)
      patch :update, params: { id: admin.id, format: timelog.id, timelog: other_timelog.attributes }
      timelog.reload
      expect(timelog.start_time).to eql(other_timelog.start_time)
    end

    it "won't update not your timelog with valid data" do
      timelog = FactoryGirl.create(:timelog, user_id: user.id)
      other_timelog = FactoryGirl.create(:timelog, user_id: other_user.id)
      patch :update, params: { id: user.id, format: other_timelog.id, timelog: timelog.attributes }
      other_timelog.reload
      expect(other_timelog).to eql(other_timelog)
    end

    it "won't update your timelog with bad data" do
      timelog = FactoryGirl.create(:timelog, user_id: user.id)
      bad_timelog = FactoryGirl.build(:timelog, user_id: user.id, start_time: "text")
      patch :update, params: { id: user.id, format: timelog.id, timelog: bad_timelog.attributes }
      timelog.reload
      expect(timelog.start_time).to_not eql(bad_timelog.start_time)
    end

    it "admin won't update timelog with bad data" do
      timelog = FactoryGirl.create(:timelog, user_id: user.id)
      bad_timelog = FactoryGirl.build(:timelog, user_id: user.id, start_time: "text")
      patch :update, params: { id: admin.id, format: timelog.id, timelog: bad_timelog.attributes }
      timelog.reload
      expect(timelog.start_time).to_not eql(bad_timelog.start_time)
    end
  end
  
end