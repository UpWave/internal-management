class AddTaskToTimelogs < ActiveRecord::Migration[5.1]
  def change
    add_column :timelogs, :task, :text
  end
end
