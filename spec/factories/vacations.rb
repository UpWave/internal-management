FactoryGirl.define do

  factory :vacation do
    start_date { FFaker::Time.between(1.year.ago, Time.now) }
    end_date { FFaker::Time.between(Time.now, Time.now + 1.year) }
    type { FFaker::Random.rand(0..Vacation.types.length - 1) }
  end

end
