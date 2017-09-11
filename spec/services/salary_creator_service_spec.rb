require "rails_helper"

RSpec.describe SalaryCreator do
  subject { VacationPolicy }

  let (:admin) { FactoryGirl.create :user, role: 'admin' }

  describe "creates new salary" do
    it "creates a first" do
    salary_params = FactoryGirl.attributes_for(:salary)
    expect{
          SalaryCreator.new(admin.salaries, salary_params)
        }.to change(Salary, :count).by(1)
    end

    it "archives a previous salary when creating a new one" do
      salary_params = FactoryGirl.attributes_for(:salary)
      FactoryGirl.create(:salary, user_id: admin.id)
      salary_creator = SalaryCreator.new(admin.salaries, salary_params)
      expect(admin.salaries.length).to eql(2)
      expect(admin.salaries.first.archived_at).to eql(Date.current)
      expect(admin.salary).to eql(salary_params[:amount])
    end
  end
end
