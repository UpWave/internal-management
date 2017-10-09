require 'rails_helper'

describe InvoicePolicy do
  subject { CommentPolicy }

  let(:member) { FactoryGirl.build_stubbed :user }
  let(:admin) { FactoryGirl.build_stubbed :user, role: 'admin' }

  permissions :index? do
    it 'prevents other users from accessing index' do
      expect(subject).not_to permit(member)
    end

    it 'allows an admin to access index' do
      expect(subject).to permit(admin)
    end
  end
end