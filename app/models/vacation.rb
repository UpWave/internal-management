class Vacation < ApplicationRecord
  self.inheritance_column = :_type_disabled

  enum status: { pending: 0, approved: 1, rejected: 2 }
  enum type: { 'planned vacation': 0, 'sick leave': 1, 'unpaid day offs': 2 }
  belongs_to :user
  validates_presence_of :start_date, :end_date
  validate :date_is_valid?

  scope :in_month, lambda { |date| where ('start_date BETWEEN ? AND ? OR end_date BETWEEN ? AND ?'), date.beginning_of_month, date.end_of_month, date.beginning_of_month, date.end_of_month }

  def business_day_offs(date)
    duration = 0
    (start_date..end_date).select do |day|
      if day.month == date.month
        if (1..5).include?(day.wday)
          duration = duration + 1
        end
      end
     end
    duration
  end

  private
    def self.approved_status
      Vacation.statuses.key(1)
    end

    def self.rejected_status
      Vacation.statuses.key(2)
    end

    def date_is_valid?
      if start_date > end_date
        errors.add(:end_date, 'End date must be bigger than start date')
      end
    end
end
