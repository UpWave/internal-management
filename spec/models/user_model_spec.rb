require "rails_helper"


RSpec.describe User, type: :model do

  let(:user) { FactoryGirl.create(:user) }
  let!(:vacation) { FactoryGirl.build(:vacation, start_date: Date.today, end_date: Date.today + 2.days, user_id: user.id) }

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

  describe "has_trello?" do
    it "returns true when identity exist" do
      user = FactoryGirl.create(:user)
      user.identities.create(provider: "trello", uid: "wow, much security")
      expect(user.has_trello?).to eql(true)
    end

    it "returns false when identity doesn't exist" do
      user = FactoryGirl.create(:user)
      expect(user.has_trello?).to eql(false)
    end
  end

  describe "has_google?" do
    it "returns true when identity exist" do
      user = FactoryGirl.create(:user)
      user.identities.create(provider: "google_oauth2", uid: "wow, much security")
      expect(user.has_google?).to eql(true)
    end

    it "returns false when identity doesn't exist" do
      user = FactoryGirl.create(:user)
      expect(user.has_google?).to eql(false)
    end
  end

  describe "has_all?" do
    it "returns true when all identities exist" do
      user = FactoryGirl.create(:user)
      user.identities.create(provider: "trello", uid: "wow, much security")
      user.identities.create(provider: "google_oauth2", uid: "wow, such security")
      expect(user.has_all?).to eql(true)
    end

    it "returns false when identities doesn't exist" do
      user = FactoryGirl.create(:user)
      expect(user.has_all?).to eql(false)
    end

    it "returns false when one of the identity doesn't exist" do
      user = FactoryGirl.create(:user)
      user.identities.create(provider: "trello", uid: "wow, much security")
      expect(user.has_all?).to eql(false)
    end
  end

  describe "salary" do
    it "returns correct salary" do
      user = FactoryGirl.create(:user)
      salary = FactoryGirl.create(:salary, user_id: user.id)
      expect(user.salary).to eql(salary.amount)
    end

    it "returns newly assigned salary" do
      user = FactoryGirl.create(:user)
      FactoryGirl.create(:salary, user_id: user.id)
      new_salary = FactoryGirl.create(:salary, user_id: user.id)
      expect(user.salary).to eql(new_salary.amount)
    end
  end

  describe "salary_type" do
    it "returns correct type" do
      user = FactoryGirl.create(:user)
      salary = FactoryGirl.create(:salary, user_id: user.id, type: "per hour")
      expect(user.salary_type).to eql(salary.type)
    end
  end

  describe "count_approved_day_offs_by_month" do
    it "returns correct duration" do
      user = FactoryGirl.create(:user)
      vacation = Vacation.create(user_id: user.id, start_date: "2017-10-10", end_date: "2017-10-20", type: "unpaid day offs", status: "approved")
      expect(user.count_approved_day_offs_by_month(vacation.start_date)).to eql(9)
    end
  end
end
