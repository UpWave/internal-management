class Goal < ApplicationRecord
  belongs_to :evaluation, counter_cache: true

  validates :name, presence: true
  validates :mark, inclusion: {in: 1..10}, allow_blank: true
end
