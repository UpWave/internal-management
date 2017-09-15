class Skill < ApplicationRecord
  has_many :user_skills, dependent: :destroy
  has_many :users, through: :user_skills
  before_validation :capitalize_name, :clear_whitespaces
  validates :name, presence: true, uniqueness: { case_sensitive: false }

  private
    def capitalize_name
      self.name.capitalize!
    end

    def clear_whitespaces
      self.name.squish!
    end
end
