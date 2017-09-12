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

    it "returns response as array" do
      get :index, format: :json
      expect(JSON.parse(response.body)).to be_an_instance_of(Array)
    end
  end
end
