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

  permissions :roles do
    it 'prevents other users from accessing roles' do
      expect(subject).not_to permit(current_user)
    end

    it 'allows an admin to access roles' do
      expect(subject).to permit(admin)
    end
  end

  permissions :statuses do
    it 'prevents other users from accessing statuses' do
      expect(subject).not_to permit(current_user)
    end

    it 'allows an admin to access statuses' do
      expect(subject).to permit(admin)
    end
  end

  permissions :count_users do
    it 'prevents other users from accessing count_users action' do
      expect(subject).not_to permit(current_user)
    end

    it 'allows an admin to access count_users action' do
      expect(subject).to permit(admin)
    end
  end

  permissions :skills? do
    it 'prevents other users from accessing skills' do
      expect(subject).not_to permit(current_user)
    end

    it 'allows an admin to access skills' do
      expect(subject).to permit(admin)
    end
  end

  permissions :missing_skills? do
    it 'prevents other users from accessing missing_skills' do
      expect(subject).not_to permit(current_user)
    end

    it 'allows an admin to access missing_skills' do
      expect(subject).to permit(admin)
    end
  end

end
