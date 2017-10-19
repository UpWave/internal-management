require 'trello'
class TrelloService

  def initialize(current_user)
    Trello.configure do |config|
      config.consumer_key = ENV['TRELLO_DEVELOPER_PUBLIC_KEY']
      config.consumer_secret = ENV['TRELLO_SECRET']
      config.oauth_token = current_user.identities.where(:provider => "trello").pluck("access_token").first
      config.oauth_token_secret = current_user.identities.where(:provider => "trello").pluck("secret_token").first
    end
    @trello_member = Trello::Member.find(current_user.identities.where(:provider => "trello").pluck("uid").first)
  end

  def boards_with_cards
    response = []
    @trello_member.boards.each do |board|
      current_board = []
      current_board << board.name
      board_cards = []
      board.cards.each do |card|
        if card.member_ids.include?(@trello_member.id)
          board_cards << card.name
        end
      end
      current_board << board_cards
      response << current_board
    end
    board_info = Hash.new
    response.each do |board|
      board_info[board[0]] = board[1]
    end
    board_info
  end

  def member
    trello_member = @trello_member
  end

end
