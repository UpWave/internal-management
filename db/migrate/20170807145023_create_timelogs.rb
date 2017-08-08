class CreateTimelogs < ActiveRecord::Migration[5.1]
  def change
    create_table :timelogs do |t|
      t.datetime :start_time
      t.integer :duration, null: false
      t.integer :user_id

      t.timestamps
    end
  end
end
