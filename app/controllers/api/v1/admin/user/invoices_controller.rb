class Api::V1::Admin::User::InvoicesController < Api::V1::BaseController
  before_action :authenticate_user!, :load_user

  def index
    authorize :invoice, :index?
    @invoice = @user.timelogs.start_time.date_invoice_range(formatted_date)
    render json: { "invoice": @invoice, "user": @user, "salary_type": @user.salary_type, "salary_amount": @user.salary, "day_offs_this_month": @user.count_approved_day_offs_by_month(formatted_date) }
  end


  private
    def requested_date
      unless params[:date]
        params[:date] = Date.today
      end
      params.permit(:date)
    end

    def formatted_date
      if requested_date
        Date.parse(requested_date.to_s)
      else
        Date.today
      end
    end

    def load_user
      @user = User.find(params[:user_id])
      authorize @user
    end
end
