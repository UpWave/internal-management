class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :role, :status, :salary, :photo, :first_name, :last_name, :sick_leave_approved, :sick_leave_pending,
             :day_offs_approved, :day_offs_pending, :planned_vac_approved, :planned_vac_pending

  def salary
    self.object.salary
  end

  def photo
    self.object.photo
  end

  def sick_leave_approved
    vacations("approved", "sick leave")
  end

  def sick_leave_pending
    vacations("pending", "sick leave")
  end

  def day_offs_approved
    vacations("approved", "unpaid day offs")
  end

  def day_offs_pending
    vacations("pending", "unpaid day offs")
  end

  def planned_vac_approved
    vacations("approved", "planned vacation")
  end

  def planned_vac_pending
    vacations("pending", "planned vacation")
  end


  def vacations(status, type)
    vacations = self.object.vacations.where(["status = ? and type = ?", Vacation.statuses["#{status}"],  Vacation.types["#{type}"]])
    days = 0
    vacations.each do |v|
      days += (v.end_date - v.start_date).to_i
    end
    days
  end

end
