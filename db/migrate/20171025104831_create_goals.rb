class CreateGoals < ActiveRecord::Migration[5.1]
  def change
    create_table :goals do |t|
      t.references :evaluation, foreign_key: true
      t.string :name, null: false
      t.integer :mark, null: false

      t.timestamps
    end
  end
end
