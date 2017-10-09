class CreateComments < ActiveRecord::Migration[5.1]
  def change
    create_table :comments do |t|
      t.text :body
      t.references :user, foreign_key: true, null: false
      t.integer :author_id, null: false

      t.timestamps
    end
  end
end
