FactoryGirl.define do

  factory :salary do
    amount { FFaker::Random.rand(1000)+1 }
  end

end
