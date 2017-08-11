class AddTrelloCardToTimelog < ActiveRecord::Migration[5.1]
  def change
    add_column :timelogs, :trello_card, :string, null: false
  end
end
