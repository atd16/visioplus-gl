class AddUniqueIndexToVoteResults < ActiveRecord::Migration[5.2]
  def change
    add_index :vote_results, [:vote_id, :user_id], unique: true
  end
end
