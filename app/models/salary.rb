class Salary < ApplicationRecord
  self.inheritance_column = :_type_disabled

  enum type: { 'monthly': 0, 'per hour': 1 }
  belongs_to :user
  validates_presence_of :amount, numericality: { greater_than_or_equal_to: 0 }
  validates_presence_of :review_date
end
