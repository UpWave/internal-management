class Comment < ApplicationRecord
  belongs_to :user
  validates_presence_of :body, :author_id, :user_id
end
