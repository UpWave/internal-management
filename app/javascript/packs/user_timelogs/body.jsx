import React from 'react';
import ReactPaginate from 'react-paginate';
import Timelogs from './timelogs';
import NewTimelog from './new_timelog';

class UserTimelogs extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      timelogs: [],
      trelloCards: [],
      page: 0,
      pageCount: 1,
      perPage: 5,
      startTime: 0,
      endTime: 0,
      filter: '',
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.removeTimelog = this.removeTimelog.bind(this);
    this.updateTimelogs = this.updateTimelogs.bind(this);
    this.loadTimelogs = this.loadTimelogs.bind(this);
    this.filterByDuration = this.filterByDuration.bind(this);
    this.filterByStartTime = this.filterByStartTime.bind(this);
    this.filterByEndTime = this.filterByEndTime.bind(this);
    this.filterByTimeRange = this.filterByTimeRange.bind(this);
    this.discardFilter = this.discardFilter.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.checkDateSubmitVisibility = this.checkDateSubmitVisibility.bind(this);
  }

  componentDidMount() {
    $.getJSON('/api/v1/timelogs/trello_cards.json', (response) => { this.setState({ trelloCards: response }); });
    this.loadTimelogs();
  }

  loadTimelogs() {
    // Get number of timelogs for pageCount
    $.ajax({
      url: '/api/v1/timelogs/count_timelogs',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      data: {
        limit: 0,
        page: 0,
        start_time: this.state.startTime,
        end_time: this.state.endTime,
        filter: this.state.filter,
      },
      dataType: 'json',
      type: 'GET',
      success: (data) => {
        this.setState({ pageCount: Math.ceil(data / this.state.perPage) });
      },
    });
    // Get only few timelogs for current page
    $.ajax({
      url: '/api/v1/timelogs',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      data: {
        limit: this.state.perPage,
        page: this.state.page,
        start_time: this.state.startTime,
        end_time: this.state.endTime,
        filter: this.state.filter,
      },
      dataType: 'json',
      type: 'GET',
      success: (data) => {
        this.setState({ timelogs: data });
      },
    });
  }

  handleSubmit() {
    this.loadTimelogs();
  }

  handleDelete(id) {
    $.ajax({
      url: `/api/v1/timelogs/${id}`,
      type: 'DELETE',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      success: () => {
        this.removeTimelog(id);
      },
    });
  }

  filterByDuration() {
    this.setState({ filter: 'duration' }, () => {
      this.loadTimelogs();
    });
  }

  filterByStartTime() {
    this.setState({ filter: 'start_time' }, () => {
      this.loadTimelogs();
    });
  }

  filterByEndTime() {
    this.setState({ filter: 'end_time' }, () => {
      this.loadTimelogs();
    });
  }

  filterByTimeRange() {
    this.setState({ filter: '' }, () => {
      this.loadTimelogs();
    });
  }

  removeTimelog() {
    if (this.state.timelogs.length === 1) {
      if (this.state.page !== 0) {
        this.setState({ page: this.state.page - 1 });
      }
    }
    this.loadTimelogs();
  }

  handleUpdate(timelog) {
    $.ajax({
      url: `/api/v1/timelogs/${timelog.id}`,
      type: 'PATCH',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      data: { timelog },
      success: () => {
        this.updateTimelogs();
      },
    });
  }

  updateTimelogs() {
    this.loadTimelogs();
  }

  handlePageClick(page) {
    this.setState({ page: page.selected }, () => {
      this.loadTimelogs();
    });
  }

  handleStartDateChange(event) {
    this.setState({ startTime: event.target.value }, () => {
      this.checkDateSubmitVisibility();
    });
  }

  handleEndDateChange(event) {
    this.setState({ endTime: event.target.value }, () => {
      this.checkDateSubmitVisibility();
    });
  }

  checkDateSubmitVisibility() {
    if (this.state.endTime > this.state.startTime) {
      $('#date_submit').css('visibility', 'visible');
    } else {
      $('#date_submit').css('visibility', 'hidden');
    }
  }

  discardFilter() {
    document.getElementById('start_date').value = '';
    document.getElementById('end_date').value = '';
    this.setState({
      startTime: 0,
      endTime: 0,
    }, () => {
      this.loadTimelogs();
      this.checkDateSubmitVisibility();
    });
  }

  render() {
    if (this.state.trelloCards.length === 0) {
      return (
        <div>
          <h3>To create timelogs connect your <a href="/users/auth/trello">Trello</a> first
          and add cards to your boards</h3>
        </div>
      );
    } else if (this.state.timelogs.length === 0) {
      return (
        <div>
          <h3>There are no timelogs</h3>
          <NewTimelog
            key="new_timelog"
            trelloCards={this.state.trelloCards}
            handleSubmit={this.handleSubmit}
          />
        </div>
      );
    }
    return (
      <div className="well">
        Filter by:
        <button onClick={this.filterByDuration}>Duration</button>
        <button onClick={this.filterByStartTime}>Start time</button>
        <button onClick={this.filterByEndTime}>End time</button><br /><br />
            Select time range:
        <input type="datetime-local" id="start_date" onChange={this.handleStartDateChange} />
        <input type="datetime-local" id="end_date" onChange={this.handleEndDateChange} />
        <button id="date_discard" onClick={this.discardFilter}>X</button>
        <button id="date_submit" style={{ visibility: 'hidden' }} onClick={this.filterByTimeRange}>Submit</button><br /><br />
        <Timelogs
          key={this.state.timelogs.length.toString()}
          trelloCards={this.state.trelloCards}
          timelogs={this.state.timelogs}
          handleDelete={this.handleDelete}
          onUpdate={this.handleUpdate}
        />
        <ReactPaginate
          previousLabel={'previous'}
          nextLabel={'next'}
          breakLabel={<a href="">...</a>}
          breakClassName={'break-me'}
          pageCount={this.state.pageCount}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          onPageChange={this.handlePageClick}
          containerClassName={'pagination'}
          subContainerClassName={'pages pagination'}
          activeClassName={'active'}
        />
        <NewTimelog
          key="new_timelog"
          trelloCards={this.state.trelloCards}
          handleSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

export default UserTimelogs;
