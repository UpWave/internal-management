class TrelloController < ApplicationController
  def index
    @me = Trello::Member.find("markiyanivancho1")
  end
end
