class Goal < ApplicationRecord
  belongs_to :evaluation

  validates :name, :mark, :evaluation_id, presence: true
  validates :mark, inclusion: {in: 1..10}
end
