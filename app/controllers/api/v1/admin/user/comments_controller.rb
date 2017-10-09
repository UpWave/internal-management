class Api::V1::Admin::User::CommentsController < Api::V1::BaseController
  before_action :authenticate_user!
  before_action :load_comment, only: [:update, :destroy]

  def index
    @user = User.find(params[:user_id])
    @comments = @user.comments
    authorize @comments
    respond_with :api, :v1, :admin, @comments
  end

  def create
    @comment = Comment.new(comment_params)
    @comment.author_id = current_user.id
    authorize @comment
    if @comment.save
      respond_with  @comment, json: @comment
    else
      render json: { errors: @comment.errors.full_messages }, status: 422
    end
  end

  def update
    authorize @comment
    if current_user.id == @comment.author_id
      if @comment.update_attributes(comment_params)
        respond_with @comment, json: @comment
      else
        render json: { errors: @comment.errors.full_messages }, status: 422
      end
    else
      render json: { message: "You can update only your comments" }, status: 422
    end
  end

  def destroy
    if current_user.id == @comment.author_id
      authorize @comment
      @comment.destroy
    else
      render json: { message: "You can update only your comments" }, status: 422
    end
  end

  private

  def comment_params
    params.require(:comment).permit(:id, :user_id, :author_id, :body)
  end

  def load_comment
    @comment = Comment.find(params[:id])
  end

end