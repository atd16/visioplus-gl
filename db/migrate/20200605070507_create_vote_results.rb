class CreateVoteResults < ActiveRecord::Migration[5.2]
  def change
    create_table :vote_results do |t|
      t.references :vote, foreign_key: true
      t.references :user, foreign_key: true
      t.references :proxied_by, foreign_key: {to_table: :users}
      t.string :value
      t.integer :weight
      t.timestamps
    end
  end
end
