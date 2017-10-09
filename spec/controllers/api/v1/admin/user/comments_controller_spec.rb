require 'rails_helper'

RSpec.describe Api::V1::Admin::User::CommentsController, type: :controller do
  before do
    allow(controller).to receive(:authenticate_user!).and_return(true)
    allow(controller).to receive(:current_user).and_return(admin)
  end

  let(:admin) { create(:user, role: 'admin') }
  let(:member) { create(:user, role: 'member') }

  describe "GET #index" do
    it "allows authenticated access" do
      get :index, params: { user_id: member.id }, format: :json
      expect(response).to be_success
    end

    it "returns user's comments" do
      create(:comment, user_id: member.id, author_id: admin.id)
      get :index, params: {user_id: member.id}, format: :json
      expect(JSON.parse(response.body)).not_to be_empty
    end
  end

  describe "POST #create" do
    it "creates a new comment" do
      comment = build(:comment, user_id: member.id, author_id: admin.id )
      expect{
        post :create, format: :json, params: { user_id: member.id, comment: comment.attributes}
      }.to change(Comment, :count).by(1)
    end

    it "won't create comment with empty body" do
      comment = build(:comment, body: "", user_id: member.id, author_id: admin.id)
      post :create, params: { user_id: member.id, comment: comment.attributes }, format: :json
      expect(JSON.parse(response.body)).to eq({"errors"=>["Body can't be blank"]})
    end
  end

  describe "PUT #update" do
    it "updates comment" do
      comment = create(:comment, user_id: member.id, author_id: admin.id)
      patch :update, format: :json, params: { user_id: member.id, id: comment.id, comment: { body: "new body" } }
      comment.reload
      expect(comment.body).to eql("new body")
    end
  end

  describe "DELETE #destroy" do
    it "deletes comment" do
      comment = create(:comment, user_id: member.id, author_id: admin.id)
      expect{
        get :destroy, params: { user_id: member.id, id: comment.id }, format: :json
      }.to change(Comment, :count).by(-1)
    end
  end
end
