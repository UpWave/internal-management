class ChangeTimelogsDurationColumnType < ActiveRecord::Migration[5.1]
  def up
    # remove_column :timelogs, :duration
    # add_column :timelogs, :duration, :string
  end

  def down
    remove_column :timelogs, :duration
    add_column :timelogs, :duration, :integer
  end
end
