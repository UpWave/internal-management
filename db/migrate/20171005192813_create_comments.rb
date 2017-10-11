class CreateComments < ActiveRecord::Migration[5.1]
  def change
    create_table :comments do |t|
      t.text :body
      t.references :user, null: false
      t.integer :author_id, foreign_key: true, null: false

      t.timestamps
    end
  end
end
