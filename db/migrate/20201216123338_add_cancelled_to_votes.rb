class AddCancelledToVotes < ActiveRecord::Migration[5.2]
  def change
    add_column :votes, :cancelled, :boolean, default: false
  end
end
