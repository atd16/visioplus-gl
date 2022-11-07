class VoteResult < ApplicationRecord
  belongs_to :vote
  belongs_to :user
  belongs_to :proxied_by, class_name: "User", optional: true

  scope :yes, -> { where(value: "yes") }
  scope :no, -> { where(value: "no") }
  scope :abs, -> { where(value: "abs") }

  validates :value, inclusion: { in: ["yes", "no", "abs"] }

  def self.total_weight
    self.sum(&:weight)
  end
end
