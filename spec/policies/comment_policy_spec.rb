require 'rails_helper'

describe CommentPolicy do
  subject { CommentPolicy }

  let(:member) { build_stubbed :user }
  let(:admin) { build_stubbed :user, role: 'admin' }
  let(:another_admin) { build_stubbed :user, role: 'admin' }


  permissions :index? do
    it 'prevents other users from accessing index' do
      expect(subject).not_to permit(member)
    end

    it 'allows an admin to access index' do
      expect(subject).to permit(admin)
    end
  end

  permissions :create? do
    it 'prevents other users from accessing create' do
      expect(subject).not_to permit(member)
    end

    it 'allows an admin to access create' do
      expect(subject).to permit(admin)
    end
  end

  permissions :update? do
    it 'prevents other users from accessing update?' do
      expect(subject).not_to permit(member)
    end

    it 'allows only comment author to access update?' do
      expect(subject).not_to permit(another_admin, Comment.new(user_id: member.id, author_id: admin.id))
    end
  end

  permissions :destroy? do
    it 'prevents other users from accessing destroy' do
      expect(subject).not_to permit(member)
    end

    it 'allows only comment author to access delete?' do
      expect(subject).not_to permit(another_admin, Comment.new(user_id: member.id, author_id: admin.id))
    end
  end

end