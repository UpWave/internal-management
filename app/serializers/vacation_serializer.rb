class VacationSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :start_date, :end_date, :status, :type
end
