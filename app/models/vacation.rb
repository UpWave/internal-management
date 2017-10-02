class Vacation < ApplicationRecord
  self.inheritance_column = :_type_disabled

  enum status: { pending: 0, approved: 1, rejected: 2 }
  enum type: { 'planned vacation': 0, 'sick leave': 1, 'unpaid day offs': 2 }
  belongs_to :user
  validates_presence_of :start_date, :end_date
  validate :date_is_valid?
  validate :vacation_length

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

    def vacation_length
     if self.type == 'planned vacation' && (end_date - start_date).to_i > 20
       errors.add(:type, 'Planned vacation can not be longer than 20 days')
     elsif self.type == 'sick leave' && (end_date - start_date).to_i > 5
       errors.add(:type, 'Sick leave can not be longer than 5 days')
     end
    end

end
