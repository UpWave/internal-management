class AddImageUrlToIdenity < ActiveRecord::Migration[5.1]
  def change
    add_column :identities, :image_url, :string
  end
end
