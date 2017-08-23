FactoryGirl.define do

  factory :vacation do
    start_date { FFaker::Time.between(1.year.ago, Time.now) }
    end_date { FFaker::Time.between(Time.now, Time.now + 1.year) }
  end 

end