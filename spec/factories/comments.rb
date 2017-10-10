FactoryGirl.define do

  factory :comment do
    user
    body 'comment body'
    author_id {create(:admin).id}
    user_id {create(:member).id}
  end

end
