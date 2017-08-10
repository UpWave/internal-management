class DeleteOmniauthFromUser < ActiveRecord::Migration[5.1]
  def change
    remove_column :users, :provider
    remove_column :users, :uid
  end
end
