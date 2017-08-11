class Timelog < ApplicationRecord
  belongs_to  :user
  validates :user_id, presence: true
  validates :start_time, presence: true
  validates :duration, presence: true, numericality: { greater_than: 0 }
  validates :trello_card, presence: true

end
