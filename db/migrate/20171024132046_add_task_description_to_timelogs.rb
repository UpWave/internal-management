class AddTaskDescriptionToTimelogs < ActiveRecord::Migration[5.1]
  def change
    add_column :timelogs, :task_description, :text
  end
end
