class AddIndexToTimelogs < ActiveRecord::Migration[5.1]
  def change
    add_index :timelogs, :user_id
  end
end
