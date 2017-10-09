require 'rails_helper'

RSpec.describe Api::V1::Admin::CommentsController, type: :controller do
  before do
    allow(controller).to receive(:authenticate_user!).and_return(true)
    allow(controller).to receive(:current_user).and_return(user)
  end

  let(:user) { FactoryGirl.create(:user, role: 'admin') }
  let(:member) { FactoryGirl.create(:user, role: 'member') }


  describe "GET #index" do
    it "allows authenticated access" do
      get :index, format: :json
      expect(response).to be_success
    end

    it "returns user's comments" do
      FactoryGirl.create(:comment, user_id: user.id, receiver_id: member.id)
      get :index, params: {receiver_id: member.id}, format: :json
      expect(JSON.parse(response.body)).not_to be_empty
    end
  end

  describe "POST #create" do
    it "creates a new comment" do
      comment = FactoryGirl.build(:comment)
      expect{
        post :create, format: :json, params: { comment: comment.attributes, user_id: user.id, receiver_id: member.id }
      }.to change(Comment, :count).by(1)
    end

    it "won't create comment with empty body" do
      comment = FactoryGirl.build(:comment, body: "")
      post :create, params: { comment: comment.attributes, user_id: user.id, receiver_id: member.id }, format: :json
      expect(JSON.parse(response.body)).to eq({"errors"=>["Body can't be blank"]})
    end

    it "won't create comment with empty body" do
      comment = FactoryGirl.build(:comment, user_id: user.id, receiver_id: nil)
      post :create, params: { comment: comment.attributes }, format: :json
      expect(JSON.parse(response.body)).to eq({"errors"=>["Receiver can't be blank"]})
    end
  end

  describe "PUT #update" do
    it "updates comment" do
      comment = FactoryGirl.create(:comment, user_id: user.id, receiver_id: member.id)
      patch :update, format: :json, params: { id: comment.id, comment: { body: "new body" } }
      comment.reload
      expect(comment.body).to eql("new body")
    end
  end

  describe "DELETE #destroy" do
    it "deletes comment" do
      comment = FactoryGirl.create(:comment, user_id: user.id, receiver_id: member.id)
      expect{
        delete :destroy, format: :json, params: { id: comment.id }
      }.to change(Comment, :count).by(-1)
    end
  end
end
