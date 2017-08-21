class Vacation < ApplicationRecord
  belongs_to :user
  validates_presence_of :start_date, :end_date
  validate :date_is_valid?

  private
    def date_is_valid?
      if start_date > end_date
        errors.add(:end_date, 'Invalid date input')
      end
    end
end
