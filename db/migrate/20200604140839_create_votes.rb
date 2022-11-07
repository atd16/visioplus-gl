class CreateVotes < ActiveRecord::Migration[5.2]
  def change
    create_table :votes do |t|
      t.references :room, foreign_key: true
      t.references :created_by, foreign_key: {to_table: :users}
      t.string :description
      t.boolean :anonymous, null: false, default: false

      t.timestamps
    end
  end
end
