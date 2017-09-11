class SalaryCreator

  def initialize(salaries, params)
    @salaries = salaries
    @params = params
    new_salary
  end

  def success?
    ((@salaries.last(2).last.amount == @params["amount"].to_i) && (@salaries.last(2).first.archived_at == Date.current))
  end

  private
    def new_salary
      Salary.transaction do
        unless @salaries.length == 0
          @salaries.last.update_attributes(archived_at: Date.current)
        end
        salary = @salaries.build(@params)
        salary.save!
      end
    end

end
