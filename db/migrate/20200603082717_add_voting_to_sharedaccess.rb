class AddVotingToSharedaccess < ActiveRecord::Migration[5.2]
  def change
    add_column :shared_accesses, :tic_weight, :integer
    add_column :shared_accesses, :tic_status, :string
    add_column :shared_accesses, :tic_proc_user, :integer, index: true
    add_foreign_key :shared_accesses, :users, column: :tic_proc_user
  end
end
