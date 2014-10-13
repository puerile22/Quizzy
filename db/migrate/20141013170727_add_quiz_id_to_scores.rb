class AddQuizIdToScores < ActiveRecord::Migration
  def change
    add_column :scores, :quiz_id, :integer
  end
end
