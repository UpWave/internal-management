class AddTrelloBoardToTimelogs < ActiveRecord::Migration[5.1]
  def change
    add_column :timelogs, :trello_board, :string, null: false
  end
end
