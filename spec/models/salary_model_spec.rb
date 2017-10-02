require "rails_helper"

RSpec.describe Salary, type: :model do

  describe "correct types" do
    it "assigns right types" do
      expect(Salary.types["monthly"]).to eql(0)
      expect(Salary.types["per hour"]).to eql(1)
    end
  end
end
