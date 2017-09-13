class UserSkill < ApplicationRecord
  belongs_to :user
  belongs_to :skill
  validates_presence_of :rate
  validates :rate, inclusion: 0..10
end
