require 'rails_helper'

describe ProfilePolicy do 
  subject { ProfilePolicy }

  let (:current_user) { FactoryGirl.build_stubbed :user }

  permissions :index? do    
    it 'allows user to see profile' do
      expect(subject).to permit(current_user)    
    end
  end

  permissions :update? do
    it 'allows user to update' do
      expect(subject).to permit(current_user)
    end
  end
end