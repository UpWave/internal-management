class Timelog < ApplicationRecord
  belongs_to  :user
  validates :user_id, presence: true
  validates :start_time, presence: true
  validates :duration, presence: true, numericality: { greater_than: 0 }
  validates :trello_card, presence: true

  scope :start_time, -> { order("start_time asc") }
  scope :end_time, -> { order("end_time asc") }
  scope :duration, -> { order("duration asc") }
  scope :ends_this_week, -> { where('end_time BETWEEN ? AND ?', Date.today, Date.today + 1.week) }
  scope :ends_this_month, -> { where('end_time BETWEEN ? AND ?', Date.today, Date.today + 1.month) }
  scope :date_range, lambda { |start_date, end_date| where ('start_time >= ? AND end_time <= ?'), start_date, end_date }

end
