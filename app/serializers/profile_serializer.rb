class ProfileSerializer < ActiveModel::Serializer
  attributes :id, :email, :role, :status, :salary, :photo, :first_name, :last_name, :sick_leave_approved, :sick_leave_pending,
             :day_offs_approved, :day_offs_pending, :planned_vac_approved, :planned_vac_pending

  def salary
    self.object.salary
  end

  def photo
    self.object.photo
  end
end
