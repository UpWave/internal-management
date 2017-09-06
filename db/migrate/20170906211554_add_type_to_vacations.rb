class AddTypeToVacations < ActiveRecord::Migration[5.1]
  def change
    add_column :vacations, :reason, :integer, null: false, default: 0
  end
end
