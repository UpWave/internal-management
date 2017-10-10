# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path.
# Rails.application.config.assets.paths << Emoji.images_path
# Add Yarn node_modules folder to the asset load path.
Rails.application.config.assets.paths << Rails.root.join('node_modules')

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in the app/assets
# folder are already added.
# Rails.application.config.assets.precompile += %w( admin.js admin.css )
Rails.application.config.assets.precompile += %w( basictable.css )
Rails.application.config.assets.precompile += %w( table-style.css )
Rails.application.config.assets.precompile += %w( modal.css )
Rails.application.config.assets.precompile += %w( icon-font.min.css )
Rails.application.config.assets.precompile += %w( morris.css )
Rails.application.config.assets.precompile += %w( style.css )
Rails.application.config.assets.precompile += %w( scripts.js )
Rails.application.config.assets.precompile += %w( jquery.basictable.min.js )
Rails.application.config.assets.precompile += %w( jquery.nicescroll.js )
