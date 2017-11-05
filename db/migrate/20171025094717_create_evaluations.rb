class CreateEvaluations < ActiveRecord::Migration[5.1]
  def change
    create_table :evaluations do |t|
      t.references :user, foreign_key: true
      t.date :due_date, null: false

      t.timestamps
    end
  end
end
