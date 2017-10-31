FactoryGirl.define do

  factory :evaluation do
    due_date Date.today
    user_id {create(:member).id}
  end

end
