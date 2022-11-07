# frozen_string_literal: true

class SharedAccess < ApplicationRecord
  belongs_to :room
  belongs_to :user
  belongs_to :proc_user, foreign_key: :tic_proc_user, class_name: "User", optional: true

  scope :with_vote_access, -> { where(tic_status: ["v"]) }
  scope :with_proxy_access, -> { where(tic_status: ["p"]) }
end
