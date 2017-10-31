require 'rails_helper'

RSpec.describe Api::V1::Admin::User::EvaluationsController, type: :controller do
  before do
    allow(controller).to receive(:authenticate_user!).and_return(true)
    allow(controller).to receive(:current_user).and_return(user)
  end

  let(:user) { FactoryGirl.create(:user, role: 'admin') }

  describe "GET #index" do
    it "returns success" do
      FactoryGirl.create(:evaluation, user_id: user.id, goals_attributes: [attributes_for(:goal)])
      get :index, format: :json, params: { user_id: user.id}
      expect(response).to be_success
    end

    it "returns a list of evaluations" do
      3.times do FactoryGirl.create(:evaluation, user_id: user.id, goals_attributes: [attributes_for(:goal)])
      end
      get :index, format: :json, params: { user_id: user.id}
      parsed_response = JSON.parse(response.body)
      expect(parsed_response.length).to eq(3)
    end
  end

  describe "GET #show" do
    it "returns correct data" do
      evaluation = FactoryGirl.create(:evaluation, user_id: user.id, goals_attributes: [attributes_for(:goal)])
      get :show, format: :json, params: { id: evaluation.id, user_id: user.id }
      parsed_response = JSON.parse(response.body)
      expect(parsed_response['evaluation']['user_id']).to eq(user.id)
    end
  end

  describe "POST #create" do
    it "creates evaluation with valid attributes" do
      attrs = attributes_for(:evaluation).merge({
          user_id: user.id,
          due_date: Date.today,
          goals_attributes: [attributes_for(:goal)]
      })
      expect(Evaluation.new(attrs)).to be_valid
    end

    it "should be invalid if no goal provided" do
      attrs = attributes_for(:evaluation).merge({
        user_id: user.id,
        due_date: Date.today,
      })
      expect(Evaluation.new(attrs)).to be_invalid
    end
  end

  describe "PUT #update" do
    it "updates evaluation with valid params" do
      evaluation = FactoryGirl.create(:evaluation, user_id: user.id, goals_attributes: [attributes_for(:goal)])
      put :update, format: :json, params: { id: evaluation.id, user_id: user.id, evaluation: { due_date: Date.tomorrow } }
      parsed_response = JSON.parse(response.body)
      expect(parsed_response['due_date']).to eql(Date.tomorrow.to_s)
    end
  end

  describe "DELETE #destroy" do
    it "destroys evaluation" do
      evaluation = FactoryGirl.create(:evaluation, user_id: user.id, goals_attributes: [attributes_for(:goal)])
      expect{
        get :destroy, params: { id: evaluation.id, user_id: user.id }
      }.to change(Evaluation, :count).by(-1)
    end
  end
end
