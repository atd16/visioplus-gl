class AddExceptJoinTokenToRooms < ActiveRecord::Migration[5.2]
  def change
    add_column :rooms, :tic_except_join_token, :string
  end
end
