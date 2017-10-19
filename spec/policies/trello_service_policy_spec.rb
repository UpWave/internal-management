require 'rails_helper'

describe TrelloServicePolicy do
  subject { TrelloServicePolicy }

  let (:current_user) { FactoryGirl.create :user }

  permissions :index? do
    it 'allows autheticated access' do
      current_user.identities.create(
        provider: 'trello',
        access_token: '5c7abab8dd49ab4d9f244669820ae5120cee59d78d08f54ebf914373a3e7547a',
        secret_token: '8238e025956453eb02120c7b962e3893',
        uid: '59dc95fb9b71e96a24045308'
      )
      expect(subject).to permit(current_user, TrelloService.new(current_user))
    end
  end
end
