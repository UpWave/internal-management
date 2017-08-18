require 'rails_helper'

describe TimelogPolicy do 
  subject { TimelogPolicy }

  let (:current_user) { FactoryGirl.create :user }
  let (:other_user) { FactoryGirl.create :user }
  let (:admin) { FactoryGirl.create :user, role: 'admin' }
  let (:user_timelog) { FactoryGirl.create :timelog, user_id: current_user.id }
  let (:other_timelog) { FactoryGirl.create :timelog, user_id: other_user.id }

  # Index action gets @timelogs as an array, so here we have
  # to do a little trick with pushing to array, otherwise 
  # policy will crash on method empty? for @timelogs 
  permissions :index? do    
    it 'allows user to access your timelogs' do
      timelogs = []
      timelogs.push(user_timelog)
      expect(subject).to permit(current_user, timelogs)    
    end

    it 'allows admin to access any timelog' do
      expect(subject).to permit(admin, user_timelog)
    end
    
    it 'forbids user to access other timelog' do
      timelogs = []
      timelogs.push(other_timelog)
      expect(subject).not_to permit(current_user, timelogs)
    end
  end

  permissions :create? do
    it 'allows user to create his timelog' do
      expect(subject).to permit(current_user, user_timelog)
    end

    it 'forbids user to create other timelog' do
      expect(subject).not_to permit(current_user, other_timelog)
    end

    it 'allows admin to create any timelog' do
      expect(subject).to permit(admin, user_timelog)
    end
  end

  permissions :update? do    
    it 'allows user to update his timelog' do
      expect(subject).to permit(current_user, user_timelog)    
    end

    it 'forbids user to update other timelog' do
      expect(subject).not_to permit(current_user, other_timelog)
    end

    it 'allows admin to update any timelog' do
      expect(subject).to permit(admin, user_timelog)
    end
  end

  permissions :destroy? do    
    it 'allows user to destroy his timelog' do
      expect(subject).to permit(current_user, user_timelog)    
    end

    it 'forbids user to destroy other timelog' do
      expect(subject).not_to permit(current_user, other_timelog)
    end

    it 'allows admin to destroy any timelog' do
      expect(subject).to permit(admin, user_timelog)
    end
  end

  permissions :new? do    
    it 'allows user to access action with his timelog' do
      expect(subject).to permit(current_user, user_timelog)    
    end

    it 'forbids user to access action with other timelog' do
      expect(subject).not_to permit(current_user, other_timelog)
    end

    it 'allows admin to access action with any timelog' do
      expect(subject).to permit(admin, user_timelog)
    end
  end

end