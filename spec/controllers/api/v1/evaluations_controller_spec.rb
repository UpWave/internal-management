require 'rails_helper'

RSpec.describe Api::V1::EvaluationsController, type: :controller do
  before do
    allow(controller).to receive(:authenticate_user!).and_return(true)
    allow(controller).to receive(:current_user).and_return(user)
  end

  let(:user) { FactoryGirl.create(:user) }

  describe "GET #idnex" do
    it "returns success" do
      FactoryGirl.create(:evaluation, user_id: user.id, goals_attributes: [attributes_for(:goal)])
      get :index, format: :json, params: { user_id: user.id}
      expect(response).to be_success
    end
  end

end
