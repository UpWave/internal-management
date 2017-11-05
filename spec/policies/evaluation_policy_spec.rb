require 'rails_helper'

describe EvaluationPolicy do
  subject { EvaluationPolicy }

  let(:other_user) { FactoryGirl.build_stubbed :user }
  let(:admin) { FactoryGirl.build_stubbed :user, role: 'admin' }

  permissions :index? do
    it 'prevents other users from accessing index' do
      expect(subject).not_to permit(other_user)
    end

    it 'allows an admin to access index' do
      expect(subject).to permit(admin)
    end
  end

  permissions :show? do
    it 'prevents other users from accessing show' do
      expect(subject).not_to permit(other_user)
    end

    it 'allows an admin to access show' do
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
    it 'prevents other users from accessing index' do
      expect(subject).not_to permit(other_user)
    end

    it 'allows an admin to access index' do
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
