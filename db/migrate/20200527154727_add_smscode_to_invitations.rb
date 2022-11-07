class AddSmscodeToInvitations < ActiveRecord::Migration[5.2]
  def change
    add_column :invitations, :tic_smscode, :string
    add_column :invitations, :tic_phone, :string
    add_column :invitations, :tic_num_adh, :string
    add_column :invitations, :tic_is_phone_valid, :boolean, :default => false

    Invitation.reset_column_information
    Invitation.update_all(tic_is_phone_valid: false)
  end
end
