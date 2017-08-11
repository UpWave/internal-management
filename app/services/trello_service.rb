require 'trello'
class TrelloService
  
  def initialize(current_user)
    if current_user.has_trello?
      Trello.configure do |config|
        config.consumer_key = ENV['TRELLO_DEVELOPER_PUBLIC_KEY'] 
        config.consumer_secret = ENV['TRELLO_SECRET']
        config.oauth_token = current_user.identities.pluck("access_token").first
        config.oauth_token_secret = current_user.identities.pluck("secret_token").first
      end
      @trello_member = Trello::Member.find(current_user.identities.where(:provider => "trello").pluck("uid").first)
    end
  end

  def cards
    trello_cards = []
    @trello_member.cards.each { |card| trello_cards << card.name }
    trello_cards
  end

  def boards
    trello_boards = []
    @trello_member.boards.each { |board| trello_boards << board.name }
    trello_boards
  end

  def member
    trello_member = @trello_member
  end

end