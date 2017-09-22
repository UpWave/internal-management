require 'rails_helper'

describe VacationPolicy do
  subject { VacationPolicy }

  let (:current_user) { FactoryGirl.create :user }
  let (:other_user) { FactoryGirl.create :user }
  let (:admin) { FactoryGirl.create :user, role: 'admin' }
  let (:user_vacation) { FactoryGirl.create :vacation, user_id: current_user.id }
  let (:other_vacation) { FactoryGirl.create :vacation, user_id: other_user.id }

  permissions :index? do

    it 'allows admin to access any vacations' do
      expect(subject).to permit(admin, user_vacation)
    end

    it 'forbids user to access other vacations' do
      vacations = []
      vacations.push(other_vacation)
      expect(subject).not_to permit(current_user, vacations)
    end
  end

  permissions :users? do

    it 'allows admin to access users action' do
      expect(subject).to permit(admin)
    end

    it 'forbids user to access users action' do
      expect(subject).not_to permit(current_user)
    end
  end

  permissions :statuses? do

    it 'allows admin to access statuses action' do
      expect(subject).to permit(admin)
    end

    it 'forbids user to access statuses action' do
      expect(subject).not_to permit(current_user)
    end
  end

  permissions :create? do
    it 'allows user to request a vacation' do
      expect(subject).to permit(current_user, user_vacation)
    end

    it 'forbids user to request other vacation' do
      expect(subject).not_to permit(current_user, other_vacation)
    end

    it 'allows admin to create any vacation' do
      expect(subject).to permit(admin, user_vacation)
    end
  end

  permissions :update? do
    it 'forbids user to update his vacation' do
      expect(subject).not_to permit(current_user, user_vacation)
    end

    it 'forbids user to update other vacation' do
      expect(subject).not_to permit(current_user, other_vacation)
    end

    it 'allows admin to update any vacation' do
      expect(subject).to permit(admin, user_vacation)
    end
  end

  permissions :destroy? do
    it 'allows user to destroy his vacation' do
      expect(subject).to permit(current_user, user_vacation)
    end

    it 'forbids user to destroy other vacation' do
      expect(subject).not_to permit(current_user, other_vacation)
    end

    it 'allows admin to destroy any vacation' do
      expect(subject).to permit(admin, user_vacation)
    end
  end

  permissions :new? do
    it 'allows user to access action with his vacation' do
      expect(subject).to permit(current_user, user_vacation)
    end

    it 'forbids user to access action with other vacation' do
      expect(subject).not_to permit(current_user, other_vacation)
    end

    it 'allows admin to access action with any vacation' do
      expect(subject).to permit(admin, user_vacation)
    end
  end

end
