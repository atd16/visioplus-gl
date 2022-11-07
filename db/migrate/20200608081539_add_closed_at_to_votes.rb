class AddClosedAtToVotes < ActiveRecord::Migration[5.2]
  def change
    add_column :votes, :closed_at, :datetime
  end
end
