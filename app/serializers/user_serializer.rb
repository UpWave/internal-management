class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :role, :status, :salary, :photo, :first_name, :last_name, :pending_vacations, :approved_vacations

  def salary
    self.object.salary
  end

  def photo
    self.object.photo
  end

  def pending_vacations
    vacations = self.object.vacations.where(status: "pending")
    pending = 0
    vacations.each do |v|
      pending += (v.end_date - v.start_date).to_i
    end
    pending
  end

  def approved_vacations
    vacations = self.object.vacations.where(status: "approved")
    approved = 0
    vacations.each do |v|
      approved += (v.end_date - v.start_date).to_i
    end
    approved
  end
end
