FactoryGirl.define do

  factory :timelog do
    start_time { FFaker::Time.date }
    duration { FFaker::Random.rand(100)+1 }
    user
  end
  
end