FactoryGirl.define do

  factory :skill do
    name { FFaker::Name.name }
    type { FFaker::Random.rand(4) + 1 }
  end

end
