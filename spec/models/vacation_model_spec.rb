require "rails_helper"

RSpec.describe Vacation, type: :model do

  describe "correct statuses" do
    it "assigns approved status" do
      expect(Vacation.approved_status).to eql('approved')
    end

    it "assigns rejected status" do
      expect(Vacation.rejected_status).to eql('rejected')
    end
  end

  describe "correct types" do
    it "assigns right types" do
      expect(Vacation.types["planned vacation"]).to eql(0)
      expect(Vacation.types["sick leave"]).to eql(1)
      expect(Vacation.types["unpaid day offs"]).to eql(2)
    end
  end

  describe "business_day_offs" do
    it "does the right math" do
      vacation = Vacation.new(start_date: "2017-10-10", end_date: "2017-10-20")
      expect(vacation.business_day_offs(Date.parse("2017-10-01"))).to eql(9)
    end
  end
end
