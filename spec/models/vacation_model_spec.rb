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
end
