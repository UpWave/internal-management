class CreateSalaries < ActiveRecord::Migration[5.1]
  def change
    create_table :salaries do |t|
      t.references :user, foreign_key: true
      t.decimal :amount, precision: 8, scale: 2, default: 0.00
      t.date :review_date
      t.date :archived_at

      t.timestamps
    end
  end
end
