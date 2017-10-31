require 'rails_helper'

RSpec.describe Evaluation, type: :model do
  describe "Associations" do
    it { should belong_to(:user) }
    it { should have_many(:goals) }
    it { should accept_nested_attributes_for :goals }
  end

  describe '#due_date, #user_id' do
    it { is_expected.to validate_presence_of(:due_date) }
    it { is_expected.to validate_presence_of(:user_id) }
  end

end
