class CreateSalaries < ActiveRecord::Migration[5.1]
  def change
    create_table :salaries do |t|
      t.references :user, foreign_key: true
      t.integer :amount, default: 0
      t.date :review_date
      t.date :archived_at

      t.timestamps
    end
  end
end
