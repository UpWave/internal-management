class AddEndTimeToTimelog < ActiveRecord::Migration[5.1]
  def change
    add_column :timelogs, :end_time, :datetime
  end
end
