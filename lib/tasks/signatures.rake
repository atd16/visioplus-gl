require 'bigbluebutton_api'

namespace :signatures do
  desc "Handle user disconnect from room to populate Signatures disconnected_at field"
  task handle_disconnect: :environment do
    if defined?(Rails)
      Rails.logger = Logger.new(STDOUT)
    end
    Rails.logger.info "Handle Disconnect"
    signatures = Signature.where(created_at: (Time.now - 24.hours)..Time.now).where(disconnected_at: nil)
    signatures.each do |signature|
      if signature.room.is_room_running()
        infos = signature.room.get_meeting_info()
        if !infos[:attendees].any? {|attendee| attendee[:userID] == signature.user.uid}
          Rails.logger.info "#{signature.user.uid} disconnected from #{signature.room.bbb_id}"
          signature.update(disconnected_at: DateTime.current)
        end
      else
        Rails.logger.info "#{signature.user.uid} disconnected from #{signature.room.bbb_id}"
        signature.update(disconnected_at: DateTime.current)
      end
    end
  end
end
