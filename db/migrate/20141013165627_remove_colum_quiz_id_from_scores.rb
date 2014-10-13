class RemoveColumQuizIdFromScores < ActiveRecord::Migration
  def change
    remove_column :scores, :quiz_id
  end
end
