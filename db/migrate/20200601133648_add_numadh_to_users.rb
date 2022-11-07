class AddNumadhToUsers < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :tic_num_adh, :string
  end
end
