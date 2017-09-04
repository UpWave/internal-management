import React from 'react';
import ReactDOM from 'react-dom';
import ReactPaginate from 'react-paginate';
import Timelogs from './timelogs';
import NewTimelog from './new_timelog';

class Body extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      timelogs: [],
      trelloCards: [],
      page: 0,
      pageCount: 1,
      perPage: 3,
      startTime: 0,
      endTime: 0,
    };
    this.handleSubmit = this.handleSubmit.bind(this, this.state);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.removeTimelog = this.removeTimelog.bind(this, this.state);
    this.updateTimelogs = this.updateTimelogs.bind(this, this.state);
    this.loadTimelogs = this.loadTimelogs.bind(this, this.state);
    this.filterByDuration = this.filterByDuration.bind(this, this.state);
    this.filterByStartTime = this.filterByStartTime.bind(this, this.state);
    this.filterByEndTime = this.filterByEndTime.bind(this, this.state);
    this.filterByTimeRange = this.filterByTimeRange.bind(this, this.state);
    this.discardFilter = this.discardFilter.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
  }

  componentDidMount() {
    $.getJSON('/api/v1/timelogs/trello_cards.json', (response) => { this.setState({ trelloCards: response }); });
    this.loadTimelogs();
  }

  loadTimelogs() {
    // Get all timelogs for pageCount
    $.ajax({
      url: '/api/v1/timelogs',
      beforeSend(xhr) { xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content')); },
      data: {
        limit: 0,
        page: 0,
        start_time: this.state.startTime,
        end_time: this.state.endTime,
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
    const timelogs = this.state.timelogs.sort((a, b) => a.duration > b.duration);
    this.setState({ timelogs });
  }

  filterByStartTime() {
    const timelogs = this.state.timelogs.sort((a, b) => a.start_time > b.start_time);
    this.setState({ timelogs });
  }

  filterByEndTime() {
    const timelogs = this.state.timelogs.sort((a, b) => a.end_time > b.end_time);
    this.setState({ timelogs });
  }

  filterByTimeRange() {
    this.loadTimelogs();
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
        this.updateTimelogs(timelog);
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
    this.setState({ startTime: event.target.value });
  }

  handleEndDateChange(event) {
    this.setState({ endTime: event.target.value });
  }

  discardFilter() {
    this.setState({
      start_time: 0,
      end_time: 0,
    }, () => {
      this.loadTimelogs();
    });
  }

  render() {
    if (this.state.trelloCards.length === 0) {
      return (
        <div>
          <h3>To create timelogs connect your <a href="/users/auth/trello">Trello</a> first</h3>
        </div>
      );
    } else if (this.state.timelogs.length === 0) {
      return (
        <div>
          <h3>There are no timelogs</h3>
          <NewTimelog key="new_timelog" trello_cards={this.state.trello_cards} handleSubmit={this.handleSubmit} />
        </div>
      );
    }
    return (
      <div>
        Filter by:
        <button onClick={this.filterByDuration}>Duration</button>
        <button onClick={this.filterByStartTime}>Start time</button>
        <button onClick={this.filterByEndTime}>End time</button><br /><br />
            Select time range:
        <input type="datetime-local" id="startDate" onChange={this.handleStartDateChange} />
        <input type="datetime-local" id="endDate" onChange={this.handleEndDateChange} />
        <button onClick={this.discardFilter}>X</button>
        <button onClick={this.filterByTimeRange}>Submit</button><br /><br />
        <Timelogs key={this.state.timelogs.length.toString()} trelloCards={this.state.trelloCards} timelogs={this.state.timelogs} handleDelete={this.handleDelete} onUpdate={this.handleUpdate} />
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
        <NewTimelog key="new_timelog" trelloCards={this.state.trelloCards} handleSubmit={this.handleSubmit} />
      </div>
    );
  }
}

ReactDOM.render(
  <Body />,
  document.getElementById('root'),
);
