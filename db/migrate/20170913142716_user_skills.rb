class UserSkills < ActiveRecord::Migration[5.1]
  def change
    create_table :skills do |t|
      t.string :name
      t.timestamps
    end

    create_table :user_skills do |t|
      t.belongs_to :user, index: true
      t.belongs_to :skill, index: true
      t.integer :rate
      t.timestamps
    end
  end
end
