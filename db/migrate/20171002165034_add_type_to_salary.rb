class AddTypeToSalary < ActiveRecord::Migration[5.1]
  def change
    add_column :salaries, :type, :integer, null: false, default: 0
  end
end
