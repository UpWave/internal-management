require 'rails_helper'

describe InvoicePolicy do
  subject { InvoicePolicy }

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
end
