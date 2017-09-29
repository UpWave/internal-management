class Api::V1::Admin::User::InvoicesController < Api::V1::BaseController
  before_action :authenticate_user!, :load_user

  def index
    authorize :invoice, :index?
    @invoice = @user.timelogs.date_range(Date.parse(invoice_params.to_s).beginning_of_month, Date.parse(invoice_params.to_s).end_of_month)
    render json: [@invoice, @user.email]
  end


  private
    def invoice_params
      unless params[:date]
        params[:date] = Date.today
      end
      params.permit(:date)
    end

    def load_user
      @user = User.find(params[:user_id])
      authorize @user
    end
end
