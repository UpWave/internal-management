class AddTypeToVacations < ActiveRecord::Migration[5.1]
  def change
    add_column :vacations, :type, :integer, null: false, default: 0
  end
end
