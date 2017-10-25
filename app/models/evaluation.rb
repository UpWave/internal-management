class Evaluation < ApplicationRecord
  belongs_to :user
  has_many :goals, dependent: :destroy

  validates :due_date, :user_id, presence: true
end
