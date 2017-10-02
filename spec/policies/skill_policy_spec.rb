require 'rails_helper'

describe SkillPolicy do
  subject { SkillPolicy }

  let (:other_user) { FactoryGirl.build_stubbed :user }
  let (:admin) { FactoryGirl.build_stubbed :user, role: 'admin' }

  permissions :index? do
    it 'prevents other users from accessing index' do
      expect(subject).not_to permit(other_user)
    end

    it 'allows an admin to access index' do
      expect(subject).to permit(admin)
    end
  end

  permissions :skill_types? do
    it 'prevents other users from accessing types' do
      expect(subject).not_to permit(other_user)
    end

    it 'allows an admin to access types' do
      expect(subject).to permit(admin)
    end
  end

  permissions :create? do
    it 'prevents other users from accessing create' do
      expect(subject).not_to permit(other_user)
    end

    it 'allows an admin to access create' do
      expect(subject).to permit(admin)
    end
  end

  permissions :update? do
    it 'prevents other users from accessing update' do
      expect(subject).not_to permit(other_user)
    end

    it 'allows an admin to access update' do
      expect(subject).to permit(admin)
    end
  end

  permissions :new? do
    it 'prevents other users from accessing new' do
      expect(subject).not_to permit(other_user)
    end

    it 'allows an admin to access new' do
      expect(subject).to permit(admin)
    end
  end

  permissions :destroy? do
    it 'prevents other users from accessing destroy' do
      expect(subject).not_to permit(other_user)
    end

    it 'allows an admin to access destroy' do
      expect(subject).to permit(admin)
    end
  end
end
