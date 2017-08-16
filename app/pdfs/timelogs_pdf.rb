require 'prawn'
require 'prawn/table'
class TimelogsPdf < Prawn::Document

  def initialize(timelogs)
    super()
    @timelogs = timelogs
    fill_document
  end

  def fill_document
    text "Timelogs\n" + "Owner: " + User.find(@timelogs.first.user_id).email.to_s
    data = [["ID", "Start time", "Duration", "End time", "Trello card"]]
    table(data, :column_widths => [40, 100, 70, 100, 200])
    @timelogs.each do |timelog|
      data = [[timelog.id.to_s, timelog.start_time.to_s, timelog.duration.to_s + " min", timelog.end_time.to_s, timelog.trello_card.to_s]]
      table(data, :column_widths => [40, 100, 70, 100, 200])
    end
  end

end