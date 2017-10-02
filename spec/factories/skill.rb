FactoryGirl.define do

  factory :skill do
    name { FFaker::Name.name }
    type { FFaker::Random.rand(0..Skill.types.length - 1) }
  end

end
