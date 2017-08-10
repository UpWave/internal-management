class User < ApplicationRecord
  enum role: { admin: 0, member: 1 }
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable,
         :validatable, :omniauthable

  has_many :timelogs, dependent: :destroy
  has_many :identities, dependent: :destroy

  def has_trello?
    identities.pluck("provider").include?("trello")
  end

  def has_google?
    identities.pluck("provider").include?("google_oauth2")
  end

  def has_all?
    identities.pluck("provider").count == 2
  end

  def connect_google(auth)
    Identity.create(:uid => auth.uid, :provider => auth.provider, :user_id => id)  
  end

  def connect_trello(auth)
    Identity.create(:uid => auth.uid, :provider => auth.provider, :user_id => id, :access_token => auth.extra.access_token.token, :secret_token => auth.extra.access_token.secret)  
  end

  def update_trello(auth)
    Identity.find_by(:uid => auth.uid, :provider => auth.provider, :user_id => id).update_attributes(:access_token => auth.extra.access_token.token, :secret_token => auth.extra.access_token.secret)
  end

  def self.from_omniauth(auth)
    where(email: auth.info.email).first_or_create do |user|  
      user.password = Devise.friendly_token[0,20]
    end
  end
end