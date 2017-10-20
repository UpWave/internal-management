class Comment < ApplicationRecord
  belongs_to :user, class_name: "User", foreign_key: :author_id
  validates_presence_of :body, :author_id, :user_id

  scope :for_user, -> (id) { where('user_id = ?', id).order(created_at: :desc) }
end
