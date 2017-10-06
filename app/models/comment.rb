class Comment < ApplicationRecord
  belongs_to :user
  validates_presence_of :body, :receiver_id

  def self.receiver_comments(id)
    self.where("receiver_id = ?", id)
  end
end
