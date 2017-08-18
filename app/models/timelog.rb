require 'csv'
class Timelog < ApplicationRecord
  ATTRIBUTES = %w{id start_time duration end_time trello_card}
  belongs_to  :user
  validates :user_id, presence: true
  validates :start_time, presence: true
  validates :duration, presence: true, numericality: { greater_than: 0 }
  validates :trello_card, presence: true

  before_save :set_end_time

  scope :start_time, -> { order("start_time asc") }
  scope :end_time, -> { order("end_time asc") }
  scope :duration, -> { order("duration asc") }
  scope :ends_this_week, -> { where('end_time BETWEEN ? AND ?', Date.today, Date.today + 1.week) }
  scope :ends_this_month, -> { where('end_time BETWEEN ? AND ?', Date.today, Date.today + 1.month) }
  scope :date_range, lambda { |start_date, end_date| where ('start_time >= ? AND end_time <= ?'), start_date, end_date }


  def set_end_time
    self.end_time = self.start_time + self.duration.to_i.minutes 
  end

  def self.to_csv
    CSV.generate(headers: true) do |csv|
      csv << ATTRIBUTES

      all.each do |timelog|
        csv << ATTRIBUTES.map{ |attr| timelog.send(attr) }
      end
    end
  end
end
