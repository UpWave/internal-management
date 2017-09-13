class Skill < ApplicationRecord
  has_many :user_skills, dependent: :destroy
  has_many :users, through: :user_skills
  validates_presence_of :name
end
