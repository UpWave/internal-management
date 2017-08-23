class User < ApplicationRecord
  enum role: { admin: 0, member: 1 }
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable,
         :validatable, :omniauthable
  has_attached_file :avatar, styles: { medium: "300x300>", thumb: "100x100>" }, default_url: "/assets/default.png"
  validates_attachment_content_type :avatar, content_type: /\Aimage\/.*\z/

  has_many :timelogs, dependent: :destroy
  has_many :identities, dependent: :destroy
  has_many :vacations, dependent: :destroy

  def has_trello?
    identities.pluck("provider").include?("trello")
  end

  def has_google?
    identities.pluck("provider").include?("google_oauth2")
  end

  def has_all?
    identities.pluck("provider").count == 2
  end

  def self.from_omniauth(auth)
    where(email: auth.info.email).first_or_create do |user|  
      user.password = Devise.friendly_token[0,20]
    end
  end
end