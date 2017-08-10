class CreateIdentities < ActiveRecord::Migration[5.1]
  def change
    create_table :identities do |t|
      t.references :user, foreign_key: true
      t.string :provider
      t.string :access_token
      t.string :refresh_token
      t.string :secret_token
      t.string :uid
      
      t.timestamps
    end
  end
end
