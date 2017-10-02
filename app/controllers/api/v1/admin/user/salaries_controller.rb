class Api::V1::Admin::User::SalariesController < Api::V1::BaseController
  before_action :authenticate_user!
  before_action :load_salaries

  def index
    respond_with @salaries.last
  end

  def create
    new_salary = SalaryCreator.new(@salaries, salary_params)
    if new_salary.create
      respond_with :api, :v1, :admin, @salaries.last.user, @salaries.last.user, @salaries.last
    else
      render json: { errors: new_salary.errors.full_messages }, status: 422
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
    @salaries.build
  end

  def destroy
    if @salaries.last.destroy
      render json: { }, status: 200
    else
      render json: { errors: "Something went wrong" }, status: 422
    end
  end

  private
    def salary_params
      params.require(:salary).permit(:amount, :review_date, :type)
    end

    def load_salaries
      @salaries = User.find(params[:user_id]).salaries
      authorize @salaries
    end

end
