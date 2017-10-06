class Comment < ApplicationRecord
  belongs_to :user
  validates_presence_of :body, :receiver_id
end
