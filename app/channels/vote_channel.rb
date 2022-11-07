class VoteChannel < ApplicationCable::Channel
  def subscribed
    reject and return if current_user.blank?

    room = Room.find_by!(bbb_id: params[:meetingid])

    can_access_room = room.owner == current_user || room.shared_with?(current_user)
    reject and return unless can_access_room

    stream_from "#{params[:meetingid]}_vote_channel"
  end

  def start_vote(data)
    # TODO : check si l'utilisateur a les droits
    room = Room.find_by!(bbb_id: params[:meetingid])

    vote = Vote.create!(
      room: room,
      created_by: current_user,
      anonymous: data.fetch("anonymous", false),
      description: data.fetch("description", ""),
    )

    ActionCable.server.broadcast "#{params[:meetingid]}_vote_channel", {
      action: 'vote_started',
      vote_id: vote.id,
      anonymous: vote.anonymous,
      description: vote.description,
      info: vote.info,
    }
  end

  def update_vote(data)
    vote = Vote.find_by!(id: data["id"], created_by: current_user)

    if data.key?("anonymous")
      vote.anonymous = data.fetch("anonymous")
    end
    if data.key?("description")
      vote.description = data.fetch("description")
    end

    vote.save!

    ActionCable.server.broadcast "#{params[:meetingid]}_vote_channel", {
      action: 'vote_updated',
      vote_id: vote.id,
      anonymous: vote.anonymous,
      description: vote.description,
      info: vote.info,
    }
  end

  def register_vote_result(data)
    vote = Vote.find(data["vote_id"])
    shared_access = SharedAccess.with_vote_access.find_by!(
      room: vote.room,
      user: current_user,
    )

    vote_result = VoteResult.create!(
      vote: vote,
      user: current_user,
      value: data["value"],
      weight: shared_access.tic_weight,
    )

    ActionCable.server.broadcast "#{params[:meetingid]}_vote_channel", {
      action: 'vote_result_registered',
      vote_id: vote.id,
      vote_result_id: vote_result.id,
      useruid: current_user.uid,
      value: vote_result.value,
      vote_info: vote.info,
    }
  end

  def register_proxy_vote_result(data)
    vote = Vote.find(data["vote_id"])
    user = User.find_by!(uid: data["useruid"])
    shared_access = SharedAccess.with_proxy_access.find_by!(
      room: vote.room,
      user: user,
      proc_user: current_user,
    )

    vote_result = VoteResult.create!(
      vote: vote,
      user: user,
      proxied_by: current_user,
      value: data["value"],
      weight: shared_access.tic_weight,
    )

    ActionCable.server.broadcast "#{params[:meetingid]}_vote_channel", {
      action: 'vote_result_registered',
      vote_id: vote.id,
      vote_result_id: vote_result.id,
      useruid: user.uid,
      proxy_user: current_user,
      value: vote_result.value,
      vote_info: vote.info,
    }
  end

  def close_vote(data)
    vote = Vote.find_by!(id: data["id"], created_by: current_user, closed_at: nil)

    vote.close(data["is_published"])

    ActionCable.server.broadcast "#{params[:meetingid]}_vote_channel", {
      action: 'vote_closed',
      id: vote.id,
      is_published: data["is_published"],
      infos: vote.info,
      closed_at: vote.closed_at,
    }
  end

  def vote_info(data)
    vote = Vote.find_by!(id: data["id"])

    ActionCable.server.broadcast "#{params[:meetingid]}_vote_channel", {
      action: 'vote_info',
      id: vote.id,
      anonymous: vote.anonymous,
      description: vote.description,
      info: vote.info,
    }
  end
end
