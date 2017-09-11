class Api::V1::Admin::SalariesController < Api::V1::BaseController
  before_action :authenticate_user!
  before_action :load_salaries

  def index
    respond_with @salaries.last
  end

  def create
    new_salary = SalaryCreator.new(@salaries, salary_params)
    if new_salary.success?
      respond_with :api, :v1, :admin, @salaries.last
    else
      render json: { errors: "Something went wrong" }, status: 422
    end
  end

  def update
    if @salaries.last.update_attributes(salary_params)
      respond_with @salaries, json: @salaries
    else
      render json: { errors: @salaries.last.errors.full_messages }, status: 422
    end
  end

  def new
    authorize @salaries
    @salaries.build
  end

  def destroy
    respond_with @salaries.last.destroy
  end

  private
    def salary_params
      params.require(:salary).permit(:amount, :review_date)
    end

    def load_salaries
      @salaries = User.find(params[:id]).salaries
      authorize @salaries
    end

end
