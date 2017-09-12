FactoryGirl.define do

  factory :salary do
    amount { FFaker::Random.rand(1000) + 1 }
    review_date { FFaker::Time.between(Time.now, Time.now + 1.month) }
  end

end
