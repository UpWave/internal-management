class SalaryCreator

  def initialize(salaries, params)
    @salaries = salaries
    @params = params
  end

  def create
    new_salary
  end

  private
    def new_salary
      Salary.transaction do
        unless @salaries.length == 0
          @salaries.last.update_attributes(archived_at: Date.current)
        end
        salary = @salaries.build(@params)
        salary.save
      end
    end

end
