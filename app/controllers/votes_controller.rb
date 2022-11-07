class VotesController < ApplicationController
  include Pagy::Backend
  include Recorder
  include Joiner
  include Populator

  before_action :find_vote

  # Find the room from the uid.
  def find_vote
    @vote = Vote.find_by!(id: params[:vote_id])
  end

  # GET /:vote_id/admin_infos
  def admin_infos
    respond_to do |format|
    format.json { render body: @vote.info.to_json }
    end
  end
end
