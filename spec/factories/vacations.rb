  FactoryGirl.define do

  factory :vacation do
    start_date { FFaker::Time.between(1.year.ago, Time.now) }
    end_date { Date.today + 1.year }
  end 

end