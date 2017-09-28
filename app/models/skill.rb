class Skill < ApplicationRecord
  self.inheritance_column = :_type_disabled

  enum type: { 'language': 0, 'foreign_language': 1, 'framework': 2, 'devops': 3, 'library': 4 }
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
