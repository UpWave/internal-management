class User < ApplicationRecord
  enum role: { admin: 0, member: 1 }
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable,
         :validatable, :omniauthable
  after_create :first_identity

  has_many :timelogs, dependent: :destroy
  has_many :identities, dependent: :destroy

  # def self.from_omniauth(access_token)
  #   data = access_token.info
  #   user = User.where(email: data['email']).first

  #   unless user
  #     user = User.create(
  #           email: data['email'],
  #           password: Devise.friendly_token[0,20]
  #           )
  #   end
  #   user
  # end
  

  def first_identity
    self.identities.first_or_create!(:uid => self.uid, :provider => self.provider, :user_id => self.id)
    Identity.where(:user_id => nil).destroy_all
  end

  def self.from_omniauth(auth)
    where(provider: auth.provider, uid: auth.uid).first_or_create do |user|

      user.uid = auth.uid
      user.provider = auth.provider
      #user.name = auth.info.name
      user.email = auth.info.email
      user.password = Devise.friendly_token[0,20]
      #user.image = auth.info.image
  end
end
end