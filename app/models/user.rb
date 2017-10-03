class User < ApplicationRecord
  enum role: { admin: 0, member: 1 }
  enum status: { inactive: 0, active: 1 }
  devise :database_authenticatable,
         :rememberable, :trackable,
         :validatable, :omniauthable
  has_attached_file :avatar, styles: { medium: "300x300>", thumb: "100x100>" }, default_url: ":style/default.png"
  validates_attachment_content_type :avatar, content_type: /\Aimage\/.*\z/

  has_many :timelogs, dependent: :destroy
  has_many :identities, dependent: :destroy
  has_many :vacations, dependent: :destroy
  has_many :salaries, dependent: :destroy
  has_many :user_skills, dependent: :destroy
  has_many :skills, through: :user_skills, dependent: :destroy

  def has_trello?
    identities.pluck("provider").include?("trello")
  end

  def has_google?
    identities.pluck("provider").include?("google_oauth2")
  end

  def has_all?
    identities.pluck("provider").count == 2
  end

  def photo
    if avatar.exists?
      avatar.url
    elsif has_google?
      identities.where(provider: 'google_oauth2').first.image_url
    else
      #default avatar
      avatar.url
    end
  end

  def salary
    salaries.last.try(:amount) || 0
  end

  def salary_type
    salaries.last.try(:type)
  end

  def count_day_offs_of_month(date)
    duration = 0
    vacations = self.vacations.approved.where("type" == "unpaid day offs").where("start_date >= ? AND end_date <= ?", date.beginning_of_month, date.end_of_month)
    vacations.each do |vac|
      working_days = (vac.start_date..vac.end_date).select { |day| (1..5).include?(day.wday) }.size
      duration = duration + working_days
    end
    duration
  end

  def active_for_authentication?
    super && active?
  end

  def inactive_message
    "Sorry, this account has been deactivated."
  end

  def active?
    status == 'active'
  end

  def self.from_omniauth(auth)
    where(email: auth.info.email).first_or_create do |user|
      user.password = Devise.friendly_token[0,20]
    end
  end
end
