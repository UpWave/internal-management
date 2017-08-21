class Vacation < ApplicationRecord
  enum status: { pending: 0, approved: 1, rejected: 2 }
  belongs_to :user
  validates_presence_of :start_date, :end_date
  validate :date_is_valid?

  private
    def date_is_valid?
      if start_date > end_date
        errors.add(:end_date, 'End date must be bigger than start date')
      end
    end
end
