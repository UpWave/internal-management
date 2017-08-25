class AddStatusToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :status, :integer, null: false, default: 1
  end
end
