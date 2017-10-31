class Evaluation < ApplicationRecord
  belongs_to :user
  has_many :goals, dependent: :destroy
  accepts_nested_attributes_for :goals,
                                reject_if: proc { |attrs| attrs[:name].blank? },
                                allow_destroy: true

  validates :due_date, :user_id, presence: true
end
