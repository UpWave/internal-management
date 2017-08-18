require 'prawn'
require 'prawn/table'
class TimelogsPdf < Prawn::Document
  COLUMNS = ["ID", "Start time", "Duration", "End time", "Trello card"]
  COLUMNS_WIDTHS = [40, 100, 70, 100, 200]

  def initialize(timelogs, user)
    super()
    @timelogs = timelogs
    @user = user
    unless @timelogs.empty?
      header
      fill_document
    else
      text("#{@user.email} has no timelogs yet")
    end
  end

  private
    def header
      text("Timelogs\nOwner: #{@user.email}")
    end

    def fill_document
      content = [COLUMNS]
      @timelogs.each do |timelog|
        content.push([timelog.id.to_s, timelog.start_time.to_s, "#{timelog.duration.to_s} min", timelog.end_time.to_s, timelog.trello_card])
      end
      table(content, column_widths: COLUMNS_WIDTHS)
    end

end