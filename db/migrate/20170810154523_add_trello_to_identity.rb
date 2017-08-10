class AddTrelloToIdentity < ActiveRecord::Migration[5.1]
  def change
      add_column :identities, :trello_auth_token, :string
      add_column :identities, :trello_auth_secret, :string
  end
end
