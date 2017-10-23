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
    response = Hash.new
    @trello_member.boards.each do |board|
      cards = []
      board.cards.each do |card|
        if card.member_ids.include?(@trello_member.id)
          cards << card.name
        end
      end
      response[board.name] = cards
    end
    response
  end

  def member_id
    @trello_member.id
  end

end
