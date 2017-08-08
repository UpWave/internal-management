Rails.application.config.middleware.use OmniAuth::Builder do
  provider :trello, ENV['TRELLO_DEVELOPER_PUBLIC_KEY'], ENV['TRELLO_SECRET'],
  app_name: "Internal Management App", scope: 'read,write,account', expiration: 'never'
end