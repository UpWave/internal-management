FactoryGirl.define do

  factory :user do
    email { FFaker::Internet.email }
    password { Devise.friendly_token.first(6) }
    first_name { FFaker::Name.name }
    last_name { FFaker::Name.name }
  end

end
