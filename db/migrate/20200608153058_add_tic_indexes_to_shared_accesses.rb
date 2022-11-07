class AddTicIndexesToSharedAccesses < ActiveRecord::Migration[5.2]
  def change
    add_index :shared_accesses, :tic_status
    add_index :shared_accesses, :tic_proc_user
  end
end
