class AddAdminmailToInvitations < ActiveRecord::Migration[5.2]
  def change
	add_column :invitations, :tic_adminmail, :string
  end
end
