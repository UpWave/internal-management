class Skill < ApplicationRecord
  has_many :user_skills, dependent: :destroy
  has_many :users, through: :user_skills
  validates :name, presence: true, uniqueness: true
  before_save :capitalize_name

  private
    def capitalize_name
      self.name.capitalize!
    end
end
