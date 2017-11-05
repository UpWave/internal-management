require 'rails_helper'

RSpec.describe Goal, type: :model do
  describe "Associations" do
    it { should belong_to(:evaluation) }
  end

  describe '#name' do
    it { is_expected.to validate_presence_of(:name) }
  end

  describe '#mark' do
    it { should validate_inclusion_of(:mark).in_range(1..10) }
  end
end
