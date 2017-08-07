require 'rails_helper'

RSpec.describe TimelogsController, type: :controller do
  before do
    allow(controller).to receive(:current_user).and_return(user)
  end

  let(:user) { FactoryGirl.create(:user) }

  describe "GET #index" do
    
    it "renders the index template" do
      get :index, params: { user_id: user.id }
      expect(response).to render_template("index")
    end

  end
  
end
