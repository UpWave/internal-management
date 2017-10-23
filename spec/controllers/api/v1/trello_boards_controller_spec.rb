require 'rails_helper'

RSpec.describe Api::V1::TrelloBoardsController, type: :controller do
  before do
    allow(controller).to receive(:authenticate_user!).and_return(true)
    allow(controller).to receive(:current_user).and_return(user)
  end

  let(:user) { FactoryGirl.create(:user) }

  describe "GET #index" do
    it "will return error when user doesn't have trello" do
      get :index, format: :json
      parsed_response = JSON.parse(response.body)
      expect(parsed_response["errors"]).to eq('Trello connection error')
    end

    it "will return correct boards and cards" do
      user.identities.create(
        provider: 'trello',
        access_token: '5c7abab8dd49ab4d9f244669820ae5120cee59d78d08f54ebf914373a3e7547a',
        secret_token: '8238e025956453eb02120c7b962e3893',
        uid: '59dc95fb9b71e96a24045308'
      )
      cards = ['Card for a test', 'Another test card']
      board = 'My new board'
      get :index, format: :json
      parsed_response = JSON.parse(response.body)
      expect(parsed_response[board]).to eq(cards)
    end
  end
end
