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

    it "archives a first salary when creating a second" do
      salary_params = FactoryGirl.attributes_for(:salary)
      FactoryGirl.create(:salary, user_id: admin.id)
      salary_creator = SalaryCreator.new(admin.salaries, salary_params)
      expect(admin.salaries.length).to eql(2)
      expect(admin.salaries.first.archived_at).to eql(Date.current)
      expect(admin.salary).to eql(salary_params[:amount])
    end

    it "archives a previous salary when creating a new one" do
      4.times do
        SalaryCreator.new(admin.salaries, FactoryGirl.attributes_for(:salary))
      end
      new_salary_params = FactoryGirl.attributes_for(:salary)
      SalaryCreator.new(admin.salaries, new_salary_params)
      expect(admin.salaries.length).to eql(5)
      admin.salaries.first(4).each { |record| expect(record.archived_at).to eql(Date.current) }
      expect(admin.salary).to eql(new_salary_params[:amount])
    end
  end
end
