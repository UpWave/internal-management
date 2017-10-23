class FixDuration < ActiveRecord::Migration[5.1]
  def change
    change_column(:timelogs, :duration, :integer, null: false)
  end
end
