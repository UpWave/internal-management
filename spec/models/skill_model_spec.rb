require "rails_helper"

RSpec.describe Skill, type: :model do

  describe "correct types" do
    it "assigns right types" do
      expect(Skill.types["language"]).to eql(0)
      expect(Skill.types["foreign_language"]).to eql(1)
      expect(Skill.types["framework"]).to eql(2)
      expect(Skill.types["devops"]).to eql(3)
      expect(Skill.types["library"]).to eql(4)
    end
  end
end
