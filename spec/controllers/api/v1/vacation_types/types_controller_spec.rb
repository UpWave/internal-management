require 'rails_helper'

RSpec.describe Api::V1::VacationTypes::TypesController, type: :controller do
  before do
    allow(controller).to receive(:authenticate_user!).and_return(true)
  end

  describe "GET #types" do
    it "returns successfull response" do
      get :index, format: :json
      expect(response).to be_success
    end

    it "returns correct response" do
      get :index, format: :json
      expect(JSON.parse(response.body)).to eql(Vacation.types.keys)
    end
  end
end
