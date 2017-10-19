require 'rails_helper'

describe TrelloBoardsPolicy do
  subject { TrelloBoardsPolicy }

  let (:current_user) { FactoryGirl.build_stubbed :user }

  permissions :index? do
    it 'allows user to see his boards' do
      expect(subject).to permit(current_user)
    end
  end
end
