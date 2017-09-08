class Api::V1::Admin::SalariesController < Api::V1::BaseController
  before_action :authenticate_user!
  before_action :load_salary

  def index
    respond_with @salary.last
  end

  def create
    if archive_salary
      new_salary = @salary.build(salary_params)
      if new_salary.save
        respond_with :api, :v1, :admin, new_salary
      end
    end
  end

  def update
    if @salary.last.update_attributes(salary_params)
      respond_with @salary, json: @salary
    end
  end

  def new
    @salary.build
    authorize @salary
  end

  def destroy
    respond_with @salary.last.destroy
  end

  private
    def salary_params
      params.require(:salary).permit(:amount, :review_date)
    end

    def archive_salary
      unless @salary.length == 0
        @salary.last.update_attributes(archived_at: params[:salary][:archived_at])
      else true
      end
    end

    def load_salary
      @salary = User.find(params[:id]).salaries
      authorize @salary
    end

end
