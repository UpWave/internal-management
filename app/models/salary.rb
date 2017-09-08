class Salary < ApplicationRecord
  belongs_to :user
  validates_presence_of :amount, numericality: { greater_than_or_equal_to: 0 }
  validates_presence_of :review_date
end
