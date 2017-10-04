require "rails_helper"


RSpec.describe User, type: :model do
  before(:each) do
    @user = FactoryGirl.create(:user)
    @vacation = FactoryGirl.build(:vacation, start_date: Date.today, end_date: Date.today + 2.days, user_id: @user.id)
  end

  describe "Associations" do
    it { should have_many(:timelogs) }
    it { should have_many(:identities) }
    it { should have_many(:vacations) }
    it { should have_many(:salaries) }
    it { should have_many(:user_skills) }
    it { should have_many(:skills) }
  end

  describe "correct roles" do
    it "assigns right roles" do
      expect(User.roles["admin"]).to eql(0)
      expect(User.roles["member"]).to eql(1)
    end
  end

  describe "correct statuses" do
    it "assigns right statuses" do
      expect(User.statuses["inactive"]).to eql(0)
      expect(User.statuses["active"]).to eql(1)
    end
  end

  describe "sick_leave_approved" do
    it "should return correct number of days" do
      @vacation.type = 1
      @vacation.status = 1
      @vacation.save
      expect(@user.sick_leave_approved).to eq(2)
    end
  end

  describe "sick_leave_pending" do
    it "should return correct number of days" do
      @vacation.type = 1
      @vacation.status = 0
      @vacation.save
      expect(@user.sick_leave_pending).to eq(2)
    end
  end

  describe "day_offs_approved" do
    it "should return correct number of days" do
      @vacation.type = 2
      @vacation.status = 1
      @vacation.save
      expect(@user.day_offs_approved).to eq(2)
    end
  end

  describe "day_offs_pending" do
    it "should return correct number of days" do
      @vacation.type = 2
      @vacation.status = 0
      @vacation.save
      expect(@user.day_offs_pending).to eq(2)
    end
  end

  describe "planned_vac_approved" do
    it "should return correct number of days" do
      @vacation.type = 0
      @vacation.status = 1
      @vacation.save
      expect(@user.planned_vac_approved).to eq(2)
    end
  end

  describe "planned_vac_pending" do
    it "should return correct number of days" do
      @vacation.type = 0
      @vacation.status = 0
      @vacation.save
      expect(@user.planned_vac_pending).to eq(2)
    end
  end

  describe "has_trello?" do
    it "should return false" do
      expect(@user.has_trello?).to eq(false)
    end
  end

  describe "has_google?" do
    it "should return false" do
      expect(@user.has_google?).to eq(false)
    end
  end

  describe "has_trello?" do
    it "should return false" do
      expect(@user.has_trello?).to eq(false)
    end
  end

  describe "salary" do
    it "should return salary" do
      @user.salaries.create(amount: 100, review_date: Date.today + 6.months)
      expect(@user.salary).to eq(100)
    end
  end

  describe "inactive_message" do
    it "should return message" do
      expect(@user.inactive_message).to eq("Sorry, this account has been deactivated.")
    end
  end

end