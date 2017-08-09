class User < ApplicationRecord
  enum role: { admin: 0, member: 1 }
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :omniauthable, omniauth_providers: [:google_oauth2, :trello]

  has_many :timelogs, dependent: :destroy

  def self.from_omniauth(access_token)
    data = access_token.info
    user = User.where(email: data['email']).first

    unless user
      user = User.create(
            email: data['email'],
            password: Devise.friendly_token[0,20]
            )
    end
    user
  end
end