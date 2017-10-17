class User < ApplicationRecord
  enum role: { admin: 0, member: 1 }
  enum status: { inactive: 0, active: 1 }
  devise :database_authenticatable,
         :rememberable, :trackable,
         :validatable, :omniauthable,
         :recoverable
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

  def count_approved_day_offs_by_month(date)
    duration = 0
    vacations.approved.where("type" == "unpaid day offs").in_month(date).each do |vac|
      duration = duration + vac.business_day_offs(date)
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

  def sick_leave_approved
    vacation_count("approved", "sick leave")
  end

  def sick_leave_pending
    vacation_count("pending", "sick leave")
  end

  def day_offs_approved
    vacation_count("approved", "unpaid day offs")
  end

  def day_offs_pending
    vacation_count("pending", "unpaid day offs")
  end

  def planned_vac_approved
    vacation_count("approved", "planned vacation")
  end

  def planned_vac_pending
    vacation_count("pending", "planned vacation")
  end


  def vacation_count(status, type)
    vacations = self.vacations.where(["status = ? and type = ?", Vacation.statuses["#{status}"],  Vacation.types["#{type}"]])
    days = 0
    vacations.each do |v|
      days += (v.end_date - v.start_date).to_i
    end
    days
  end
end
