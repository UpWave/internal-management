require 'prawn'
require 'prawn/table'
class TimelogsPdf < Prawn::Document

  def initialize(timelogs)
    super()
    @timelogs = timelogs
    header
    fill_document
  end

  private
    def header
      text "Timelogs\n" + "Owner: " + User.find(@timelogs.first.user_id).email.to_s
    end

    def fill_document
      data = [["ID", "Start time", "Duration", "End time", "Trello card"]]
      @timelogs.each do |timelog|
        data.push([timelog.id.to_s, timelog.start_time.to_s, timelog.duration.to_s + " min", timelog.end_time.to_s, timelog.trello_card.to_s])
      end
      table(data, :column_widths => [40, 100, 70, 100, 200])
    end

end