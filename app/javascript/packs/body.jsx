import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import ReactPaginate from 'react-paginate';
import Timelogs from './timelogs.jsx'
import NewTimelog from './new_timelog.jsx'

class Body extends React.Component {

  constructor(props) {
    super(props);
    this.state = { timelogs: [], trello_cards: [], page: 0, pageCount: 1, perPage: 3 };
    this.handleSubmit = this.handleSubmit.bind(this, this.state);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.removeTimelog = this.removeTimelog.bind(this, this.state);
    this.updateTimelogs = this.updateTimelogs.bind(this, this.state);
    this.loadTimelogs = this.loadTimelogs.bind(this, this.state);
    this.filterByDuration = this.filterByDuration.bind(this, this.state);
    this.filterByStartTime = this.filterByStartTime.bind(this, this.state);
    this.filterByEndTime = this.filterByEndTime.bind(this, this.state);
  }

  loadTimelogs() {
    $.getJSON('/api/v1/timelogs.json', (response) => { this.setState({ pageCount: Math.ceil(response.length / this.state.perPage)}) });
     $.ajax({
      url      : '/api/v1/timelogs',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      data     : {limit: this.state.perPage, page: this.state.page},
      dataType : 'json',
      type     : 'GET',

      success: data => {
        this.setState({timelogs: data});
      }
    });
  }

  componentDidMount() {
    this.loadTimelogs();
    $.getJSON('/api/v1/timelogs/trello_cards.json', (response) => { this.setState({ trello_cards: response }) });
  }

  handleSubmit(timelog) {
    this.loadTimelogs();
  }

  handleDelete(id) {
    $.ajax({
      url: `/api/v1/timelogs/${id}`,
      type: 'DELETE',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      success:() => {
        this.removeTimelog(id);
      }
    });
  }

  filterByDuration(){
    var timelogs = this.state.timelogs.sort(function(a,b) { return a.duration > b.duration; });
    this.setState({timelogs: timelogs })
  }

  filterByStartTime(){
    var timelogs = this.state.timelogs.sort(function(a,b) { return a.start_time > b.start_time; });
    this.setState({timelogs: timelogs })
  }

  filterByEndTime(){
    var timelogs = this.state.timelogs.sort(function(a,b) { return a.end_time > b.end_time; });
    this.setState({timelogs: timelogs })
  }

  removeTimelog(timelog_id) {
    if (this.state.timelogs.length === 1) {
      this.setState({page: this.state.page - 1})
    }
    this.loadTimelogs();
    //var newTimelogs = this.state.timelogs.filter(function(timelog) {
    //  return timelog.id != timelog_id;
    //});
    //this.setState({ timelogs: newTimelogs });
  }

  handleUpdate(timelog) {
    $.ajax({
      url: `/api/v1/timelogs/${timelog.id}`,
      type: 'PATCH',
      beforeSend: function(xhr) {xhr.setRequestHeader('X-CSRF-Token', $('meta[name="csrf-token"]').attr('content'))},
      data: { timelog: timelog },
      success: () => {
        this.updateTimelogs(timelog);
      }
    });
  }

  updateTimelogs(timelog) {
    this.loadTimelogs();
    //var timelogs = this.state.timelogs.filter((i) => { return i.id != timelog.id });
    //timelogs.push(timelog);
    //this.setState({timelogs: timelogs })
  }

  handlePageClick = (data) => {
    this.setState({page: data.selected}, () => {
      this.loadTimelogs();
    });
  }

  render() {
    if (this.state.timelogs.length === 0) {
      return (
        <div>
          <NewTimelog key='new_timelog' trello_cards={this.state.trello_cards} handleSubmit={this.handleSubmit} />
        </div>
        )
    } else {
      return (
        <div>
          Filter by:
          <button onClick={this.filterByDuration}>Duration</button>
          <button onClick={this.filterByStartTime}>Start time</button>
          <button onClick={this.filterByEndTime}>End time</button>
          <Timelogs key={this.state.timelogs.length.toString()} trello_cards={this.state.trello_cards} timelogs={this.state.timelogs}  handleDelete={this.handleDelete} onUpdate={this.handleUpdate}/>
          <ReactPaginate previousLabel={"previous"}
                         nextLabel={"next"}
                         breakLabel={<a href="">...</a>}
                         breakClassName={"break-me"}
                         pageCount={this.state.pageCount}
                         marginPagesDisplayed={2}
                         pageRangeDisplayed={5}
                         onPageChange={this.handlePageClick}
                         containerClassName={"pagination"}
                         subContainerClassName={"pages pagination"}
                         activeClassName={"active"} />
          <NewTimelog key='new_timelog' trello_cards={this.state.trello_cards} handleSubmit={this.handleSubmit} />
        </div>
      )
    }
  }
}

ReactDOM.render(
  <Body />,
  document.getElementById('root')
);