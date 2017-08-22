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
end