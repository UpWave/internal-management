class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :role, :status, :salary, :photo, :first_name, :last_name

  def salary
    self.object.salary
  end

  def photo
    self.object.photo
  end
end
