class AddGoalsCountToEvaluations < ActiveRecord::Migration[5.1]
  def change
    add_column :evaluations, :goals_count, :integer, default: 0
  end
end
