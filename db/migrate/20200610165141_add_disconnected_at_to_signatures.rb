class AddDisconnectedAtToSignatures < ActiveRecord::Migration[5.2]
  def change
    add_column :signatures, :disconnected_at, :datetime
  end
end
