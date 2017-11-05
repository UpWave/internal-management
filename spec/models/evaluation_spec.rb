require 'rails_helper'

RSpec.describe Evaluation, type: :model do
  describe "Associations" do
    it { should belong_to(:user) }
    it { should have_many(:goals) }
    it { should accept_nested_attributes_for :goals }
  end

  describe 'Validations' do
    it { is_expected.to validate_presence_of(:due_date) }
    it { is_expected.to validate_presence_of(:user_id) }
    it 'is not valid with past date' do
      expect(build :evaluation, goals_attributes: [attributes_for(:goal)], due_date: Date.today - 1).to be_invalid
    end
  end
end
