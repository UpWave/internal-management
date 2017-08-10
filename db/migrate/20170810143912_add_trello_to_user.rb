class AddTrelloToUser < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :trello, :string, null: false, default: ""
  end
end
