class Evaluation < ApplicationRecord
  belongs_to :user
  has_many :goals, dependent: :destroy
  accepts_nested_attributes_for :goals,
                                reject_if: proc { |attrs| attrs[:name].blank? },
                                allow_destroy: true

  validates :due_date, :user_id, presence: true
  validate :at_least_one_goal
  validate :not_past_date


  private

  def not_past_date
    if self.due_date.past?
      errors.add(:due_date, "can't be in past")
    end
  end

  def at_least_one_goal
    errors.add :base, "Must have at least one goal" unless goals.length > 0
  end
end
