class RemoveNotNullConstraintFromTimelogs < ActiveRecord::Migration[5.1]
  def change
    change_column_null :timelogs, :trello_card, true
  end
end
