import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import Timelog from './timelog.jsx'

class Timelogs extends React.Component {

  handleDelete(id) {
    this.props.handleDelete(id);
  }

  onUpdate(timelog) {
    this.props.onUpdate(timelog);
  }

  render() {
    var timelogs = this.props.timelogs.map((timelog) => {
      return (
        <div key={timelog.id}>
          <Timelog timelog={timelog} handleDelete={this.handleDelete.bind(this, timelog.id)} handleUpdate={this.onUpdate.bind(this)} />
        </div>
      )
    })
    return(
      <div>
        {timelogs}
      </div>
    )
  }
}

export default Timelogs;