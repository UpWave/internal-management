require 'rails_helper'

RSpec.describe TimelogsController, type: :controller do
  before do
    allow(controller).to receive(:authenticate_user!).and_return(true)
    allow(controller).to receive(:current_user).and_return(user)
  end
  let(:user) { FactoryGirl.create(:user) }
  let(:timelog) { FactoryGirl.create(:timelog) }
  
  describe "GET #index" do
    
    it "renders the index template" do
      get :index, params: { user_id: user.id }
      expect(response).to render_template("index")
    end
  end
  
  describe "GET #create" do
    
    it "creates timelog with valid data" do
      get :create, params: { timelog: timelog}
      expect(timelog.valid?).to be true
    end
  end
  
end