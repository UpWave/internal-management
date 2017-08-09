require 'rails_helper'

RSpec.describe UsersController, :type => :controller do
  before do
    allow(controller).to receive(:authenticate_user!).and_return(true)
    allow(controller).to receive(:current_user).and_return(user)
  end

  let(:user) { FactoryGirl.create(:user, role: 'admin') }
  let(:other_user) { FactoryGirl.create(:user) }

  describe "GET #index" do
    
    it "allows authenticated access" do
      get :index
      expect(response).to be_success
    end

    it "renders the index template with all users" do
      5.times do FactoryGirl.create(:user)
      end
      get :index
      expect(response).to render_template("index")
      expect(assigns[:users].size).to eq 6 #admin user + 5 users created above 
      end
  end

  describe "GET #show" do
    it "allows authenticated access" do
      get :show,  params: { id: user.id }
      expect(response).to be_success
    end
    
    it "renders the show template with user" do
      get :show, params: { id: other_user.id }
      expect(response).to render_template("show")
      expect(assigns[:user]).to eq(other_user)
    end
  end

  describe "GET #edit" do
    it "allows authenticated access" do
      get :edit,  params: { id: user.id }
      expect(response).to be_success
    end
    
    it "renders the edit template" do
      get :edit, params: { id: user.id }
      expect(response).to render_template("edit")
      expect(assigns[:user]).to eq(user)
    end
  end

  describe "DELETE #destroy" do
    it "deletes the user" do
      get :destroy, params: { id: other_user.id }
      other_user.destroy
      expect(other_user.destroyed?).to be true
    end
  end

  describe "PATCH #update" do
    context "with good data" do
      it "updates an user" do
        patch :update, params: { id: user.id, user: FactoryGirl.attributes_for(:user, email: "email@email.com") }
        user.reload
        expect(user.email).to eql("email@email.com")
      end
    end

    context "with bad data" do
      it "updates an user" do
        patch :update, params: { id: user.id, user: FactoryGirl.attributes_for(:user, email: "sometext") }
        user.reload
        expect(flash[:error]).to eql("Something went wrong")
      end
    end
  end
  
end