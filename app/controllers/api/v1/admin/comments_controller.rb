class Api::V1::Admin::CommentsController < Api::V1::BaseController
  before_action :authenticate_user!

  def index
    @comments = Comment.all
    authorize @comments
    respond_with :api, :v1, :admin, @comments
  end

  def create
    @comment = current_user.comments.new(comment_params)
    @comment.receiver_id = params[:receiver_id]
    authorize @comment
    if @comment.save
      respond_with :api, :v1, :admin, @comment
    else
      render json: { errors: @comment.errors.full_messages }, status: 422
    end
  end

  def update
    @comment = Comment.find(params[:id])
    authorize @comment
    if @comment.update_attributes(comment_params)
      respond_with @comment, json: @comment
    else
      render json: { errors: @comment.errors.full_messages }, status: 422
    end
  end

  def destroy
    authorize Comment
    Comment.find(params[:id]).destroy
  end

  private

  def comment_params
    params.require(:comment).permit(:id, :user_id, :receiver_id, :body)
  end

end