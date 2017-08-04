require 'rails_helper'

describe UserPolicy do 
  subject { UserPolicy }

  let (:current_user) { FactoryGirl.build_stubbed :user }
  let (:other_user) { FactoryGirl.build_stubbed :user }
  let (:admin) { FactoryGirl.build_stubbed :user, role: 'admin' }

  permissions :show? do    
    it 'prevents other users from seeing the profile' do
      expect(subject).not_to permit(current_user, other_user)    
    end

    it 'allows owner to see profile' do
      expect(subject).to permit(current_user, current_user)
    end

    it 'allows an admin to see profile' do
      expect(subject).to permit(admin, other_user)
    end
  end

  permissions :update? do
    it 'prevents other users from updating' do
      expect(subject).not_to permit(current_user, other_user)
    end

    it 'allows owner to update' do
      expect(subject).to permit(current_user, current_user)
    end

    it 'allown an admin to update' do
      expect(subject).to permit(admin, other_user)
    end
  end

  permissions :destroy? do
    it 'prevents other users to delete' do
      expect(subject).not_to permit(current_user, other_user)
    end 

    it 'allows an admin to delete any user' do
      expect(subject).to permit(admin, other_user)
    end
  end

end