class Evaluation < ApplicationRecord
  belongs_to :user
  has_many :goals, dependent: :destroy
  accepts_nested_attributes_for :goals

  validates :due_date, :user_id, presence: true
  validate :at_least_one_goal
  validates :due_date, inclusion: { in: ->(_date) { (Date.today..Date.today + 5.years) } }

  private

  def at_least_one_goal
    errors.add :base, 'Must have at least one goal' unless !goals.empty?
  end
end
