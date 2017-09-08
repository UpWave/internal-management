require 'rails_helper'

describe UserPolicy do
  subject { UserPolicy }

  let (:current_user) { FactoryGirl.build_stubbed :user }
  let (:other_user) { FactoryGirl.build_stubbed :user }
  let (:admin) { FactoryGirl.build_stubbed :user, role: 'admin' }

  permissions :index? do
    it 'prevents other users from accessing index' do
      expect(subject).not_to permit(current_user)
    end

    it 'allows an admin to access index' do
      expect(subject).to permit(admin)
    end
  end

  permissions :roles? do
    it 'prevents other users from accessing roles' do
      expect(subject).not_to permit(current_user)
    end

    it 'allows an admin to access roles' do
      expect(subject).to permit(admin)
    end
  end

  permissions :statuses? do
    it 'prevents other users from accessing statuses' do
      expect(subject).not_to permit(current_user)
    end

    it 'allows an admin to access statuses' do
      expect(subject).to permit(admin)
    end
  end

  permissions :salary? do
    it 'prevents other users from requesting salary' do
      expect(subject).not_to permit(current_user)
    end

    it 'allows an admin to request salary' do
      expect(subject).to permit(admin)
    end
  end

  permissions :set_salary? do
    it 'prevents other users from setting salaries' do
      expect(subject).not_to permit(current_user)
    end

    it 'allows an admin to set salary' do
      expect(subject).to permit(admin)
    end
  end

  permissions :show? do
    it 'prevents other users from seeing the profile' do
      expect(subject).not_to permit(current_user, other_user)
    end

    it 'prevents owner to see profile' do
      expect(subject).not_to permit(current_user, current_user)
    end

    it 'allows an admin to see profile' do
      expect(subject).to permit(admin, other_user)
    end
  end

  permissions :update? do
    it 'prevents other users from updating' do
      expect(subject).not_to permit(current_user, other_user)
    end

    it 'prevents owner to update' do
      expect(subject).not_to permit(current_user, current_user)
    end

    it 'allows an admin to update' do
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
