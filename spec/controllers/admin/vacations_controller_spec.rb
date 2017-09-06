require 'rails_helper'

RSpec.describe Admin::VacationsController, type: :controller do
  before do
    allow(controller).to receive(:authenticate_user!).and_return(true)
    allow(controller).to receive(:current_user).and_return(user)
  end

  let(:user) { FactoryGirl.create(:user, role: 'admin') }
  let(:other_user) { FactoryGirl.create(:user) }

  describe "GET #index" do
    it "renders the index template" do
      get :index
      expect(response).to render_template("index")
    end

    it "shows list of pending vacations" do
      5.times do FactoryGirl.create(:vacation, user_id: user.id, status: 'pending')
      end
      get :index
      expect(assigns[:vacations].size).to eq 5
    end
  end

  describe "DELETE #destroy" do
    it "destroys any vacation" do
      vacation = FactoryGirl.create(:vacation, user_id: other_user.id)
      expect{
            get :destroy, params: { id: vacation.id }
            }.to change(Vacation, :count).by(-1)
    end
  end

  describe "PATCH #update" do
    it "updates any vacation" do
      other_vacation = FactoryGirl.create(:vacation, user_id: other_user.id)
      patch :update, params: { id: other_vacation.id, vacation: { status: 'approved' } }
      other_vacation.reload
      expect(other_vacation.status).to eql('approved')
    end
  end

end
