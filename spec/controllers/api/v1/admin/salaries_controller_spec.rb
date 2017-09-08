require 'rails_helper'

RSpec.describe Api::V1::Admin::SalariesController, type: :controller do
  before do
    allow(controller).to receive(:authenticate_user!).and_return(true)
    allow(controller).to receive(:current_user).and_return(user)
  end

  let(:user) { FactoryGirl.create(:user, role: 'admin') }
  let(:other_user) { FactoryGirl.create(:user) }


  describe "GET #index" do
    it "allows authenticated access" do
      FactoryGirl.create(:salary, user_id: other_user.id)
      get :index, format: :json, params: { id: other_user.id }
      expect(response).to be_success
    end

    it "returns correct salary" do
      FactoryGirl.create(:salary, user_id: other_user.id)
      get :index, format: :json, params: { id: other_user.id }
      expect(JSON.parse(response.body)["amount"]).to eq(Salary.last.amount.to_s)
    end
  end

  describe "PATCH #update" do
    it "updates a salary" do
      salary_params = FactoryGirl.attributes_for(:salary)
      FactoryGirl.create(:salary, user_id: other_user.id)
      patch :update, format: :json, params: { id: other_user.id, salary: salary_params }
      expect(Salary.last.amount.to_i).to eql(salary_params[:amount])
    end
  end

  describe "GET #create" do
    it "creates a salary" do
      salary_params = FactoryGirl.attributes_for(:salary)
      expect{
            post :create, format: :json, params: { id: user.id, salary: salary_params }
          }.to change(Salary, :count).by(1)
    end

    it "archives a previous salary when creating a new one" do
      salary_params = FactoryGirl.attributes_for(:salary)
      FactoryGirl.create(:salary, user_id: other_user.id)
      post :create, format: :json, params: { id: other_user.id, salary: salary_params }
      expect(other_user.salaries.first.archived_at).not_to eql(nil)
      expect(other_user.salaries.last.archived_at).to eql(nil)
      expect(other_user.salaries.length).to eql(2)
    end
  end
end
