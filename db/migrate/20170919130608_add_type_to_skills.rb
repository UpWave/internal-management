class AddTypeToSkills < ActiveRecord::Migration[5.1]
  def change
    add_column :skills, :type, :integer, null:false
  end
end
