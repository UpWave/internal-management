class Vacation < ApplicationRecord
  enum status: { pending: 0, approved: 1, rejected: 2 }
  belongs_to :user
  validates_presence_of :start_date, :end_date
  validate :date_is_valid?

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
