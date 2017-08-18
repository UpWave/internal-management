require "rails_helper"

RSpec.describe Timelog, type: :model do
  describe "Associations" do
    it { should belong_to(:user) }
  end

  describe "Validations" do
    it { should validate_presence_of(:user_id) }
    it { should validate_presence_of(:start_time) }
    it { should validate_presence_of(:duration) }
    it { should allow_value(100).for(:duration) }
    it { should_not allow_value(0).for(:duration) }
    it { should_not allow_value(-100).for(:duration) } 
    it { should validate_presence_of(:trello_card) }
  end

  describe "CSV generation" do
    it "creates CSV with valid content" do
      user = FactoryGirl.create :user
      timelog = FactoryGirl.create :timelog, user_id: user.id
      user_csv = User.first.timelogs.to_csv
      csv_content = "id,start_time,duration,end_time,trello_card\n#{timelog.id},#{timelog.start_time},#{timelog.duration},#{timelog.end_time},#{timelog.trello_card}\n"
      expect(user_csv).to eql(csv_content)
    end
  end 
end