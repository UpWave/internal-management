FactoryGirl.define do

  factory :user, aliases: [:author, :commenter] do
    email { FFaker::Internet.email }
    password { Devise.friendly_token.first(6) }
    first_name { FFaker::Name.name }
    last_name { FFaker::Name.name }

    factory :admin do
      role "admin"
    end

    factory :member do
      role "member"
    end
  end

end
