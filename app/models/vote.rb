class Vote < ApplicationRecord
  belongs_to :room
  belongs_to :created_by, class_name: "User"
  has_many :vote_results

  def close(is_published)
    self.closed_at = Time.now
    self.cancelled = !is_published
    save!
  end

  def info
    {
      vote_results: results,
      totals: totals,
    }
  end

  def results
    return [] if anonymous?

    vote_results.map do |vr|
      {
        useruid: vr.user.uid,
        username: vr.user.name,
        value: vr.value,
        weight: vr.weight,
      }
    end
  end

  def totals
    num_respondents = room.shared_access.with_vote_access.count + room.shared_access.with_proxy_access.count

    yes_count = vote_results.yes.count
    no_count = vote_results.no.count
    abs_count = vote_results.abs.count
    total_count = vote_results.count

    weighted_yes = vote_results.yes.total_weight
    weighted_no = vote_results.no.total_weight
    weighted_abs = vote_results.abs.total_weight
    weighted_total = vote_results.total_weight - weighted_abs
    weighted_total_with_abs = vote_results.total_weight

    {
      num_respondents: num_respondents,
      yes_count: yes_count,
      no_count: no_count,
      abs_count: abs_count,
      total_count: total_count,
      weighted_yes: weighted_yes,
      weighted_no: weighted_no,
      weighted_abs: weighted_abs,
      weighted_total: weighted_total,
      yes_percentage: weighted_yes.to_f * 100 / weighted_total.to_f,
      yes_percentage_with_abs: weighted_yes.to_f * 100 / weighted_total_with_abs.to_f,
      no_percentage: weighted_no.to_f * 100 / weighted_total.to_f,
      no_percentage_with_abs: weighted_no.to_f * 100 / weighted_total_with_abs.to_f,
      abs_percentage: weighted_abs.to_f * 100 / weighted_total_with_abs.to_f,
    }
  end
end
